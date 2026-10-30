// app/api/mcp/route.js - MCP Streamable HTTP JSON-RPC 2.0 Server (WebForge v11.1)
import { guardApi } from '@/lib/apiGuard';
import { searchCatalogue, clampLimit, clampOffset, MIN_QUERY } from '@/lib/searchProducts';
import { CATEGORIES, SHOP, SITE, BRAND, CONTACT } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import { waOrderLink } from '@/lib/whatsapp';
import { money } from '@/lib/order';

const MCP_TOOLS = [
  {
    name: 'search_products',
    description: 'Search professional cinema, photo, video, and audio products by keyword (2+ characters), category, or maximum price. Returns up to 50 results per call; use offset to page.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term (e.g. "cinema camera", "shotgun mic")' },
        category: { type: 'string', description: 'Category slug (e.g. "video", "music-audio")' },
        max_price: { type: 'number', description: 'Maximum price in AUD' },
        limit: { type: 'integer', description: 'Results per call (default 24, max 50)' },
        offset: { type: 'integer', description: 'Number of results to skip, for paging' },
      },
    },
  },
  {
    name: 'get_product',
    description: 'Get complete technical specifications, pricing, and stock status for a pro gear product by slug.',
    inputSchema: {
      type: 'object',
      required: ['slug'],
      properties: {
        slug: { type: 'string', description: 'Unique product slug' },
      },
    },
  },
  {
    name: 'list_categories',
    description: 'List all professional gear categories, descriptions, and current inventory counts.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_policies',
    description: 'Get Australian shipping, transit insurance, payment rails, warranty, and returns policies.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'create_order_draft',
    description: 'Prepare a structured pro gear order draft with live prefilled WhatsApp and checkout links. Human completes payment.',
    inputSchema: {
      type: 'object',
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          description: 'Array of items { slug, quantity }',
          items: {
            type: 'object',
            properties: {
              slug: { type: 'string' },
              quantity: { type: 'number' },
            },
          },
        },
        notes: { type: 'string', description: 'Production or delivery notes' },
      },
    },
  },
];

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id',
    },
  });
}

export async function GET(request) {
  const limited = await guardApi(request, 'mcp-get');
  if (limited) return limited;
  return Response.json(
    {
      name: SITE.name,
      version: '1.0.0',
      description: SITE.tagline,
      endpoint: `https://${SITE.domain}/api/mcp`,
      tools: MCP_TOOLS.map((t) => t.name),
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function POST(request) {
  const limited = await guardApi(request, 'mcp', 60, 60);
  if (limited) return limited;
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return Response.json(
      { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const { jsonrpc, id, method, params } = body || {};

  if (jsonrpc !== '2.0') {
    return Response.json(
      { jsonrpc: '2.0', id: id || null, error: { code: -32600, message: 'Invalid Request: jsonrpc must be 2.0' } },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  // 1. initialize
  if (method === 'initialize') {
    return Response.json(
      {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: SITE.name,
            version: '1.0.0',
          },
        },
      },
      { headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' } }
    );
  }

  // 2. tools/list
  if (method === 'tools/list') {
    return Response.json(
      {
        jsonrpc: '2.0',
        id,
        result: {
          tools: MCP_TOOLS,
        },
      },
      { headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' } }
    );
  }

  // 3. tools/call
  if (method === 'tools/call') {
    const { name, arguments: args = {} } = params || {};

    if (name === 'search_products') {
      const q = String(args.query || '').trim().slice(0, 100);
      const cat = args.category ? String(args.category).slice(0, 60) : '';
      const mp = args.max_price ? parseFloat(args.max_price) : NaN;
      const maxPrice = Number.isFinite(mp) && mp > 0 ? mp : Infinity;

      // Bounded: a search term of 2+ characters or a category/price filter, and at most 50 results per call.
      let matched;
      if (q.length < MIN_QUERY && !cat && maxPrice === Infinity) {
        matched = { error: `Provide a query of at least ${MIN_QUERY} characters, or a category or max_price filter.` };
      } else {
        const found = searchCatalogue({ q, category: cat, maxPrice, limit: clampLimit(args.limit), offset: clampOffset(args.offset) });
        matched = { products: found.items, total: found.total, hasMore: found.hasMore };
      }

      return Response.json(
        {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(matched, null, 2) }] },
        },
        { headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (name === 'get_product') {
      const product = PRODUCTS.find((p) => p.slug === args.slug);
      if (!product) {
        return Response.json(
          { jsonrpc: '2.0', id, error: { code: -32004, message: `Product "${args.slug}" not found` } },
          { headers: { 'Access-Control-Allow-Origin': '*' } }
        );
      }
      return Response.json(
        {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    ...product,
                    currency: SITE.currency,
                    url: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        },
        { headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (name === 'list_categories') {
      const cats = CATEGORIES.map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        productCount: PRODUCTS.filter((p) => p.category === c.slug).length,
        url: `https://${SITE.domain}/shop/${c.slug}/`,
      }));
      return Response.json(
        {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(cats, null, 2) }] },
        },
        { headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (name === 'get_policies') {
      const policies = {
        freeShippingThreshold: `${SHOP.freeShippingThreshold} AUD`,
        flatShippingFee: `${SHOP.shippingFee} AUD`,
        expressShippingFee: `${SHOP.expressShippingFee} AUD`,
        courier: 'StarTrack Express / Toll Priority with Transit Insurance & Signature on Delivery',
        minimumOrder: `${SHOP.minOrder} AUD`,
        currency: SITE.currency,
        cryptoDiscount: `${SHOP.cryptoDiscount}% instant discount on BTC, USDT, ETH, BNB, SOL`,
        paymentMethods: SHOP.paymentMethods,
        warranty: '100% Genuine Australian Stock with Official Manufacturer Warranties',
        dispatchLocation: CONTACT.address,
      };
      return Response.json(
        {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(policies, null, 2) }] },
        },
        { headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (name === 'create_order_draft') {
      const inputItems = args.items || [];
      const resolvedItems = [];
      let total = 0;

      for (const item of inputItems) {
        const prod = PRODUCTS.find((p) => p.slug === item.slug);
        if (prod && prod.price != null) {
          const qty = item.quantity || 1;
          resolvedItems.push({
            slug: prod.slug,
            name: prod.name,
            price: prod.price,
            quantity: qty,
          });
          total += prod.price * qty;
        }
      }

      const orderRef = `TH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const waUrl = waOrderLink(
        { ref: orderRef, total, totalFormatted: money(total), items: resolvedItems },
        { name: 'Customer Draft', email: 'pending@checkout', phone: '', address: 'Australia Delivery' }
      );

      const draftResult = {
        orderRef,
        totalAUD: total,
        totalFormatted: money(total),
        items: resolvedItems,
        notes: args.notes || '',
        actionRequired: 'Human completes checkout. Never captures payment via API.',
        checkoutUrl: `https://${SITE.domain}/cart/`,
        whatsAppDraftUrl: waUrl,
      };

      return Response.json(
        {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(draftResult, null, 2) }] },
        },
        { headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    return Response.json(
      { jsonrpc: '2.0', id, error: { code: -32601, message: `Tool "${name}" not found` } },
      { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  return Response.json(
    { jsonrpc: '2.0', id: id || null, error: { code: -32601, message: `Method "${method}" not recognized` } },
    { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
  );
}
