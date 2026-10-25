'use client';

import PageSchema from '@/components/PageSchema';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Truck, Package, Clock, CheckCircle2, ChevronRight, AlertCircle, PhoneCall } from 'lucide-react';
import { SITE, CONTACT } from '@/config/site';

export default function TrackingPage() {
  const [orderInput, setOrderInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    const cleanId = orderInput.trim().toUpperCase();
    if (!cleanId) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/order/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: cleanId, email: emailInput.trim() }),
      });
      const data = await res.json();

      if (res.ok && data && !data.error) {
        setResult(data);
      } else {
        setError(data && data.error ? data.error : 'We could not find that order. Please check your reference and email, or contact our team.');
      }
    } catch (err) {
      setError('Connection failure. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-white">
      <PageSchema type="WebPage" path="/tracking/" name="Track Your Order" description="Check the status of your Theatricalz order." />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Order Tracking</span>
      </nav>

      <div className="space-y-3 pb-6 border-b border-slate-800 text-center sm:text-left">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
          StarTrack Express Tracking
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Track Your Equipment Consignment
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
          Enter the order reference from your confirmation email (for example TH-XXXXXX) and the email address you ordered with to see where your order is up to.
        </p>
      </div>

      {/* Tracking Input Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="track-email" className="sr-only">Email address used on the order</label>
          <input
            id="track-email"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Email used on the order"
            autoComplete="email"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl py-3 px-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              placeholder="Enter Order Reference (e.g. TH-A8K2F9)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition disabled:opacity-50 shrink-0"
          >
            {loading ? 'Searching...' : 'Track Consignment'}
          </button>
        </form>

        {error && (
          <div className="p-3.5 bg-red-950/50 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tracking Result View */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Consignment ID</span>
              <div className="text-xl font-black text-amber-400 font-mono">{result.ref}</div>
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Status: {result.status}
              </span>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Order Logged</span>
              </div>
              <p className="text-[11px] text-slate-400">Order recorded in Melbourne dispatch queue.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Payment Allocated</span>
              </div>
              <p className="text-[11px] text-slate-400">{result.paymentMethod || 'PayID / Bank / Crypto'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                <Package className="w-4 h-4" />
                <span>3. Warehouse Packing</span>
              </div>
              <p className="text-[11px] text-slate-400">Double-boxed with custom protective foam.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                <Truck className="w-4 h-4" />
                <span>4. StarTrack Express</span>
              </div>
              <p className="text-[11px] text-slate-500">In transit with signature on delivery.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-slate-400">
              Need urgent shoot delivery updates? Contact our Melbourne team directly.
            </span>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi ${SITE.name}, I am following up on the status of my order ${result.ref}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold border border-slate-700 transition"
            >
              Check via WhatsApp Desk &rarr;
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
