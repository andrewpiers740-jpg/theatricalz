// lib/brandsCore.js - builds the brand list from the catalogue. Plain functions with no imports, so the
// generator script (scripts/gen-product-index.mjs), the server pages and tests can all use it.

export const brandKey = (name) => String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
export const brandSlug = (name) =>
  String(name || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Values in the brand field that are a product type, not a make (so they are not offered as brands).
const NOT_BRANDS = new Set(['sheetmusic']);

// Different spellings of one brand (NanLite / Nanlite, PreSonus / Presonus) are merged under the most common spelling.
export function buildBrands(products) {
  const byKey = new Map();
  for (const p of products) {
    const raw = String(p.brand || '').trim();
    if (!raw) continue;
    const key = brandKey(raw);
    if (!key || NOT_BRANDS.has(key)) continue;
    let entry = byKey.get(key);
    if (!entry) {
      entry = { key, spellings: new Map(), count: 0 };
      byKey.set(key, entry);
    }
    entry.count += 1;
    entry.spellings.set(raw, (entry.spellings.get(raw) || 0) + 1);
  }
  const used = new Set();
  return [...byKey.values()]
    .map((e) => {
      const name = [...e.spellings.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
      let slug = brandSlug(name) || e.key;
      while (used.has(slug)) slug += '-2';
      used.add(slug);
      const first = name.trim().charAt(0).toUpperCase();
      return { name, slug, key: e.key, count: e.count, letter: /[A-Z]/.test(first) ? first : '#' };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
}
