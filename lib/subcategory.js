// lib/subcategory.js - Shared helpers for category subcategory ("range") pages
export const subSlug = (sub) => sub.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Range pages list PAGE_SIZE products; page 1 lives at /shop/<cat>/<range>/, later pages at /shop/<cat>/<range>/page/<n>/
export const PAGE_SIZE = 24;
export const rangePageHref = (catSlug, sub, n = 1) => `/shop/${catSlug}/${subSlug(sub)}/${n > 1 ? `page/${n}/` : ''}`;

export function findSubcategory(category, slug) {
  return category?.subcategories?.find((s) => subSlug(s) === slug) || null;
}
