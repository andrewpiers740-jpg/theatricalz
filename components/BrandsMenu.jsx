'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { BRANDS_URL } from '@/lib/brandsUrl';

// Brands dropdown for the main navigation. The brand list is a small static file fetched the first time the
// menu opens, so it never bloats page HTML. Every brand links to /brands/<slug>/ (all products for that brand).
let cache = null;
let pending = null;
const loadBrands = () =>
  (pending ??= fetch(BRANDS_URL)
    .then((r) => r.json())
    .then((rows) => (cache = rows.map(([name, slug, count]) => ({ name, slug, count })))));

const letterOf = (name) => {
  const c = name.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
};

export default function BrandsMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState(cache);
  const [filter, setFilter] = useState('');
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !cache) loadBrands().then(setBrands).catch(() => setBrands([]));
  }, [open]);

  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setFilter('');
  }, [pathname]);

  const q = filter.trim().toLowerCase();
  const shown = useMemo(() => (brands ? (q ? brands.filter((b) => b.name.toLowerCase().includes(q)) : brands) : []), [brands, q]);
  const groups = useMemo(() => {
    const g = new Map();
    for (const b of shown) {
      const l = letterOf(b.name);
      if (!g.has(l)) g.set(l, []);
      g.get(l).push(b);
    }
    return [...g.entries()];
  }, [shown]);
  const letters = useMemo(() => (brands ? [...new Set(brands.map((b) => letterOf(b.name)))] : []), [brands]);

  const jump = (l) => {
    const el = listRef.current && listRef.current.querySelector(`[data-letter="${l}"]`);
    if (el && listRef.current) listRef.current.scrollTo({ top: el.offsetTop - listRef.current.offsetTop, behavior: 'smooth' });
  };

  return (
    <div className="relative" ref={wrapRef} onMouseEnter={() => setOpen(true)} onMouseLeave={() => { if (document.activeElement !== inputRef.current) setOpen(false); }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
          pathname.startsWith('/brands') ? 'text-amber-400 bg-slate-800/60' : 'text-slate-200 hover:text-white hover:bg-slate-800/40'
        }`}
      >
        <span>Brands</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180 text-amber-400' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-[44rem] max-w-[90vw] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50">
          <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Shop by brand{brands ? ` (${brands.length})` : ''}
            </div>
            <Link href="/brands/" className="text-xs font-medium text-amber-400 hover:underline">
              View all brands &rarr;
            </Link>
          </div>

          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Find a brand"
              aria-label="Find a brand"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {!q && letters.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3" aria-label="Jump to letter">
              {letters.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => jump(l)}
                  className="min-w-6 h-6 px-1 rounded text-[11px] font-bold text-slate-300 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 transition"
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          <div ref={listRef} className="max-h-[55vh] overflow-y-auto pr-1 relative">
            {!brands ? (
              <p className="text-sm text-slate-400 py-6 text-center">Loading brands…</p>
            ) : groups.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No brand matches &ldquo;{filter}&rdquo;.</p>
            ) : (
              groups.map(([l, items]) => (
                <div key={l} data-letter={l} className="mb-3">
                  <div className="text-xs font-black text-amber-400 border-b border-slate-800 pb-1 mb-1.5">{l}</div>
                  <ul className="columns-2 sm:columns-3 gap-4">
                    {items.map((b) => (
                      <li key={b.slug} className="break-inside-avoid">
                        <Link href={`/brands/${b.slug}/`} className="flex items-center justify-between gap-2 py-1 text-sm text-slate-200 hover:text-amber-400 transition">
                          <span className="truncate">{b.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{b.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
