'use client';

import PageSchema from '@/components/PageSchema';
import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Sparkles, CheckCircle2, ChevronRight, ArrowRight, ShieldCheck, DollarSign, Calendar, Clock, CreditCard } from 'lucide-react';
import { money } from '@/lib/order';
import { SITE, CONTACT, SHOP } from '@/config/site';

const MIN_AMOUNT = SHOP.payInFourMin || 400;

export default function FinancingPage() {
  const [totalInput, setTotalInput] = useState('');

  // Pay in 4: 4 equal fortnightly payments. Cents are split exactly so the four payments always add up to the total.
  const parsed = parseFloat(totalInput.replace(/,/g, ''));
  const total = Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : null;
  const payments = total === null ? [] : (() => {
    const cents = Math.round(total * 100);
    const base = Math.floor(cents / 4);
    return [0, 1, 2, 3].map((i) => (base + (i < cents - base * 4 ? 1 : 0)) / 100);
  })();

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 text-white">
      <PageSchema type="WebPage" path="/financing/" name="Pay in 4 Financing" description="Pay in 4 on products from $400 AUD: how it works and a payment calculator." />
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
          Get the gear you need today, whether it's a camera, microphone, light or instrument. Split any product priced from $400 AUD across 4 equal fortnightly payments with 0% interest and zero surprise account keeping fees. Products under $400 AUD are a one-time purchase.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">0% Interest Always</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pay exactly what is on the price tag. Zero interest, zero monthly admin fees, and zero sign-up penalties when paid on time.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">Straightforward Ordering</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            No waiting for layby periods. Your camera, microphone, lighting kit or instrument is prepared for dispatch once your first instalment is received.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">Simple Checkout Verification</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            For Australian residents 18+, with no lengthy paperwork. Approval is subject to our eligibility checks.
          </p>
        </div>
      </div>

      {/* Pay in 4 Calculator: type the total, results show below */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl shadow-amber-500/5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Calculator className="w-4 h-4" />
            <span>Pay in 4 Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Enter Your Total
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Type your order total in AUD to see your 4 fortnightly payments. Pay in 4 is available on products from {money(MIN_AMOUNT)} AUD.
          </p>
        </div>

        <div className="max-w-md">
          <label htmlFor="pay4-total" className="block text-xs font-semibold text-slate-300 mb-2">
            Total amount (AUD, inc. GST)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold pointer-events-none">$</span>
            <input
              id="pay4-total"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={totalInput}
              onChange={(e) => setTotalInput(e.target.value.replace(/[^0-9.,]/g, '').slice(0, 12))}
              placeholder="e.g. 1600"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3.5 pl-9 pr-4 text-white text-lg font-mono font-bold placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Results */}
        <div aria-live="polite" className="space-y-4">
          {total === null ? (
            <p className="text-sm text-slate-400 bg-slate-950 border border-slate-800 rounded-2xl p-5">
              Enter an amount above and your Pay in 4 results will show here.
            </p>
          ) : total < MIN_AMOUNT ? (
            <p className="text-sm text-amber-300 bg-slate-950 border border-amber-500/30 rounded-2xl p-5">
              {money(total)} is under {money(MIN_AMOUNT)}. Pay in 4 is available on products from {money(MIN_AMOUNT)} AUD; products under that are a one-time purchase.
            </p>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400">Each fortnightly payment</div>
                  <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                    {money(payments[0])}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  0% Interest
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {payments.map((amount, i) => (
                  <div key={i} className={`bg-slate-900 rounded-xl p-3 text-center space-y-1 border ${i === 0 ? 'border-amber-500/40' : 'border-slate-800'}`}>
                    <div className={`text-[10px] uppercase font-bold ${i === 0 ? 'text-amber-400' : 'text-slate-400'}`}>Payment {i + 1}</div>
                    <div className="text-base font-black text-white font-mono">{money(amount)}</div>
                    <div className="text-[10px] text-slate-400">{i === 0 ? 'Due today' : `In ${i * 2} weeks`}</div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800/80 grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Total purchase:</span>
                  <span className="font-mono font-bold text-white">{money(total)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Interest &amp; fees:</span>
                  <span className="font-mono font-bold text-emerald-400">$0.00 AUD</span>
                </div>
              </div>

              <Link
                href="/shop/"
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider text-center block transition shadow-lg"
              >
                Shop Pro Gear with Pay in 4 &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* How It Works 4-Step Process */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            How Equipment Financing Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Getting the gear you need has never been simpler.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/20">
              1
            </div>
            <h3 className="text-sm font-bold text-white">Add Gear to Cart</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select any in-stock camera, lens, microphone, lighting or music item up to $4,000 AUD.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/20">
              2
            </div>
            <h3 className="text-sm font-bold text-white">Select Pay in 4</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              At checkout, choose Pay in 4 as your payment option. Connect your Australian debit or credit card.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/20">
              3
            </div>
            <h3 className="text-sm font-bold text-white">Pay the First Instalment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pay the first 25% instalment at checkout. The remaining instalments follow every fortnight.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/20">
              4
            </div>
            <h3 className="text-sm font-bold text-white">Spread the Rest</h3>
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
            className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-md"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
