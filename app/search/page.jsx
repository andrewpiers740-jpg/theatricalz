'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Film, ArrowRight, Sparkles } from 'lucide-react';
import { POSTS, CATEGORIES } from '@/config/site';
import ProductCard from '@/components/ProductCard';

const MIN_QUERY = 2;
const PAGE_SIZE = 24;

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Search runs on the server (/api/search), so the whole catalogue is never downloaded to the browser.
  const trimmed = query.trim();
  const cleanQ = trimmed.length >= MIN_QUERY ? trimmed : '';
  const [state, setState] = useState({ items: [], total: 0, hasMore: false, posts: [], loading: false, error: '' });
  const reqId = useRef(0);

  const fetchPage = async (q, offset, append) => {
    const id = ++reqId.current;
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const r = await fetch(`/api/search/?q=${encodeURIComponent(q)}&limit=${PAGE_SIZE}&offset=${offset}`);
      if (r.status === 429) throw new Error('Too many searches in a short time. Please wait a moment and try again.');
      const d = await r.json();
      if (id !== reqId.current) return;
      const items = (d.products || []).map((p) => ({
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        images: p.image ? [p.image] : [],
        shortDescription: p.shortDescription,
      }));
      setState((s) => ({
        items: append ? [...s.items, ...items] : items,
        total: d.totalProducts ?? d.total ?? 0,
        hasMore: Boolean(d.hasMore),
        posts: append ? s.posts : d.posts || [],
        loading: false,
        error: '',
      }));
    } catch (e) {
      if (id === reqId.current) setState((s) => ({ ...s, loading: false, error: e.message || 'Search is unavailable right now.' }));
    }
  };

  useEffect(() => {
    if (!cleanQ) {
      reqId.current += 1;
      setState({ items: [], total: 0, hasMore: false, posts: [], loading: false, error: '' });
      return undefined;
    }
    const timer = setTimeout(() => fetchPage(cleanQ, 0, false), 250);
    return () => clearTimeout(timer);
  }, [cleanQ]);

  const matchingProducts = state.items;
  const matchingPosts = state.posts;

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Search Pro Gear Catalog
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Find pro cinema cameras, cine lenses, audio recorders, LED lighting, and broadcast gear.
        </p>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by model, brand, or feature (e.g. FX3, C70, Rode, 32-bit float, Aputure)..."
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            autoFocus
          />
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-1">
          <span>Popular:</span>
          {['Sony FX3', 'Canon C70', 'Blackmagic', 'Cooke SP3', 'Rode Wireless', 'Aputure CS15', 'OConnor'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {cleanQ ? (
        <div className="space-y-8 pt-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="text-slate-400">
              {state.loading && matchingProducts.length === 0 ? 'Searching…' : (<>Found <strong className="text-amber-400 font-mono">{state.total}</strong> matching products and</>)} {!(state.loading && matchingProducts.length === 0) && (<><strong className="text-amber-400 font-mono">{matchingPosts.length}</strong> articles for &ldquo;{query}&rdquo;</>)}
            </span>
          </div>

          {/* Matching Products */}
          {matchingProducts.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {matchingProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
              {state.hasMore && (
                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-400">
                    Showing {matchingProducts.length} of {state.total} products
                  </p>
                  <button
                    type="button"
                    onClick={() => fetchPage(cleanQ, matchingProducts.length, true)}
                    disabled={state.loading}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition"
                  >
                    Show more products
                  </button>
                </div>
              )}
            </div>
          ) : state.loading ? null : state.error ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <p className="text-sm text-amber-300 font-semibold">{state.error}</p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
              <p className="text-sm text-slate-300 font-semibold">No direct product matches for &ldquo;{query}&rdquo;.</p>
              <p className="text-xs text-slate-400">Try searching for generic terms like &ldquo;camera&rdquo;, &ldquo;audio&rdquo;, or &ldquo;lens&rdquo;.</p>
            </div>
          )}

          {/* Matching Articles */}
          {matchingPosts.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <h3 className="text-base font-bold text-white uppercase tracking-tight">
                Matching Technical Articles & Guides
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchingPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}/`}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">{post.category}</span>
                      <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors mt-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{post.excerpt}</p>
                    </div>
                    <div className="text-xs text-amber-400 font-semibold flex items-center gap-1 mt-4">
                      <span>Read guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty Query Suggestion */
        <div className="space-y-4 pt-6">
        {trimmed.length > 0 && (
          <p className="text-xs text-slate-400 text-center">Type at least {MIN_QUERY} characters to search, or browse a category below.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}/`}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition group"
            >
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                Browse {cat.name} &rarr;
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{cat.description}</p>
            </Link>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
    <h1 className="sr-only">Search Pro Gear Catalog</h1>
    <Suspense fallback={<div className="min-h-screen bg-slate-950 p-12 text-center text-slate-400 text-sm">Loading search...</div>}>
      <SearchContent />
    </Suspense>
    </>
  );
}
