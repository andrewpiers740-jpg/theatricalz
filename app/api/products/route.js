// app/api/products/route.js - V2 JSON Catalog API
import { PRODUCTS, SITE } from '@/config/site';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const q = searchParams.get('q')?.toLowerCase();
  const limit = parseInt(searchParams.get('limit') || '0', 10);

  let results = [...PRODUCTS];

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  if (q) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (limit > 0) {
    results = results.slice(0, limit);
  }

  const enriched = results.map((p) => ({
    ...p,
    currency: SITE.currency,
    url: `https://${SITE.domain}/shop/${p.category}/${p.slug}/`,
  }));

  return Response.json(
    {
      count: enriched.length,
      currency: SITE.currency,
      products: enriched,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    }
  );
}
