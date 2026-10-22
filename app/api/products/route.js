// app/api/products/route.js - V2 JSON Catalog API
import { SITE } from '@/config/site';
import { PRODUCTS } from '@/config/products';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const q = searchParams.get('q')?.toLowerCase();
  // The catalogue runs to thousands of items, so responses are paged: ?limit (default 100, max 500) and ?offset.
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '100', 10) || 100, 1), 500);
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0);

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

  const total = results.length;
  results = results.slice(offset, offset + limit);

  const enriched = results.map((p) => ({
    ...p,
    currency: SITE.currency,
    url: `https://${SITE.domain}/shop/${p.category}/${p.slug}/`,
  }));

  return Response.json(
    {
      count: enriched.length,
      total,
      offset,
      limit,
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
