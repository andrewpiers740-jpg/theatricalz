'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Sparkles, CheckCircle2, ChevronRight, ArrowRight, ShieldCheck, DollarSign, Calendar, Clock, CreditCard } from 'lucide-react';
import { money } from '@/lib/order';
import { SITE, CONTACT } from '@/config/site';

export default function FinancingPage() {
  const [purchaseValue, setPurchaseValue] = useState(1600);

  // Pay in 4 calculation: 4 equal fortnightly payments of 25% each
  const installmentAmount = purchaseValue / 4;

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 text-white">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Equipment Financing</span>
      </nav>

      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EQUIPMENT FINANCING &bull; PAY IN 4</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Equipment Financing &mdash; Pay in 4 Interest-Free
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Equip your next shoot, production, or studio upgrade today. Split your purchase across 4 equal fortnightly payments with 0% interest and zero surprise account keeping fees.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">0% Interest Always</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pay exactly what is on the price tag. Zero interest, zero monthly admin fees, and zero sign-up penalties when paid on time.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Immediate Gear Dispatch</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No waiting for layby periods. We dispatch your cinema camera, microphone, or lighting kit immediately after the first payment clears.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Instant Online Approval</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Simple checkout verification for Australian residents 18+. Fast automated decision with no lengthy paperwork.
          </p>
        </div>
      </div>

      {/* Interactive Pay in 4 Calculator */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl shadow-amber-500/5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Calculator className="w-4 h-4" />
            <span>Interactive Repayments Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Calculate Your Pay in 4 Schedule
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Drag the slider to adjust your total equipment order value and view your exact 4-step payment timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Total Equipment Order (AUD):</span>
                <span className="text-amber-400 font-mono text-xl font-black">{money(purchaseValue)}</span>
              </div>
              <input
                type="range"
                min={200}
                max={4000}
                step={50}
                value={purchaseValue}
                onChange={(e) => setPurchaseValue(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>$200 AUD</span>
                <span>$2,000 AUD</span>
                <span>$4,000 AUD</span>
              </div>
            </div>

            {/* Visual Schedule Timeline */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Automatic Fortnightly Schedule:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-3 text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-amber-400">1st Payment</div>
                  <div className="text-base font-black text-white font-mono">{money(installmentAmount)}</div>
                  <div className="text-[10px] text-slate-400">Due Today</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">2nd Payment</div>
                  <div className="text-base font-black text-white font-mono">{money(installmentAmount)}</div>
                  <div className="text-[10px] text-slate-400">In 2 Weeks</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">3rd Payment</div>
                  <div className="text-base font-black text-white font-mono">{money(installmentAmount)}</div>
                  <div className="text-[10px] text-slate-400">In 4 Weeks</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">4th Payment</div>
                  <div className="text-base font-black text-white font-mono">{money(installmentAmount)}</div>
                  <div className="text-[10px] text-slate-400">In 6 Weeks</div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
              <span>Order Summary</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                0% Interest
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400">Each Fortnightly Payment:</div>
              <div className="text-3xl font-black text-amber-400 font-mono mt-0.5">
                {money(installmentAmount)} <span className="text-xs text-slate-500 font-normal">/ fortnight</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Purchase Value:</span>
                <span className="font-mono font-bold text-white">{money(purchaseValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Interest & Fees:</span>
                <span className="font-mono font-bold text-emerald-400">$0.00 AUD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dispatch Speed:</span>
                <span className="font-bold text-amber-400">Same-day StarTrack</span>
              </div>
            </div>

            <Link
              href="/shop/"
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider text-center block transition shadow-lg mt-4"
            >
              Shop Pro Gear with Pay in 4 &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works 4-Step Process */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            How Equipment Financing Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Getting your professional cinema and audio gear on set has never been faster.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/20">
              1
            </div>
            <h4 className="text-sm font-bold text-white">Add Gear to Cart</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select any in-stock camera body, prime lenses, microphones, or lighting fixtures up to $4,000 AUD.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/20">
              2
            </div>
            <h4 className="text-sm font-bold text-white">Select Pay in 4</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              At checkout, choose Pay in 4 as your payment option. Connect your Australian debit or credit card.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/20">
              3
            </div>
            <h4 className="text-sm font-bold text-white">Pay 25% Today</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Only pay the first 25% installment today. Your order is immediately released for same-day insured dispatch.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/20">
              4
            </div>
            <h4 className="text-sm font-bold text-white">Spread the Rest</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The remaining 3 payments are automatically deducted every fortnight. Zero interest, zero stress.
            </p>
          </div>
        </div>
      </div>

      {/* Questions / CTA Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">Have questions about equipment financing?</h3>
          <p className="text-xs text-slate-400">
            Our Melbourne gear desk is available Monday to Saturday to answer any questions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/contact/"
            className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700"
          >
            Contact Gear Desk
          </Link>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi ${SITE.name}, I have a question about Pay in 4 equipment financing.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
