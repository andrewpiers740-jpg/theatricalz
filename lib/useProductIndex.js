'use client';
// lib/useProductIndex.js - Loads the slim product index (public/product-index.<hash>.json) once per session and shares it.
import { useEffect, useState } from 'react';
import { PRODUCT_INDEX_URL } from '@/lib/productIndexUrl';

let cache = null;
let pending = null;
const load = () => (pending ??= fetch(PRODUCT_INDEX_URL).then((r) => r.json()).then((d) => (cache = d)));

export function useProductIndex() {
  const [products, setProducts] = useState(cache);
  useEffect(() => {
    if (!cache) load().then(setProducts).catch(() => setProducts([]));
  }, []);
  return { products: products || [], loading: !products };
}
