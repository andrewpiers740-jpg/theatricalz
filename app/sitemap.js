// app/sitemap.js - Split sitemaps for Theatricalz: /sitemap/pages.xml plus /sitemap/products-<n>.xml (5,000 products each).
// /sitemap.xml is a sitemap index listing them (app/sitemap.xml/route.js).
import { SITE, CATEGORIES, POSTS } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import { subSlug } from '@/lib/subcategory';
import lastmod from '@/data/lastmod.json';
import { getBrands } from '@/lib/brands';

// Products are split into files of this many URLs so no single sitemap grows large
export const PRODUCTS_PER_SITEMAP = 5000;

export async function generateSitemaps() {
  const n = Math.max(1, Math.ceil(PRODUCTS.length / PRODUCTS_PER_SITEMAP));
  return [{ id: 'pages' }, ...Array.from({ length: n }, (_, i) => ({ id: `products-${i + 1}` }))];
}

export default async function sitemap({ id }) {
  const sid = String(await id);
  const domain = `https://${SITE.domain}`;
  // lastModified is the date the content actually changed (data/lastmod.json, built by scripts/gen-product-index.mjs).
  // Pages with no tracked change date leave it out rather than claiming the build time.
  const dateOf = (slug) => (lastmod[slug] ? lastmod[slug].d : undefined);
  const newest = (items) => items.map((p) => dateOf(p.slug)).filter(Boolean).sort().pop();

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
  const productsOf = (n) => PRODUCTS.slice((n - 1) * PRODUCTS_PER_SITEMAP, n * PRODUCTS_PER_SITEMAP);
  const productPages = (sid.startsWith('products-') ? productsOf(parseInt(sid.slice(9), 10) || 1) : []).map((prod) => ({
    url: `${domain}/shop/${prod.category}/${prod.slug}/`,
    lastModified: dateOf(prod.slug),
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  // 4. Blog Posts
  const blogPages = POSTS.map((post) => ({
    url: `${domain}/blog/${post.slug}/`,
    lastModified: post.date ? new Date(post.date).toISOString() : undefined,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 5. Brand pages
  const brandPages = [
    { url: `${domain}/brands/`, changeFrequency: 'weekly', priority: 0.8 },
    ...getBrands().map((b) => ({ url: `${domain}/brands/${b.slug}/`, changeFrequency: 'weekly', priority: 0.7 })),
  ];

  if (sid.startsWith('products-')) return productPages;
  return [...staticPages, ...categoryPages, ...rangePages, ...brandPages, ...blogPages];
}
