import { ShieldCheck, ExternalLink } from 'lucide-react';
import { getWarranty } from '@/lib/warranty';

// Manufacturer warranty block for a product page. Shows the verified period for the brand/model when we
// have it, otherwise a general notice - never a guessed period.
export default function WarrantyInfo({ product }) {
  const w = getWarranty(product);
  const brand = product.brand || 'the manufacturer';

  return (
    <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2 text-xs text-slate-300">
      <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>Manufacturer Warranty{w ? ` — ${w.brand}` : ''}</span>
      </div>

      {w && w.period ? (
        <>
          <div className="text-sm font-bold text-white">{w.period}</div>
          <p className="leading-relaxed">{w.note}</p>
        </>
      ) : (
        <p className="leading-relaxed">
          {w && w.regionNote
            ? w.regionNote
            : `This product is supplied with ${brand}’s manufacturer warranty for Australian stock. Warranty length and terms vary by brand and model — contact us with the model and we will confirm the details before you order.`}
        </p>
      )}

      {w && w.issuer ? <p className="text-[11px] text-slate-500">Warranty provided by {w.issuer}.</p> : null}

      <p className="text-[11px] text-slate-500 leading-relaxed">
        These benefits are in addition to your rights under the Australian Consumer Law. Accessories and consumable parts can carry different terms, and manufacturer terms can change, so check the official terms for your purchase date.
      </p>

      {w && w.url ? (
        <a
          href={w.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 underline underline-offset-2 font-semibold"
        >
          <span>{w.linkLabel || `Official ${w.brand} warranty terms`}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      ) : null}
    </div>
  );
}
