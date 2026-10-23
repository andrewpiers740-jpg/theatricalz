import Link from 'next/link';
import { Film, Filter, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { SITE, CATEGORIES } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import ProductCard from '@/components/ProductCard';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Shop Pro Cinema, Video, Photo & Audio Gear — Theatricalz Australia',
  description:
    'Browse Australia’s complete inventory of digital cinema cameras, cine primes, wireless microphones, studio LED lights, and camera gimbals in Melbourne.',
  alternates: {
    canonical: `https://${SITE.domain}/shop/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function ShopIndexPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://${SITE.domain}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop Pro Gear',
        item: `https://${SITE.domain}/shop/`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-medium">Shop Pro Gear</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Authorized Australian Stock
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Professional Cinema & Audio Gear
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Equipping Australian feature films, broadcast commercials, and documentary productions with genuine gear backed by local manufacturer warranties.
            </p>
          </div>

          <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl shrink-0 font-medium">
            Showing <strong className="text-white font-mono">{PRODUCTS.length}</strong> pro items
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/shop/"
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shrink-0 shadow-md shadow-amber-500/10"
          >
            All Pro Gear ({PRODUCTS.length})
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}/`}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium shrink-0 border border-slate-800 transition"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/clearance/"
            className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 text-xs font-semibold shrink-0 border border-red-900/40 transition"
          >
            Clearance Deals
          </Link>
        </div>

        {/* Product previews per category (full ranges live on each category page) */}
        {CATEGORIES.map((c) => {
          const items = PRODUCTS.filter((p) => p.category === c.slug);
          if (!items.length) return null;
          return (
            <section key={c.slug} className="space-y-4 pt-2">
              <div className="flex items-end justify-between gap-4">
                <h2 className="section-title text-lg sm:text-xl font-black text-white uppercase tracking-tight">{c.name}</h2>
                <Link href={`/shop/${c.slug}/`} className="text-xs font-semibold text-amber-400 hover:text-slate-950 hover:bg-amber-400 border border-amber-500/40 rounded-full px-3 py-1.5 transition shrink-0">
                  View all {items.length} →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.slice(0, 8).map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
