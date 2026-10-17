import Link from 'next/link';
import { Percent, ChevronRight, Tag, ShieldCheck } from 'lucide-react';
import { SITE } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import ProductCard from '@/components/ProductCard';

export const metadata = {
  title: 'Clearance & Ex-Demo Cinema Gear Deals — Theatricalz',
  description:
    'Save on factory ex-demo, open box, and clearance cinema cameras, prime lenses, and audio gear. 100% tested with full Australian manufacturer warranties.',
  alternates: {
    canonical: `https://${SITE.domain}/clearance/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function ClearancePage() {
  const clearanceItems = PRODUCTS.filter((p) => p.originalPrice || p.badge === 'Best Value' || p.badge === 'Popular');

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Clearance & Ex-Demo</span>
      </nav>

      <div className="pb-6 border-b border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 text-red-400 text-xs font-bold border border-red-900/40">
          <Percent className="w-3.5 h-3.5" />
          <span>FACTORY OVERSTOCK & EX-DEMO SPECIALS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Clearance Pro Gear Specials
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Pristine studio demo models, open-box review units, and seasonal inventory reductions. All units inspected, certified, and covered by full Australian manufacturer warranty.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {clearanceItems.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
