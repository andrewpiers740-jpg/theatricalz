'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useProductIndex } from '@/lib/useProductIndex';
import { subSlug } from '@/lib/subcategory';
import {
  PAGE_SIZE,
  PRICE_PRESETS,
  SORTS,
  parseFilters,
  filtersToQuery,
  isFiltered,
  prepare,
  applyFilters,
  sortItems,
  countBy,
} from '@/lib/shopFilter';

const fmt = (n) => n.toLocaleString('en-AU');
const money0 = (n) => `$${fmt(n)}`;

// Shop page layout: filter sidebar on the left. With no filter chosen the server-rendered category previews
// (children) are shown; choosing any filter switches the right-hand side to live, filtered results.
export default function ShopBrowser({ categories, children }) {
  // The fallback is what is in the page HTML before the filters hydrate. It keeps the same two-column layout and
  // lists the categories as plain links, so nothing jumps sideways when the interactive filters take over.
  const fallback = (
    <div className="lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <aside aria-label="Categories" className="mb-6 lg:mb-0 hidden lg:block">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white mb-3 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" /> Filters
          </h2>
          <ul className="space-y-0.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <a href={`/shop/${c.slug}/`} className="block px-2 py-1.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="min-w-0 space-y-6">{children}</div>
    </div>
  );
  return (
    <Suspense fallback={fallback}>
      <ShopBrowserInner categories={categories}>{children}</ShopBrowserInner>
    </Suspense>
  );
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-slate-800 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? children : null}
    </section>
  );
}

