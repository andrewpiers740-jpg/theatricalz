'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SlidersHorizontal, ChevronRight, Check, X, ShoppingBag } from 'lucide-react';
import PRODUCTS from '@/data/products/index.json';
import { money } from '@/lib/order';
import { useCart } from '@/lib/cartContext';

export default function ComparePage() {
  const { addToCart } = useCart();
  const [selectedSlugs, setSelectedSlugs] = useState([
    'sony-fx3-cinema-line-camera',
    'canon-eos-c70-cinema-camera',
    'blackmagic-pyxis-6k-cinema-box',
  ]);

  const selectedProducts = selectedSlugs
    .map((s) => PRODUCTS.find((p) => p.slug === s))
    .filter(Boolean);

  const handleSelectProduct = (index, newSlug) => {
    setSelectedSlugs((prev) => {
      const copy = [...prev];
      copy[index] = newSlug;
      return copy;
    });
  };

  const SPEC_KEYS = ['Sensor', 'Video Format', 'Mount', 'Frame Rates', 'Audio', 'Dynamic Range', 'ND Filters', 'Weight'];

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-white">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Compare Cinema Gear</span>
      </nav>

      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Side-By-Side Technical Benchmark
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Compare Pro Cinema & Audio Kits
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
          Evaluate sensors, dynamic range stops, audio inputs, internal ND mechanisms, and pricing across leading cinema rigs.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-x-auto shadow-2xl">
        <div className="min-w-[700px]">
          {/* Header row with product pickers */}
          <div className="grid grid-cols-4 p-6 border-b border-slate-800 bg-slate-950/60">
            <div className="font-bold text-sm text-slate-400 flex items-center">
              Selected Models:
            </div>
            {selectedSlugs.map((slug, idx) => {
              const prod = selectedProducts[idx];
              return (
                <div key={idx} className="p-3 space-y-3">
                  <select
                    value={slug}
                    onChange={(e) => handleSelectProduct(idx, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  {prod && (
                    <div className="space-y-2">
                      <div className="relative aspect-[4/3] bg-white rounded-xl overflow-hidden p-2 flex items-center justify-center">
                        <Image
                          src={prod.images?.[0] || ''}
                          alt={prod.name}
                          fill
                          className="object-contain p-2"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-xs font-bold text-white line-clamp-1">{prod.name}</div>
                      <div className="text-sm font-black text-amber-400 font-mono">{prod.price == null ? 'Price on request' : money(prod.price)}</div>
                      <button
                        type="button"
                        onClick={() => addToCart(prod, 1)}
                        className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Specs Rows */}
          <div className="divide-y divide-slate-800/80 text-xs">
            {SPEC_KEYS.map((key) => (
              <div key={key} className="grid grid-cols-4 p-4 items-center">
                <span className="font-bold text-slate-400">{key}</span>
                {selectedProducts.map((p, i) => (
                  <div key={i} className="text-slate-200 pr-4 font-medium">
                    {p?.specs?.[key] || '—'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
