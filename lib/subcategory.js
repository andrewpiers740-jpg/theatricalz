// lib/subcategory.js - Shared helpers for category subcategory ("range") pages
export const subSlug = (sub) => sub.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function findSubcategory(category, slug) {
  return category?.subcategories?.find((s) => subSlug(s) === slug) || null;
}
