// scripts/gen-product-index.mjs - Writes a slim product index for client-side pages
// (search, compare, wishlist) so they don't ship the full catalogue to the browser.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { PRODUCTS } = await import('../config/products.js');

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
  shortDescription: p.shortDescription,
  description: p.shortDescription || p.description,
  images: p.images?.slice(0, 1) || [],
  specs: p.specs,
}));

fs.writeFileSync(path.join(root, 'data/products/index.json'), JSON.stringify(slim));
console.log(`[gen-product-index] ${slim.length} products written to data/products/index.json`);
