import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SITE } from '@/config/site';
import JsonLd from '@/components/JsonLd';
import { getBrands } from '@/lib/brands';

export const metadata = {
  title: 'Shop by Brand',
  description:
    'Browse every brand at Theatricalz: cinema, camera, audio, lighting and music gear from leading makers. Genuine Australian stock, AUD prices inc. GST.',
  alternates: { canonical: `https://${SITE.domain}/brands/` },
};

export default function BrandsPage() {
  const brands = getBrands();
  const groups = new Map();
  for (const b of brands) {
    if (!groups.has(b.letter)) groups.set(b.letter, []);
    groups.get(b.letter).push(b);
  }
  const letters = [...groups.keys()];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `https://${SITE.domain}/brands/#page`,
        url: `https://${SITE.domain}/brands/`,
        name: 'Shop by Brand',
        isPartOf: { '@type': 'WebSite', name: SITE.name, url: `https://${SITE.domain}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
          { '@type': 'ListItem', position: 2, name: 'Brands', item: `https://${SITE.domain}/brands/` },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-medium">Brands</span>
        </nav>

        <div className="pb-6 border-b border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Genuine Australian stock</div>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">Shop by Brand</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            {brands.length} brands across cinema, photo, audio, lighting and music gear. Pick a brand to see everything we stock from it.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1" aria-label="Jump to letter">
            {letters.map((l) => (
              <a key={l} href={`#letter-${l === '#' ? 'other' : l}`} className="min-w-7 h-7 px-1.5 inline-flex items-center justify-center rounded text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-amber-500 hover:text-slate-950 transition">
                {l}
              </a>
            ))}
          </div>
        </div>

        {[...groups.entries()].map(([l, items]) => (
          <section key={l} id={`letter-${l === '#' ? 'other' : l}`} className="space-y-3 scroll-mt-24">
            <h2 className="text-lg font-black text-amber-400 border-b border-slate-800 pb-1">{l}</h2>
            <ul className="columns-2 sm:columns-3 lg:columns-4 gap-6">
              {items.map((b) => (
                <li key={b.slug}>
                  <Link href={`/brands/${b.slug}/`} className="brand-link">
                    <span>{b.name}</span>
                    <i>{b.count}</i>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