function ShopBrowserInner({ categories, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const f = useMemo(() => parseFilters(params), [params]);
  const filtered = isFiltered(f) || f.sort !== 'featured';
  // The product index is a large file, so it is only fetched once a filter is in use or the sidebar is touched
  const [wantIndex, setWantIndex] = useState(false);
  const { products, loading } = useProductIndex(wantIndex || filtered);
  const [panelOpen, setPanelOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [minDraft, setMinDraft] = useState('');
  const [maxDraft, setMaxDraft] = useState('');

  useEffect(() => {
    setMinDraft(f.min != null ? String(f.min) : '');
    setMaxDraft(f.max != null ? String(f.max) : '');
  }, [f.min, f.max]);

  const update = (next) => {
    const q = filtersToQuery({ ...f, page: 1, ...next });
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const items = useMemo(() => prepare(products, subSlug), [products]);
  const catByslug = useMemo(() => new Map(categories.map((c) => [c.slug, c])), [categories]);

  // brand display names: the most common spelling per brand key
  const brandNames = useMemo(() => {
    const spell = new Map();
    for (const p of items) {
      if (!p._bk || !p.brand) continue;
      let m = spell.get(p._bk);
      if (!m) spell.set(p._bk, (m = new Map()));
      m.set(p.brand, (m.get(p.brand) || 0) + 1);
    }
    const out = new Map();
    for (const [k, m] of spell) out.set(k, [...m.entries()].sort((a, b) => b[1] - a[1])[0][0]);
    return out;
  }, [items]);

  const results = useMemo(() => (filtered ? sortItems(applyFilters(items, f), f.sort) : []), [filtered, items, f]);
  const catCounts = useMemo(() => countBy(applyFilters(items, f, 'cat'), 'category'), [items, f]);
  const subCounts = useMemo(() => (f.cat ? countBy(applyFilters(items, f, 'sub'), '_sub') : new Map()), [items, f]);
  const brandCounts = useMemo(() => countBy(applyFilters(items, f, 'brand'), '_bk'), [items, f]);

  const brandRows = useMemo(() => {
    const selected = new Set(f.brands);
    const q = brandSearch.trim().toLowerCase();
    const rows = [...new Set([...brandCounts.keys(), ...f.brands])]
      .map((k) => ({ key: k, name: brandNames.get(k) || k, n: brandCounts.get(k) || 0 }))
      .filter((r) => !q || r.name.toLowerCase().includes(q))
      .sort((a, b) => Number(selected.has(b.key)) - Number(selected.has(a.key)) || b.n - a.n || a.name.localeCompare(b.name));
    return rows;
  }, [brandCounts, brandNames, f.brands, brandSearch]);
  const visibleBrands = showAllBrands || brandSearch ? brandRows : brandRows.slice(0, 12);

  const activeCount = (f.cat ? 1 : 0) + (f.sub ? 1 : 0) + f.brands.length + (f.min != null || f.max != null ? 1 : 0);
  const shownCount = Math.min(results.length, f.page * PAGE_SIZE);

  const toggleBrand = (key) => update({ brands: f.brands.includes(key) ? f.brands.filter((b) => b !== key) : [...f.brands, key] });
  const applyPrice = (min, max) => update({ min, max });
  const commitDrafts = () => {
    const mn = parseFloat(minDraft);
    const mx = parseFloat(maxDraft);
    applyPrice(Number.isFinite(mn) && mn >= 0 ? mn : null, Number.isFinite(mx) && mx >= 0 ? mx : null);
  };

  const chips = [];
  if (f.cat) chips.push({ label: catByslug.get(f.cat)?.name || f.cat, clear: () => update({ cat: '', sub: '' }) });
  if (f.sub) {
    const subName = catByslug.get(f.cat)?.subcategories?.find((s) => subSlug(s) === f.sub) || f.sub;
    chips.push({ label: subName, clear: () => update({ sub: '' }) });
  }
  for (const b of f.brands) chips.push({ label: brandNames.get(b) || b, clear: () => toggleBrand(b) });
  if (f.min != null || f.max != null) {
    chips.push({
      label: f.min != null && f.max != null ? `${money0(f.min)} – ${money0(f.max)}` : f.min != null ? `${money0(f.min)} and over` : `Up to ${money0(f.max)}`,
      clear: () => applyPrice(null, null),
    });
  }

  const optionBtn = (active) =>
    `w-full flex items-center justify-between gap-2 text-left px-2 py-1.5 rounded-lg text-sm transition ${
      active ? 'bg-amber-500/15 text-amber-300 font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  const panel = (
    <div className="space-y-0">
      <Section title="Categories">
        <ul className="space-y-0.5">
          <li>
            <button type="button" onClick={() => update({ cat: '', sub: '' })} className={optionBtn(!f.cat)}>
              <span>All categories</span>
            </button>
          </li>
          {categories.map((c) => {
            const n = catCounts.get(c.slug) || 0;
            if (!loading && n === 0 && f.cat !== c.slug) return null;
            return (
              <li key={c.slug}>
                <button type="button" onClick={() => update({ cat: c.slug, sub: '' })} className={optionBtn(f.cat === c.slug)} aria-pressed={f.cat === c.slug}>
                  <span className="truncate">{c.name}</span>
                  {!loading ? <span className="text-[11px] text-slate-500 font-mono">{fmt(n)}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </Section>

      {f.cat && catByslug.get(f.cat)?.subcategories?.length ? (
        <Section title="Subcategories">
          <ul className="space-y-0.5">
            {catByslug.get(f.cat).subcategories.map((s) => {
              const slug = subSlug(s);
              const n = subCounts.get(slug) || 0;
              if (!loading && n === 0 && f.sub !== slug) return null;
              return (
                <li key={slug}>
                  <button type="button" onClick={() => update({ sub: f.sub === slug ? '' : slug })} className={optionBtn(f.sub === slug)} aria-pressed={f.sub === slug}>
                    <span className="truncate">{s}</span>
                    {!loading ? <span className="text-[11px] text-slate-500 font-mono">{fmt(n)}</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      <Section title="Price (AUD)">
        <ul className="space-y-0.5 mb-3">
          {PRICE_PRESETS.map((p) => {
            const active = f.min === p.min && (f.max ?? null) === p.max;
            return (
              <li key={p.label}>
                <button type="button" onClick={() => applyPrice(active ? null : p.min, active ? null : p.max)} className={optionBtn(active)} aria-pressed={active}>
                  <span>{p.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="price-min">Minimum price</label>
          <input id="price-min" type="number" inputMode="numeric" min="0" placeholder="Min" value={minDraft} onChange={(e) => setMinDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && commitDrafts()} className="w-full min-w-0 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          <span className="text-slate-500">–</span>
          <label className="sr-only" htmlFor="price-max">Maximum price</label>
          <input id="price-max" type="number" inputMode="numeric" min="0" placeholder="Max" value={maxDraft} onChange={(e) => setMaxDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && commitDrafts()} className="w-full min-w-0 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          <button type="button" onClick={commitDrafts} className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400">Go</button>
        </div>
      </Section>

      <Section title="Brands">
        <div className="relative mb-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          <input type="text" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} placeholder="Find a brand" aria-label="Find a brand" className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-8 pr-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        {loading ? (
          <p className="text-xs text-slate-500">Loading brands…</p>
        ) : (
          <>
            <ul className={`space-y-0.5 ${showAllBrands || brandSearch ? 'max-h-72 overflow-y-auto pr-1' : ''}`}>
              {visibleBrands.map((b) => {
                const checked = f.brands.includes(b.key);
                return (
                  <li key={b.key}>
                    <label className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition ${checked ? 'text-amber-300' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleBrand(b.key)} className="accent-amber-500 w-4 h-4 shrink-0" />
                      <span className="truncate flex-1">{b.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{fmt(b.n)}</span>
                    </label>
                  </li>
                );
              })}
              {visibleBrands.length === 0 ? <li className="text-xs text-slate-500 px-2 py-1">No brand matches.</li> : null}
            </ul>
            {!brandSearch && brandRows.length > 12 ? (
              <button type="button" onClick={() => setShowAllBrands(!showAllBrands)} className="mt-2 text-xs font-semibold text-amber-400 hover:underline">
                {showAllBrands ? 'Show fewer brands' : `Show all ${fmt(brandRows.length)} brands`}
              </button>
            ) : null}
          </>
        )}
      </Section>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:gap-8 lg:items-start">
      {/* Filters */}
      <aside aria-label="Filter products" onPointerEnter={() => setWantIndex(true)} onFocusCapture={() => setWantIndex(true)} onTouchStart={() => setWantIndex(true)} className="mb-6 lg:mb-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
        <button
          type="button"
          onClick={() => { setWantIndex(true); setPanelOpen(!panelOpen); }}
          aria-expanded={panelOpen}
          className="lg:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white"
        >
          <span className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-amber-400" /> Filters{activeCount ? ` (${activeCount})` : ''}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${panelOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`${panelOpen ? 'block' : 'hidden'} lg:block mt-3 lg:mt-0 bg-slate-900 border border-slate-800 rounded-2xl p-4`}>
          <div className="hidden lg:flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-amber-400" /> Filters</h2>
            {activeCount ? <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="text-xs font-semibold text-amber-400 hover:underline">Clear all</button> : null}
          </div>
          {panel}
        </div>
      </aside>

      {/* Results or category previews */}
      <div className="min-w-0 space-y-6">
        {filtered ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-300" aria-live="polite">
                {loading ? 'Loading products…' : (<><strong className="text-white font-mono">{fmt(results.length)}</strong> product{results.length === 1 ? '' : 's'}</>)}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <label htmlFor="shop-sort" className="text-slate-400">Sort</label>
                <select id="shop-sort" value={f.sort} onChange={(e) => update({ sort: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {chips.length ? (
              <div className="flex flex-wrap items-center gap-2">
                {chips.map((c, i) => (
                  <button key={i} type="button" onClick={c.clear} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-xs text-amber-200 hover:bg-amber-500/25">
                    {c.label} <X className="w-3 h-3" aria-hidden="true" /><span className="sr-only">Remove filter</span>
                  </button>
                ))}
                <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="text-xs font-semibold text-slate-400 hover:text-white underline">Clear all</button>
              </div>
            ) : null}

            {!loading && results.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-200">No products match these filters.</p>
                <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="text-xs font-semibold text-amber-400 hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.slice(0, f.page * PAGE_SIZE).map((p) => (
                  <ProductCard key={p.slug} product={p} headingLevel={2} />
                ))}
              </div>
            )}

            {results.length > shownCount ? (
              <div className="text-center space-y-2 pt-2">
                <p className="text-xs text-slate-400">Showing {fmt(shownCount)} of {fmt(results.length)} products</p>
                <button type="button" onClick={() => update({ page: f.page + 1 })} className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition">
                  Show more products
                </button>
              </div>
            ) : null}
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
