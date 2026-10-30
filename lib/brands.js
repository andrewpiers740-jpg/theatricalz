// lib/brands.js - server-side brand helpers built from the catalogue
import { PRODUCTS } from '@/config/products';
import { buildBrands, brandKey } from '@/lib/brandsCore';

export const BRAND_PAGE_SIZE = 24;
export const brandPageHref = (slug, n = 1) => `/brands/${slug}/${n > 1 ? `page/${n}/` : ''}`;

let brands = null;
let bySlug = null;
let productsByKey = null;

function load() {
  if (brands) return;
  brands = buildBrands(PRODUCTS);
  bySlug = new Map(brands.map((b) => [b.slug, b]));
  productsByKey = new Map();
  for (const p of PRODUCTS) {
    const k = brandKey(p.brand);
    if (!k) continue;
    if (!productsByKey.has(k)) productsByKey.set(k, []);
    productsByKey.get(k).push(p);
  }
}

export function getBrands() {
  load();
  return brands;
}

export function getBrandBySlug(slug) {
  load();
  return bySlug.get(slug) || null;
}

export function getBrandProducts(brand) {
  load();
  return productsByKey.get(brand.key) || [];
}
