import Link from 'next/link';
import { Film, Filter, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { SITE, CATEGORIES } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import ProductCard from '@/components/ProductCard';
import { cardProduct } from '@/lib/cardProduct';
import HeroSlideshow from '@/components/HeroSlideshow';
import ShopBrowser from '@/components/ShopBrowser';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Shop Pro Cinema, Video, Photo & Audio Gear',
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
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4 p-6 sm:p-10">
          <HeroSlideshow images={['/images/hero/shop-1.webp', '/images/hero/shop-2.webp', '/images/hero/shop-3.webp']} />
          <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30"></div>
          <div className="relative z-10">
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

          <div className="relative z-10 text-xs text-slate-300 bg-slate-900/90 border border-slate-700 px-3.5 py-2 rounded-xl shrink-0 font-medium">
            Showing <strong className="text-white font-mono">{PRODUCTS.length}</strong> pro items
          </div>
        </div>

        {/* Filter sidebar (left) + category previews, or filtered results once a filter is chosen */}
        <ShopBrowser categories={CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, subcategories: c.subcategories || [] }))}>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.slice(0, 4).map((product) => (
                  <ProductCard key={product.slug} product={cardProduct(product)} />
                ))}
              </div>
            </section>
          );
        })}
        </ShopBrowser>
      </div>
    </>
  );
}
