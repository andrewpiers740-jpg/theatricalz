import Link from 'next/link';
import { Truck } from 'lucide-react';
import { AU_RATES, INTL_RATES, RESTRICTED_DESTINATIONS, DISPATCH_NOTE, INTL_NOTE } from '@/config/shipping';

// Estimated delivery block for product pages, driven by config/shipping.js.
export default function ShippingEstimate() {
  return (
    <section aria-label="Estimated delivery" className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 text-xs text-slate-300 space-y-3">
      <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
        <Truck className="w-4 h-4 shrink-0" />
        <span>Estimated Delivery</span>
      </div>

      <div>
        <div className="font-semibold text-white mb-1">Within Australia</div>
        <dl className="divide-y divide-slate-800/80">
          {AU_RATES.map((r) => (
            <div key={r.region} className="flex justify-between gap-3 py-1">
              <dt className="text-slate-400">{r.region}</dt>
              <dd className="text-right text-slate-200">{r.time}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <div className="font-semibold text-white mb-1">International (from Melbourne)</div>
        <dl className="divide-y divide-slate-800/80">
          {INTL_RATES.map((r) => (
            <div key={r.region} className="flex justify-between gap-3 py-1">
              <dt className="text-slate-400">{r.region}</dt>
              <dd className="text-right text-slate-200">{r.time}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        {DISPATCH_NOTE} {INTL_NOTE}
      </p>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        We cannot ship to: {RESTRICTED_DESTINATIONS.join(', ')}. See the full{' '}
        <Link href="/shipping/" className="text-amber-400 underline hover:text-amber-300">delivery &amp; shipping policy</Link>.
      </p>
    </section>
  );
}
