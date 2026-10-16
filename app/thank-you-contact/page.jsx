import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SITE } from '@/config/site';

export const metadata = {
  title: 'Thank You for Contacting Theatricalz',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouContactPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-white">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Message Sent Successfully
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Thank you for reaching out to Theatricalz. Our Melbourne gear desk will review your enquiry and reply via email or phone shortly.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/shop/"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
          >
            <span>Return to Pro Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
