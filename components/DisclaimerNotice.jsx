import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { DISCLAIMERS, getDisclaimerKeys } from '@/lib/disclaimers';

export default function DisclaimerNotice({ product }) {
  const keys = getDisclaimerKeys(product);
  if (!keys.length) return null;

  return (
    <aside
      aria-label="Product disclaimer"
      className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-4 text-xs text-slate-300 space-y-2"
    >
      <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Disclaimer</span>
      </div>
      <ul className="space-y-1.5">
        {keys.map((k) => (
          <li key={k} className="leading-relaxed">
            <strong className="text-white">{DISCLAIMERS[k].title}:</strong> {DISCLAIMERS[k].short}{' '}
            <Link href={`/disclaimer/#${k}`} className="text-amber-400 underline underline-offset-2 hover:text-amber-300">
              Read the full disclaimer
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
