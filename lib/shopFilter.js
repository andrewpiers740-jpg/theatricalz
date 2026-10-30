// lib/shopFilter.js - pure filtering helpers for the shop page sidebar (used in the browser, no dependencies on React)
import { brandKey } from '@/lib/brandsCore';

export const PAGE_SIZE = 24;

export const PRICE_PRESETS = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 – $400', min: 100, max: 400 },
  { label: '$400 – $1,000', min: 400, max: 1000 },
  { label: '$1,000 – $5,000', min: 1000, max: 5000 },
  { label: '$5,000 and over', min: 5000, max: null },
];

export const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
];

const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export function parseFilters(params) {
  const get = (k) => (params && params.get ? params.get(k) : null) || '';
  return {
    cat: get('category'),
    sub: get('sub'),
    brands: get('brand') ? get('brand').split(',').filter(Boolean) : [],
    min: num(get('min')),
    max: num(get('max')),
    sort: SORTS.some((s) => s.value === get('sort')) ? get('sort') : 'featured',
    page: Math.max(1, parseInt(get('page'), 10) || 1),
  };
}

export function filtersToQuery(f) {
  const q = new URLSearchParams();
  if (f.cat) q.set('category', f.cat);
  if (f.sub) q.set('sub', f.sub);
  if (f.brands.length) q.set('brand', f.brands.join(','));
  if (f.min != null) q.set('min', String(f.min));
  if (f.max != null) q.set('max', String(f.max));
  if (f.sort && f.sort !== 'featured') q.set('sort', f.sort);
  if (f.page > 1) q.set('page', String(f.page));
  return q.toString();
}

export const isFiltered = (f) => Boolean(f.cat || f.sub || f.brands.length || f.min != null || f.max != null);

// Decorate each product once with the fields filtering needs
export function prepare(items, subSlug) {
  return items.map((p) => ({ ...p, _bk: brandKey(p.brand), _sub: p.sub ? subSlug(p.sub) : '' }));
}

// Apply every filter except `skip` ('cat' | 'sub' | 'brand' | 'price'), so facet counts show what each choice would give
export function applyFilters(items, f, skip = '') {
  const brandSet = new Set(f.brands);
  return items.filter((p) => {
    if (skip !== 'cat' && f.cat && p.category !== f.cat) return false;
    if (skip !== 'sub' && f.sub && p._sub !== f.sub) return false;
    if (skip !== 'brand' && brandSet.size && !brandSet.has(p._bk)) return false;
    if (skip !== 'price') {
      const price = p.price == null ? null : p.price;
      if (f.min != null && (price == null || price < f.min)) return false;
      if (f.max != null && (price == null || price > f.max)) return false;
    }
    return true;
  });
}

export function sortItems(items, sort) {
  const arr = items.slice();
  if (sort === 'price-asc') arr.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  else if (sort === 'price-desc') arr.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  else if (sort === 'name') arr.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  return arr;
}

export function countBy(items, key) {
  const m = new Map();
  for (const p of items) {
    const k = typeof key === 'function' ? key(p) : p[key];
    if (k) m.set(k, (m.get(k) || 0) + 1);
  }
  return m;
}
