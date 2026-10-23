// app/api/search/route.js - Search API for products and articles.
// Paged and size-limited: at most 50 products per request (24 by default), and a query needs at least 2 characters.
import { POSTS, SITE } from '@/config/site';
import { searchCatalogue, clampLimit, clampOffset, MIN_QUERY } from '@/lib/searchProducts';
import { rateLimit, clientIp, tooManyResponse } from '@/lib/formGuard';

const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function GET(request) {
  const limitCheck = await rateLimit(`search:ip:${clientIp(request)}`, 60, 60);
  if (!limitCheck.ok) return tooManyResponse(limitCheck.retryAfter);

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim().slice(0, 100);
  const category = (searchParams.get('category') || '').trim().slice(0, 60);
  const maxPriceRaw = parseFloat(searchParams.get('max_price') || '');
  const maxPrice = Number.isFinite(maxPriceRaw) && maxPriceRaw > 0 ? maxPriceRaw : Infinity;
  const limit = clampLimit(searchParams.get('limit'));
  const offset = clampOffset(searchParams.get('offset'));

  // A search term of at least 2 characters, or a category / price filter to browse with.
  if (q.length < MIN_QUERY && !category && maxPrice === Infinity) {
    return Response.json(
      { query: q, products: [], posts: [], total: 0, error: `Enter at least ${MIN_QUERY} characters to search.` },
      { status: q ? 400 : 200, headers: CORS }
    );
  }

  const found = searchCatalogue({ q, category, maxPrice, limit, offset });

  const needle = q.toLowerCase();
  const matchingPosts = needle.length >= MIN_QUERY && offset === 0
    ? POSTS.filter(
        (post) =>
          post.title.toLowerCase().includes(needle) ||
          post.excerpt.toLowerCase().includes(needle) ||
          post.category.toLowerCase().includes(needle)
      ).map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        url: `https://${SITE.domain}/blog/${post.slug}/`,
      }))
    : [];

  return Response.json(
    {
      query: q,
      products: found.items,
      posts: matchingPosts,
      total: found.total + matchingPosts.length,
      totalProducts: found.total,
      limit,
      offset,
      hasMore: found.hasMore,
    },
    { headers: { ...CORS, 'Cache-Control': 'public, max-age=120, s-maxage=300' } }
  );
}
