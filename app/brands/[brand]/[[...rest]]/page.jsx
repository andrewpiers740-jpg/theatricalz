import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { SITE, CATEGORIES } from '@/config/site';
import ProductCard from '@/components/ProductCard';
import JsonLd from '@/components/JsonLd';
import { cardProduct } from '@/lib/cardProduct';
import { fitTitle, fitDescription } from '@/lib/seoText';
import { getBrands, getBrandBySlug, getBrandProducts, BRAND_PAGE_SIZE, brandPageHref } from '@/lib/brands';

// The 40 biggest brands are built ahead of time (page 1 only, so visitors never wait on them); the other brand pages
// and later pages are rendered on first request and then cached, which keeps the build short.
export const dynamicParams = true;
export function generateStaticParams() {
  return getBrands()
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 40)
    .map((b) => ({ brand: b.slug }));
}

// /brands/<slug>/ is page 1; later pages live at /brands/<slug>/page/<n>/
function pageNumber(rest) {
  if (!rest || rest.length === 0) return 1;
  if (rest.length === 2 && rest[0] === 'page' && /^\d+$/.test(rest[1])) {
    const n = parseInt(rest[1], 10);
    return n >= 2 ? n : null;
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { brand: slug, rest } = await params;
  const brand = getBrandBySlug(slug);
  const page = pageNumber(rest);
  if (!brand || page === null) return { title: 'Brand Not Found' };
  const title = fitTitle(`${brand.name}${page > 1 ? ` — Page ${page}` : ''} — Buy in Australia`);
  return {
    title,
    description: fitDescription(
      `Shop ${brand.count} ${brand.name} products at Theatricalz: genuine Australian stock with local warranty, shipped from Melbourne.`,
      'Prices in AUD inc. GST.'
    ),
    alternates: { canonical: `https://${SITE.domain}${brandPageHref(brand.slug, page)}` },
  };
}

export default async function BrandPage({ params }) {
  const { brand: slug, rest } = await params;
  const brand = getBrandBySlug(slug);
  const page = pageNumber(rest);
  if (!brand || page === null) notFound();

  const products = getBrandProducts(brand);
  const pages = Math.max(1, Math.ceil(products.length / BRAND_PAGE_SIZE));
  if (page > pages) notFound();
  const shown = products.slice((page - 1) * BRAND_PAGE_SIZE, page * BRAND_PAGE_SIZE);
  const url = `https://${SITE.domain}${brandPageHref(brand.slug, page)}`;

  const catCounts = CATEGORIES.map((c) => ({ ...c, n: products.filter((p) => p.category === c.slug).length })).filter((c) => c.n > 0);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: `${brand.name} products`,
        isPartOf: { '@type': 'WebSite', name: SITE.name, url: `https://${SITE.domain}/` },
        about: { '@type': 'Brand', name: brand.name },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
          { '@type': 'ListItem', position: 2, name: 'Brands', item: `https://${SITE.domain}/brands/` },
          { '@type': 'ListItem', position: 3, name: brand.name, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/brands/" className="hover:text-amber-400 transition">Brands</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-medium">{brand.name}</span>
        </nav>

        <div className="pb-6 border-b border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Shop by brand</div>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {brand.name}
            {page > 1 ? <span className="text-slate-500"> — Page {page}</span> : null}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {products.length} {brand.name} product{products.length === 1 ? '' : 's'}
            {pages > 1 ? `, showing ${(page - 1) * BRAND_PAGE_SIZE + 1}–${(page - 1) * BRAND_PAGE_SIZE + shown.length}` : ''}. Genuine Australian stock, prices in AUD including 10% GST.
          </p>
          {catCounts.length > 1 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {catCounts.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop/${c.slug}/`}
                  className="px-3 py-1 rounded-lg border text-xs font-medium bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/60 hover:text-white transition"
                >
                  {c.name} ({c.n})
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shown.map((product) => (
            <ProductCard key={product.slug} product={cardProduct(product)} headingLevel={2} />
          ))}
        </div>

        {pages > 1 && (
          <nav aria-label={`${brand.name} pages`} className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {page > 1 && (
              <Link href={brandPageHref(brand.slug, page - 1)} rel="prev" className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-amber-500/60">
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Link>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={brandPageHref(brand.slug, n)}
                aria-current={n === page ? 'page' : undefined}
                className={`min-w-9 text-center px-3 py-2 rounded-lg border text-xs font-semibold transition ${
                  n === page ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/60'
                }`}
              >
                {n}
              </Link>
            ))}
            {page < pages && (
              <Link href={brandPageHref(brand.slug, page + 1)} rel="next" className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-amber-500/60">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </nav>
        )}
      </div>
    </>
  );
}
