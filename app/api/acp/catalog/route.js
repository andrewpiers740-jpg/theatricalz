// app/api/acp/catalog/route.js - Live ACP Catalog endpoint (WebForge v11.1 Section V3)
import { CATEGORIES, SHOP, SITE } from '@/config/site';
import { PRODUCTS } from '@/config/products';

export async function GET() {
  return Response.json(
    {
      protocol: { name: 'acp', version: '0.1.0' },
      site: SITE.name,
      currency: SITE.currency,
      catalog: CATEGORIES.map((c) => ({
        ...c,
        url: `https://${SITE.domain}/shop/${c.slug}/`,
        products: PRODUCTS.filter((p) => p.category === c.slug).map((p) => ({
          slug: p.slug,
          name: p.name,
          price: p.price,
          currency: SITE.currency,
          badge: p.badge,
          stock: p.stock,
          url: `https://${SITE.domain}/shop/${p.category}/${p.slug}/`,
        })),
      })),
      minimumOrder: SHOP.minOrder,
      freeShippingThreshold: SHOP.freeShippingThreshold,
      paymentMethods: SHOP.paymentMethods,
      ordering: 'human-assisted',
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    }
  );
}
