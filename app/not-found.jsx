import Link from 'next/link';
import { Film, ArrowRight } from 'lucide-react';
import { SITE } from '@/config/site';

export const metadata = {
  title: '404 - Gear Page Not Found — Theatricalz',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="bg-slate-950 min-h-[70vh] flex items-center justify-center py-20 px-4 text-center text-white">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
          <Film className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Equipment Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The pro cinema or audio gear page you are looking for may have been archived, updated, or moved to another category.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/shop/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition"
          >
            <span>Explore Current Pro Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
