'use client';

import { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, Filter, Search, MapPin } from 'lucide-react';
import { ALL_REVIEWS, TRUSTPILOT_STATS } from '@/lib/reviews';

export default function TrustpilotReviewsList({ initialCount = 10, showFilters = true }) {
  const [reviews, setReviews] = useState(ALL_REVIEWS);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(initialCount);

  // Filter logic
  const filtered = ALL_REVIEWS.filter((rev) => {
    const matchesCity = selectedCity === 'All' || rev.location.includes(selectedCity);
    const matchesRating = selectedRating === 'All' || rev.rating === parseInt(selectedRating, 10);
    const matchesQuery =
      !searchQuery ||
      rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesRating && matchesQuery;
  });

  const displayed = filtered.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      {/* Trustpilot Score Summary Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-extrabold text-2xl tracking-tight flex items-center gap-1.5">
                <Star className="w-7 h-7 fill-emerald-500 text-emerald-500" />
                <span>Trustpilot</span>
              </span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                VERIFIED REVIEWS
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-white">{TRUSTPILOT_STATS.score}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center text-white"
                    >
                      <Star className="w-3.5 h-3.5 fill-white" />
                    </div>
                  ))}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Based on <strong>{TRUSTPILOT_STATS.totalReviews} customer ratings</strong> across Australia
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Ratings and authentic feedback collected from cinematographers, rental house managers, sound recordists, and video creators across Melbourne, Sydney, Brisbane, Perth, Adelaide, and beyond (Jan 2017 – Present).
            </p>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="lg:col-span-7 space-y-2 border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-8">
            {[
              { star: 5, pct: 91, count: 273 },
              { star: 4, pct: 8, count: 24 },
              { star: 3, pct: 1, count: 3 },
              { star: 2, pct: 0, count: 0 },
              { star: 1, pct: 0, count: 0 },
            ].map((row) => (
              <div key={row.star} className="flex items-center gap-3 text-xs text-slate-300">
                <span className="w-12 font-medium">{row.star} stars</span>
                <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${row.pct}%` }}
                  ></div>
                </div>
                <span className="w-10 text-right font-mono text-slate-400">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      {showFilters && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Filter by City:</span>
            </span>
            {['All', 'Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Adelaide'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedCity === city
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      )}

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayed.map((rev) => (
          <div
            key={rev.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-3 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{rev.author}</span>
                    {rev.verifiedBuyer && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        Verified Order
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{rev.location}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-0.5 justify-end">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className={`w-4 h-4 rounded-sm flex items-center justify-center text-white ${
                          s <= rev.rating ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      >
                        <Star className="w-2.5 h-2.5 fill-white" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block font-mono">
                    {rev.date}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug mb-1.5">
                &ldquo;{rev.title}&rdquo;
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {rev.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="text-slate-400">Date of experience: {rev.date}</span>
              <span className="flex items-center gap-1 text-slate-400 hover:text-slate-300">
                <ThumbsUp className="w-3 h-3" />
                <span>Helpful ({rev.likes})</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Load More */}
      {visibleCount < filtered.length && (
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => Math.min(prev + 10, filtered.length))}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700 shadow"
          >
            Load More Reviews ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
