// app/api/search/route.js - Search API for products and articles
import { PRODUCTS, POSTS, SITE } from '@/config/site';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  if (!q) {
    return Response.json(
      { query: '', products: [], posts: [], total: 0 },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const matchingProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q)
  ).map((p) => ({
    ...p,
    currency: SITE.currency,
    url: `https://${SITE.domain}/shop/${p.category}/${p.slug}/`,
  }));

  const matchingPosts = POSTS.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q)
  ).map((post) => ({
    ...post,
    url: `https://${SITE.domain}/blog/${post.slug}/`,
  }));

  return Response.json(
    {
      query: q,
      products: matchingProducts,
      posts: matchingPosts,
      total: matchingProducts.length + matchingPosts.length,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=120',
      },
    }
  );
}
