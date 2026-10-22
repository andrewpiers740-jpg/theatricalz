// lib/descriptions.js - Long-form product descriptions (headline H1, intro, sections, FAQ), stored per category in
// data/descriptions/<category>.json so each product page only loads its own category's file.
export async function getDescription(category, slug) {
  try {
    const mod = await import(`@/data/descriptions/${category}.json`);
    return (mod.default || mod)[slug] || null;
  } catch {
    return null;
  }
}
