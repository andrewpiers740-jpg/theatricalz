// lib/searchProducts.js - bounded catalogue search shared by /api/search and the MCP search tool.
// Results are always paged, and only light fields are returned, so one request can never return the whole catalogue.
import { PRODUCTS } from '@/config/products';
import { SITE } from '@/config/site';

export const MIN_QUERY = 2;
export const DEFAULT_LIMIT = 24;
export const MAX_LIMIT = 50;

let haystacks = null;
function getHaystacks() {
  if (!haystacks) {
    haystacks = PRODUCTS.map((p) => ({
      p,
      name: String(p.name || '').toLowerCase(),
      rest: `${p.brand || ''} ${p.category || ''} ${p.sku || ''} ${p.shortDescription || ''}`.toLowerCase(),
    }));
  }
  return haystacks;
}

export function clampLimit(value) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_LIMIT;
  return Math.min(n, MAX_LIMIT);
}

export function clampOffset(value) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 20000) : 0;
}

function lean(p) {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand || '',
    category: p.category,
    price: p.price == null ? null : p.price,
    currency: SITE.currency,
    image: (p.images && p.images[0]) || '',
    shortDescription: String(p.shortDescription || '').slice(0, 200),
    url: `https://${SITE.domain}/shop/${p.category}/${p.slug}/`,
  };
}

// Name matches come first, then matches in brand, category, SKU or short description.
export function searchCatalogue({ q = '', category = '', maxPrice = Infinity, limit = DEFAULT_LIMIT, offset = 0 } = {}) {
  const needle = String(q).trim().toLowerCase();
  const nameHits = [];
  const otherHits = [];
  for (const h of getHaystacks()) {
    const { p } = h;
    if (category && p.category !== category) continue;
    if (maxPrice !== Infinity && !(p.price != null && p.price <= maxPrice)) continue;
    if (!needle) {
      otherHits.push(p);
    } else if (h.name.includes(needle)) {
      nameHits.push(p);
    } else if (h.rest.includes(needle)) {
      otherHits.push(p);
    }
  }
  const all = nameHits.concat(otherHits);
  const page = all.slice(offset, offset + limit).map(lean);
  return { items: page, total: all.length, hasMore: offset + page.length < all.length };
}
