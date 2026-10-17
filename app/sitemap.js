// app/sitemap.js - Image-aware split sitemaps for Theatricalz
import { SITE, CATEGORIES, PRODUCTS, POSTS } from '@/config/site';

export default async function sitemap() {
  const domain = `https://${SITE.domain}`;
  const now = new Date().toISOString();

  // 1. Static Pages
  const staticPages = [
    '',
    '/shop/',
    '/clearance/',
    '/financing/',
    '/about/',
    '/contact/',
    '/faq/',
    '/terms/',
    '/sales-policy/',
    '/shipping/',
    '/returns/',
    '/privacy/',
    '/tracking/',
    '/compare/',
  ].map((route) => ({
    url: `${domain}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Category Pages
  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${domain}/shop/${cat.slug}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 3. Product Pages (with image rich result metadata)
  const productPages = PRODUCTS.map((prod) => ({
    url: `${domain}/shop/${prod.category}/${prod.slug}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.95,
    images: (prod.images || []).map((imgUrl) => ({
      url: imgUrl,
      title: prod.name,
      caption: prod.shortDescription || prod.description,
    })),
  }));

  // 4. Blog Posts
  const blogPages = POSTS.map((post) => ({
    url: `${domain}/blog/${post.slug}/`,
    lastModified: post.date ? new Date(post.date).toISOString() : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
