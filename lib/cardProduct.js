// lib/cardProduct.js - the few product fields a ProductCard needs.
// ProductCard is a client component, so every prop is serialised into the page. Passing the whole product
// (long description, spec table, every image) made /shop/ and category pages over a megabyte; this keeps
// each card to its own text, price, first image and badge.
const cut = (s, n) => (s && s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : s);

export function cardProduct(p) {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice,
    badge: p.badge,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    images: p.images && p.images.length ? [p.images[0]] : [],
    shortDescription: cut(p.shortDescription || p.description, 140),
    variants: p.variants && p.variants.length ? p.variants.map((v) => ({ price: v.price })) : undefined,
  };
}
