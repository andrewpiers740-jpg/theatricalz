// app/api/ucp/services/route.js - Live UCP Services endpoint (WebForge v11.1 Section V3)
import { SITE, SHOP, CONTACT } from '@/config/site';

export async function GET() {
  return Response.json(
    {
      ucp: '1.0',
      protocol_version: '1.0',
      spec: 'https://ucp.dev/specification/overview/',
      site: `https://${SITE.domain}`,
      name: SITE.name,
      description: SITE.tagline,
      services: [
        {
          id: 'product-catalog',
          type: 'catalog',
          url: `https://${SITE.domain}/shop/`,
          description: 'Full pro cinema, photo, and audio catalog',
        },
        {
          id: 'mcp-server',
          type: 'mcp',
          url: `https://${SITE.domain}/api/mcp`,
          description: 'MCP Streamable HTTP server for autonomous pro gear discovery',
        },
        {
          id: 'order',
          type: 'commerce',
          url: `https://wa.me/${CONTACT.whatsapp}`,
          description: 'Order cinema and broadcast gear via WhatsApp or online checkout',
        },
        {
          id: 'financing',
          type: 'finance',
          url: `https://${SITE.domain}/financing/`,
          description: 'Pay in 4 interest-free equipment financing',
        },
      ],
      capabilities: ['browse', 'search', 'inquiry', 'financing', 'content', 'mcp'],
      currency: SITE.currency,
      minimum_order_usd: SHOP.minOrder,
      free_shipping_threshold_aud: SHOP.freeShippingThreshold,
      payment_methods: SHOP.paymentMethods,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    }
  );
}
