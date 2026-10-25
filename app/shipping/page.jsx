import Link from 'next/link';
import PageSchema from '@/components/PageSchema';
import { Truck, ShieldCheck, Clock, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SITE, CONTACT, SHOP } from '@/config/site';
import { AU_RATES, INTL_RATES, RESTRICTED_DESTINATIONS, INTL_NOTE } from '@/config/shipping';

export const metadata = {
  title: 'Delivery & Shipping Policy',
  description:
    'Free StarTrack Express across Australia on orders over $500 AUD. We also ship to New Zealand and worldwide from our Melbourne warehouse.',
  alternates: {
    canonical: `https://${SITE.domain}/shipping/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function ShippingPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-white">
      <PageSchema type="WebPage" path="/shipping/" name="Delivery & Shipping" description="Delivery times, shipping costs and restrictions for Australia and worldwide." />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Delivery & Shipping</span>
      </nav>

      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Melbourne Warehouse Dispatch
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Delivery & Shipping Policy
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Cameras, lenses, audio gear and instruments need careful packaging and secure transit. Here is how we ship orders from our Melbourne warehouse to Australia, New Zealand and the rest of the world.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <Truck className="w-6 h-6 text-amber-400" />
          <h2 className="text-sm font-bold text-white">Free Express Over $500</h2>
          <p className="text-xs text-slate-400">Orders of $500 AUD or more delivered within Australia receive complimentary StarTrack Express freight.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">Full Transit Insurance</h2>
          <p className="text-xs text-slate-400">Every consignment is 100% insured against loss or damage until signed for.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <Clock className="w-6 h-6 text-blue-400" />
          <h2 className="text-sm font-bold text-white">Fast Dispatch</h2>
          <p className="text-xs text-slate-400">Orders placed before 2:00 PM AEST on business days are normally dispatched the same day.</p>
        </div>
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Estimated Delivery Timeframes</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
          {AU_RATES.map((r) => (
            <div key={r.region} className="grid grid-cols-2 p-3.5 text-xs">
              <span className="font-semibold text-slate-200">{r.region}</span>
              <span className="text-slate-300">{r.time}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">Shipping To New Zealand & Worldwide</h2>
        <p>
          We ship from our Melbourne warehouse to customers around the world. Australia is our main market, followed by New Zealand, and we welcome orders from the rest of the world. The first table above is for delivery within Australia. Estimated delivery times to other regions are below.
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
          {INTL_RATES.map((r) => (
            <div key={r.region} className="grid grid-cols-2 p-3.5 text-xs">
              <span className="font-semibold text-slate-200">{r.region}</span>
              <span className="text-slate-300">{r.time}</span>
            </div>
          ))}
        </div>

        <p>{INTL_NOTE}</p>
        <p>
          <strong className="text-white">Destinations we cannot ship to:</strong> {RESTRICTED_DESTINATIONS.join(', ')}.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">Packaging & Signature Security</h2>
        <p>
          High-value items such as lenses, camera bodies and audio gear are double-boxed using custom shock-absorbing foam inserts. We never ship bare manufacturer boxes. An adult signature is strictly required at delivery; couriers are instructed never to leave items unattended or safe-dropped.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">Tracking Your Order</h2>
        <p>
          Upon dispatch from 3 Kirks Lane, Melbourne, you will receive an automated email containing your StarTrack / courier consignment number and direct tracking link. You can also monitor your delivery status live on our <Link href="/tracking/" className="text-amber-400 underline">Order Tracking Page</Link>.
        </p>
      </div>
    </div>
  );
}
