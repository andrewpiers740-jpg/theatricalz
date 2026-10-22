// scripts/gen-product-index.mjs - Writes a slim product index for client-side pages
// (search, compare, wishlist). It is served as a static, CDN-cached file (public/product-index.json)
// and fetched after page load, so the catalogue is never bundled into page JavaScript.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { PRODUCTS } = await import('../config/products.js');

const cut = (s, n) => (s && s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);
const slim = PRODUCTS.map((p) => ({
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  category: p.category,
  sku: p.sku,
  price: p.price ?? null,
  originalPrice: p.originalPrice,
  badge: p.badge,
  rating: p.rating,
  reviewsCount: p.reviewsCount,
  stockShort: p.stockShort,
  shortDescription: cut(p.shortDescription || p.description, 140),
  images: p.images?.slice(0, 1) || [],
  specs: p.specs,
  // bulk-imported items are left out of the compare picker (it is built for spec'd hero products)
  imported: p.imported || undefined,
}));

fs.writeFileSync(path.join(root, 'public/product-index.json'), JSON.stringify(slim));
// the old bundled index is no longer used; remove it so it can't creep back into a bundle
fs.rmSync(path.join(root, 'data/products/index.json'), { force: true });
console.log(`[gen-product-index] ${slim.length} products written to public/product-index.json`);
