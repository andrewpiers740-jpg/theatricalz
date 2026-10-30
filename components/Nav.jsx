'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Film,
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  Phone,
  Sparkles,
  Percent,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import { SITE, CATEGORIES, CONTACT } from '@/config/site';
import { useCart } from '@/lib/cartContext';
import BrandsMenu from '@/components/BrandsMenu';
import { money } from '@/lib/order';

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, subtotal, setIsCartOpen, wishlist } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShopDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-lg shadow-black/20 text-white">
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="" width={40} height={40} className="w-10 h-10 rounded-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
                      Theatricalz
                    </span>
                  </div>
                  <p className="hidden sm:block text-[10px] text-slate-400 font-semibold tracking-[0.2em] uppercase">
                    Pro Cinema • Photo • Video • Audio
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === '/' ? 'text-amber-400 bg-slate-800/60' : 'text-slate-200 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Home
              </Link>

              {/* Shop Mega Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                  onMouseEnter={() => setShopDropdownOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith('/shop')
                      ? 'text-amber-400 bg-slate-800/60'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/40'
                  }`}
                  aria-expanded={shopDropdownOpen}
                >
                  <span>Shop Gear</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${shopDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </button>

                {shopDropdownOpen && (
                  <div
                    onMouseLeave={() => setShopDropdownOpen(false)}
                    className="absolute left-0 mt-1 w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 grid grid-cols-1 gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <span>Pro Categories</span>
                      <Link href="/shop/" className="text-amber-400 hover:underline normal-case font-medium">
                        View All Gear &rarr;
                      </Link>
                    </div>

                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop/${cat.slug}/`}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 transition group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                          <Film className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                            {cat.name}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">
                            {cat.description}
                          </div>
                        </div>
                      </Link>
                    ))}

                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <Link href="/clearance/" className="flex items-center gap-1 text-red-400 font-semibold hover:underline">
                        <Percent className="w-3.5 h-3.5" />
                        <span>Clearance & Ex-Demo</span>
                      </Link>
                      <Link href="/financing/" className="flex items-center gap-1 text-amber-400 font-semibold hover:underline">
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Pay in 4 Financing</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <BrandsMenu />

              <Link
                href="/clearance/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  pathname === '/clearance/' ? 'text-amber-400 bg-slate-800/60' : 'text-slate-200 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Percent className="w-3.5 h-3.5 text-red-400" />
                <span>Clearance</span>
              </Link>

              <Link
                href="/financing/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === '/financing/' ? 'text-amber-400 bg-slate-800/60' : 'text-slate-200 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Financing
              </Link>

              <Link
                href="/about/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === '/about/' ? 'text-amber-400 bg-slate-800/60' : 'text-slate-200 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                About Us
              </Link>

              <Link
                href="/contact/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === '/contact/' ? 'text-amber-400 bg-slate-800/60' : 'text-slate-200 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right Action Icons & Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
                aria-label="Open search dialog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist/"
                className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition relative"
                aria-label={`Wishlist, ${wishlist.length} items`}
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2.5 rounded-xl transition duration-150 shadow-md shadow-amber-500/10 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-slate-900"
                aria-label={`Cart with ${itemCount} items, total ${money(subtotal)}`}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] font-extrabold flex items-center justify-center border border-amber-400">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-bold">
                  {subtotal > 0 ? money(subtotal) : 'Cart'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Drawer */}
        {searchOpen && (
          <div className="bg-slate-950 border-t border-slate-800 px-4 py-3 animate-in fade-in duration-150">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cinema cameras, prime lenses, microphones, lighting..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-24 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition"
                >
                  Search
                </button>
              </form>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                <span>Popular:</span>
                <Link href="/search/?q=FX3" className="hover:text-amber-400 underline">Sony FX3</Link>
                <Link href="/search/?q=C70" className="hover:text-amber-400 underline">Canon C70</Link>
                <Link href="/search/?q=Cooke" className="hover:text-amber-400 underline">Cooke SP3</Link>
                <Link href="/search/?q=Rode" className="hover:text-amber-400 underline">RØDE Wireless</Link>
                <Link href="/search/?q=Aputure" className="hover:text-amber-400 underline">Aputure CS15</Link>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 pt-3 pb-6 space-y-3">
            <div className="grid grid-cols-1 gap-1">
              <Link
                href="/"
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
              >
                Home
              </Link>
              <Link
                href="/shop/"
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800 flex items-center justify-between"
              >
                <span>All Pro Gear</span>
                <span className="text-xs text-amber-400 font-mono">16+ Models</span>
              </Link>

              {/* Subcategories list */}
              <div className="pl-4 py-1 space-y-1 border-l-2 border-slate-800 ml-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/shop/${cat.slug}/`}
                    className="block py-1.5 text-sm text-slate-400 hover:text-amber-400"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/brands/"
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
              >
                Brands
              </Link>
              <Link
                href="/clearance/"
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-red-400 hover:bg-slate-800 flex items-center gap-2"
              >
                <Percent className="w-4 h-4" />
                <span>Clearance Specials</span>
              </Link>
              <Link
                href="/financing/"
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
              >
                Equipment Financing
              </Link>
              <Link
                href="/about/"
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
              >
                About Theatricalz
              </Link>
              <Link
                href="/contact/"
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
              >
                Contact Us
              </Link>
              <Link
                href="/tracking/"
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
              >
                Order Tracking
              </Link>
              <Link
                href="/faq/"
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
              >
                Help & FAQ
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <a
                href={`tel:${CONTACT.phone}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Gear Desk: {CONTACT.phoneDisplay}</span>
              </a>
              <div className="text-center text-xs text-slate-500 pt-1">
                3 Kirks Lane, Melbourne VIC · ABN: {SITE.abn}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
