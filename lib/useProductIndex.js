'use client';
// lib/useProductIndex.js - Loads the slim product index (public/product-index.<hash>.json) once per session and shares it.
import { useEffect, useState } from 'react';
import { PRODUCT_INDEX_URL } from '@/lib/productIndexUrl';
import { COMPARE_INDEX_URL } from '@/lib/compareIndexUrl';

let cache = null;
let pending = null;
// The index leaves out an image path that follows the usual naming; put it back here.
const restore = (rows) =>
  rows.map((p) => (p.images && p.images.length ? p : { ...p, images: [`/images/products/${p.category}/${p.slug}.webp`] }));
const load = () => (pending ??= fetch(PRODUCT_INDEX_URL).then((r) => r.json()).then((d) => (cache = restore(d))));

// `enabled` lets a page hold off the (large) download until it is actually needed
export function useProductIndex(enabled = true) {
  const [products, setProducts] = useState(cache);
  useEffect(() => {
    if (enabled && !cache) load().then(setProducts).catch(() => setProducts([]));
  }, [enabled]);
  return { products: products || [], loading: !products };
}

// Small file for the compare picker: the hand-curated products with their spec tables
let compareCache = null;
let comparePending = null;
const loadCompare = () => (comparePending ??= fetch(COMPARE_INDEX_URL).then((r) => r.json()).then((d) => (compareCache = d)));

export function useCompareIndex() {
  const [products, setProducts] = useState(compareCache);
  useEffect(() => {
    if (!compareCache) loadCompare().then(setProducts).catch(() => setProducts([]));
  }, []);
  return { products: products || [], loading: !products };
}
