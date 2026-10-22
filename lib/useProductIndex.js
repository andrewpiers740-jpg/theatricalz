'use client';
// lib/useProductIndex.js - Loads the slim product index (public/product-index.json) once per session and shares it.
import { useEffect, useState } from 'react';

let cache = null;
let pending = null;
const load = () => (pending ??= fetch('/product-index.json').then((r) => r.json()).then((d) => (cache = d)));

export function useProductIndex() {
  const [products, setProducts] = useState(cache);
  useEffect(() => {
    if (!cache) load().then(setProducts).catch(() => setProducts([]));
  }, []);
  return { products: products || [], loading: !products };
}
