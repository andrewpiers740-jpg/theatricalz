// app/sitemap.js - Image-aware split sitemaps for Theatricalz
import { SITE, CATEGORIES, POSTS } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import { subSlug } from '@/lib/subcategory';
import lastmod from '@/data/lastmod.json';

export default async function sitemap() {
  const domain = `https://${SITE.domain}`;
  // lastModified is the date the content actually changed (data/lastmod.json, built by scripts/gen-product-index.mjs).
  // Pages with no tracked change date leave it out rather than claiming the build time.
  const dateOf = (slug) => (lastmod[slug] ? lastmod[slug].d : undefined);
  const newest = (items) => items.map((p) => dateOf(p.slug)).filter(Boolean).sort().pop();
  const abs = (u) => (u && u.startsWith('http') ? u : `${domain}${u && u.startsWith('/') ? '' : '/'}${u || ''}`);

  // 1. Static Pages
  const staticPages = [
    '/',
    '/shop/',
    '/clearance/',
    '/financing/',
    '/about/',
    '/contact/',
    '/faq/',
    '/terms/',
    '/disclaimer/',
    '/sales-policy/',
    '/shipping/',
    '/returns/',
    '/privacy/',
    '/tracking/',
    '/compare/',
  ].map((route) => ({
    url: `${domain}${route}`,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1.0 : 0.8,
  }));

  // 2. Category Pages
  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${domain}/shop/${cat.slug}/`,
    lastModified: newest(PRODUCTS.filter((p) => p.category === cat.slug)),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 2b. Subcategory (range) pages
  const rangePages = CATEGORIES.flatMap((cat) =>
    (cat.subcategories || [])
      .filter((sub) => PRODUCTS.some((p) => p.category === cat.slug && p.subcategory === sub))
      .map((sub) => ({
        url: `${domain}/shop/${cat.slug}/${subSlug(sub)}/`,
        lastModified: newest(PRODUCTS.filter((p) => p.category === cat.slug && p.subcategory === sub)),
        changeFrequency: 'weekly',
        priority: 0.85,
      }))
  );

  // 3. Product Pages (with image rich result metadata)
  const productPages = PRODUCTS.map((prod) => ({
    url: `${domain}/shop/${prod.category}/${prod.slug}/`,
    lastModified: dateOf(prod.slug),
    changeFrequency: 'daily',
    priority: 0.95,
    // Next.js writes <image:image> entries from plain absolute URLs (objects would print as [object Object])
    images: (prod.images || []).map((imgUrl) => abs(imgUrl)),
  }));

  // 4. Blog Posts
  const blogPages = POSTS.map((post) => ({
    url: `${domain}/blog/${post.slug}/`,
    lastModified: post.date ? new Date(post.date).toISOString() : undefined,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...rangePages, ...productPages, ...blogPages];
}
