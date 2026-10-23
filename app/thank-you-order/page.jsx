'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Mail, Clock, ArrowRight, ShieldCheck, Film } from 'lucide-react';
import { SITE, CONTACT } from '@/config/site';

function ThankYouOrderContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get('id') || 'TH-CONFIRMED';

  return (
    <div className="bg-slate-950 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-white">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            Order Reference: {orderRef}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your pro gear order has been received by our Melbourne warehouse team.
          </p>
        </div>

        {/* Watch for Payment-Details Email Notice (Strict WebForge rule: NO bank details here!) */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 text-left space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
            <Mail className="w-5 h-5" />
            <span>Next Step: Watch for Payment Details Email</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            We have dispatched an automated confirmation to your email. Our gear desk is reviewing your equipment allocation and will send your payment details shortly by email or WhatsApp.
          </p>
          <div className="text-[11px] text-slate-400 pt-1">
            Once payment is received, your consignment will be prepared for StarTrack Express priority courier pickup.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 pt-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span>100% Genuine AU Stock</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span>Same-Day Dispatch Ready</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
          >
            Continue Browsing
          </Link>
          <Link
            href="/tracking/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition border border-slate-700"
          >
            Track Consignment
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 p-12 text-center text-slate-400 text-sm">Loading confirmation...</div>}>
      <ThankYouOrderContent />
    </Suspense>
  );
}
