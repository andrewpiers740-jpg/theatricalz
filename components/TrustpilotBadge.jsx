import { Star, CheckCircle } from 'lucide-react';
import { TRUSTPILOT_STATS } from '@/lib/reviews';

export default function TrustpilotBadge({ className = '' }) {
  return (
    <div className={`inline-flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2 text-white shadow-lg ${className}`}>
      {/* Trustpilot Logo & Score */}
      <div className="flex items-center gap-1.5">
        <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
          <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
          <span>Trustpilot</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-5 h-5 bg-emerald-500 text-white rounded flex items-center justify-center text-xs shadow-sm"
          >
            <Star className="w-3.5 h-3.5 fill-white text-white" />
          </div>
        ))}
      </div>

      <div className="text-xs">
        <span className="font-bold text-white text-sm">{TRUSTPILOT_STATS.score}</span>
        <span className="text-slate-400 ml-1">/ 5.0</span>
        <span className="text-slate-500 mx-1.5">·</span>
        <span className="text-slate-300 font-semibold">{TRUSTPILOT_STATS.totalReviews} Verified Australian Reviews</span>
      </div>
    </div>
  );
}
