// app/api/acp/catalog/route.js - Live ACP Catalog endpoint (WebForge v11.1 Section V3)
// Bounded: with no category it lists the categories and their product counts; with ?category=<slug> it returns
// one page of products (limit 1-50, default 24; use offset to page), so a request never returns the whole catalogue.
import { guardApi } from '@/lib/apiGuard';
import { CATEGORIES, SHOP, SITE } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import { clampLimit, clampOffset } from '@/lib/searchProducts';

export async function GET(request) {
  const limited = await guardApi(request, 'acp-catalog');
  if (limited) return limited;
  const { searchParams } = new URL(request.url);
  const categorySlug = (searchParams.get('category') || '').trim();
  const limit = clampLimit(searchParams.get('limit'));
  const offset = clampOffset(searchParams.get('offset'));

  const base = {
    protocol: { name: 'acp', version: '0.1.0' },
    site: SITE.name,
    currency: SITE.currency,
    minimumOrder: SHOP.minOrder,
    freeShippingThreshold: SHOP.freeShippingThreshold,
    paymentMethods: SHOP.paymentMethods,
    ordering: 'human-assisted',
  };
  const headers = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' };

  if (!categorySlug) {
    return Response.json(
      {
        ...base,
        catalog: CATEGORIES.map((c) => ({
          ...c,
          url: `https://${SITE.domain}/shop/${c.slug}/`,
          productCount: PRODUCTS.filter((p) => p.category === c.slug).length,
          productsEndpoint: `https://${SITE.domain}/api/acp/catalog/?category=${c.slug}`,
        })),
      },
      { headers }
    );
  }

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return Response.json({ error: 'Unknown category' }, { status: 404, headers });

  const all = PRODUCTS.filter((p) => p.category === category.slug);
  const page = all.slice(offset, offset + limit).map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    currency: SITE.currency,
    badge: p.badge,
    stock: 'In Stock (Melb)',
    url: `https://${SITE.domain}/shop/${p.category}/${p.slug}/`,
  }));

  return Response.json(
    { ...base, category: category.slug, total: all.length, limit, offset, hasMore: offset + page.length < all.length, products: page },
    { headers }
  );
}
