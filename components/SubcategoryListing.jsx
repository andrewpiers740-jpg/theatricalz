import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { SITE } from '@/config/site';
import ProductCard from '@/components/ProductCard';
import JsonLd from '@/components/JsonLd';
import { subSlug, PAGE_SIZE, rangePageHref } from '@/lib/subcategory';

// One "range" (subcategory) of a category, e.g. /shop/audio-visual/fibre-ip-ndi/ — paginated at PAGE_SIZE products per page
export default function SubcategoryListing({ category, sub, products, page = 1 }) {
  const pages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  const shown = products.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const url = `https://${SITE.domain}${rangePageHref(category.slug, sub, current)}`;
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `https://${SITE.domain}/shop/` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `https://${SITE.domain}/shop/${category.slug}/` },
      { '@type': 'ListItem', position: 4, name: sub, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/shop/" className="hover:text-amber-400 transition">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href={`/shop/${category.slug}/`} className="hover:text-amber-400 transition">{category.name}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-medium">{sub}</span>
        </nav>

        <div className="pb-6 border-b border-slate-800 space-y-3">
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {sub}{current > 1 ? <span className="text-slate-500"> — Page {current}</span> : null}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {products.length} {category.name} products{pages > 1 ? `, showing ${(current - 1) * PAGE_SIZE + 1}–${(current - 1) * PAGE_SIZE + shown.length}` : ''}. Prices in AUD including 10% GST.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {category.subcategories.map((s) => (
              <Link
                key={s}
                href={`/shop/${category.slug}/${subSlug(s)}/`}
                className={`px-3 py-1 rounded-lg border text-xs font-medium transition ${
                  s === sub
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/60 hover:text-white'
                }`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shown.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {pages > 1 && (
          <nav aria-label={`${sub} pages`} className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {current > 1 && (
              <Link href={rangePageHref(category.slug, sub, current - 1)} rel="prev" className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-amber-500/60">
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Link>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={rangePageHref(category.slug, sub, n)}
                aria-current={n === current ? 'page' : undefined}
                className={`min-w-9 text-center px-3 py-2 rounded-lg border text-xs font-semibold ${
                  n === current ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/60'
                }`}
              >
                {n}
              </Link>
            ))}
            {current < pages && (
              <Link href={rangePageHref(category.slug, sub, current + 1)} rel="next" className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-amber-500/60">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </nav>
        )}
      </div>
    </>
  );
}
