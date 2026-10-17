'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import PRODUCTS from '@/data/products/index.json';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useCart();
  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.slug));

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-white">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Saved Gear Wishlist</span>
      </nav>

      <div className="pb-6 border-b border-slate-800 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Personal Equipment Shortlist
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Your Gear Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Items saved for upcoming commercial bids, documentary production budgets, or studio upgrades.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 stroke-1" />
          </div>
          <h2 className="text-lg font-bold text-white">Your wishlist is currently empty</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Click the heart icon on any cinema camera, optical prime, or microphone to save it here for later.
          </p>
          <Link
            href="/shop/"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition"
          >
            <span>Explore Pro Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
