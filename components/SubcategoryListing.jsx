import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SITE } from '@/config/site';
import ProductCard from '@/components/ProductCard';
import JsonLd from '@/components/JsonLd';
import { subSlug } from '@/lib/subcategory';

// One "range" (subcategory) of a category, e.g. /shop/audio-visual/fibre-ip-ndi/
export default function SubcategoryListing({ category, sub, products }) {
  const url = `https://${SITE.domain}/shop/${category.slug}/${subSlug(sub)}/`;
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
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">{sub}</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {products.length} {category.name} products. Prices in AUD including 10% GST.
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
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
