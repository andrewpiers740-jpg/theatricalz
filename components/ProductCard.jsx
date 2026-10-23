'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, Check, Coins, Truck } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { money } from '@/lib/order';
import { SHOP } from '@/config/site';
import { hasDisclaimer } from '@/lib/disclaimers';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const wishlisted = isWishlisted(product.slug);

  const priceOnRequest = product.price == null;
  const price = product.price || 0;
  const cryptoPrice = price * (1 - (SHOP.cryptoDiscount || 10) / 100);
  const payInFour = price / 4;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 focus-within:border-amber-500/60">
      {/* Product Image Frame */}
      <div className="relative bg-white aspect-[4/3] w-full overflow-hidden flex items-center justify-center p-4 border-b border-slate-200/10 shadow-[inset_0_-12px_16px_-12px_rgba(15,23,42,0.12)]">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="text-slate-400 text-xs">No image preview</div>
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider shadow-md ${
                product.badge === 'Popular'
                  ? 'bg-amber-500 text-slate-950'
                  : product.badge === 'Premium'
                  ? 'bg-slate-950 text-amber-400 border border-amber-500/40'
                  : product.badge === 'New'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.slug)}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition shadow-md ${
            wishlisted
              ? 'bg-red-500 text-white'
              : 'bg-slate-900/70 hover:bg-slate-900 text-slate-300 hover:text-white backdrop-blur-sm'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Stock Pill */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-amber-400 uppercase tracking-wider font-mono text-[11px]">
              {product.brand || 'Theatricalz'}
            </span>
            <span className={`flex items-center gap-1 text-[11px] font-medium ${product.stockShort ? 'text-amber-300' : 'text-emerald-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${product.stockShort ? 'bg-amber-300' : 'bg-emerald-400'}`}></span>
              <span>{product.stockShort || 'In Stock (Melb)'}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-white text-base leading-snug min-h-[2.75rem] group-hover:text-amber-400 transition-colors line-clamp-2">
            <Link href={`/shop/${product.category}/${product.slug}/`}>
              {product.name}
            </Link>
          </h3>

          {hasDisclaimer(product) && (
            <Link
              href="/disclaimer/"
              className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider text-amber-400 hover:bg-amber-500/20"
            >
              Disclaimer applies
            </Link>
          )}

          {/* Short Description */}
          <p className="text-xs text-slate-400 line-clamp-2 min-h-[2.25rem] mt-1.5 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Rating */}
          {product.rating != null && (
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-white">{product.rating || '4.9'}</span>
            <span className="text-[11px] text-slate-500">({product.reviewsCount || 28})</span>
          </div>
          )}
        </div>

        {/* Pricing Box & Add to Cart */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
          {priceOnRequest ? (
            <div>
              <span className="text-lg font-black text-white">Price on request</span>
              <div className="text-[11px] text-slate-400 mt-0.5">Contact us for a quote in AUD inc. GST</div>
            </div>
          ) : (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white font-mono">
                {product.variants?.length ? <span className="text-xs font-semibold text-slate-400 mr-1">From</span> : null}
                {money(price)} AUD
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  {money(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium mt-0.5">
              <Coins className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                Crypto 10% Off: <strong className="font-mono text-white">{money(cryptoPrice)}</strong>
              </span>
            </div>

            <div className="text-[11px] text-slate-400 mt-0.5">
              or 4 payments of <strong className="text-slate-300 font-mono">{money(payInFour)}</strong> interest-free
            </div>
          </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/shop/${product.category}/${product.slug}/`}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 hover:border-slate-500 text-white text-xs font-semibold text-center transition border border-slate-700"
            >
              Specs & Detail
            </Link>

            {priceOnRequest ? (
              <Link
                href={`/contact/?product=${encodeURIComponent(product.name)}`}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <span>Get a Quote</span>
              </Link>
            ) : (
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
