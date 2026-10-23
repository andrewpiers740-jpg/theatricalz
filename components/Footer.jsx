import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, Star, Lock, Heart, ArrowUpRight } from 'lucide-react';
import { SITE, CONTACT, SHOP, CATEGORIES } from '@/config/site';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">100% Genuine AU Stock</div>
              <div className="text-xs text-slate-400">Official AU manufacturer warranties</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Free StarTrack Express</div>
              <div className="text-xs text-slate-400">On all AU orders over $500 AUD</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">30-Day Returns</div>
              <div className="text-xs text-slate-400">Australian Consumer Law protection</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Bank Transfer, PayID & Crypto</div>
              <div className="text-xs text-slate-400">10% off when you pay with crypto</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info & Address */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="" width={36} height={36} className="w-9 h-9 rounded-xl" />
              <span className="text-2xl font-black text-white tracking-tight uppercase">Theatricalz</span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Genuine Australian-stock cameras, lenses, audio, lighting, music instruments and production gear — shipped from Melbourne with official local warranties.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="font-semibold text-slate-200">
                Melbourne Pro Facility & Dispatch Hub:
              </p>
              <p>{CONTACT.address}</p>
              <p>
                Phone:{' '}
                <a href={`tel:${CONTACT.phone}`} className="text-amber-400 hover:underline">
                  {CONTACT.phoneDisplay}
                </a>
              </p>
              <p>
                Email:{' '}
                <a href={`mailto:${CONTACT.email}`} className="text-amber-400 hover:underline">
                  sales&#64;theatricalz.com.au
                </a>
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a
                href={SITE.abnLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              >
                <span>ABN: {SITE.abn}</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href={SITE.acnLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              >
                <span>ACN: {SITE.acn}</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Pro Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-5 pb-2 border-b-2 border-amber-500/70 inline-block">
              Pro Equipment
            </h4>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/shop/${cat.slug}/`} className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/clearance/" className="text-red-400 hover:text-red-300 font-medium transition">
                  Clearance & Ex-Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Services & Ordering */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-5 pb-2 border-b-2 border-amber-500/70 inline-block">
              Customer & Sales
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tracking/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  StarTrack Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/financing/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Pay in 4 Equipment Financing
                </Link>
              </li>
              <li>
                <Link href="/compare/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Gear Compare Tool
                </Link>
              </li>
              <li>
                <Link href="/wishlist/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Saved Gear Wishlist
                </Link>
              </li>
              <li>
                <Link href="/faq/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Help Desk & FAQs
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Camera & Audio Tech Guides
                </Link>
              </li>
              <li>
                <Link href="/admin/" className="text-slate-500 hover:text-slate-400 text-xs transition">
                  Dispatch Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-5 pb-2 border-b-2 border-amber-500/70 inline-block">
              Policies & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/shipping/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Delivery & Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Returns & Warranty
                </Link>
              </li>
              <li>
                <Link href="/sales-policy/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Sales Policy & GST
                </Link>
              </li>
              <li>
                <Link href="/terms/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Product Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Privacy Policy (GDPR / AU)
                </Link>
              </li>
              <li>
                <Link href="/about/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="text-slate-400 hover:text-amber-400 hover:translate-x-0.5 inline-block transition">
                  Contact Melbourne Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trustpilot badge */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              4.9/5 Rating on Trustpilot (300+ Reviews)
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} THEATRICALZ PTY LTD (ABN: {SITE.abn}, ACN: {SITE.acn}). All rights reserved. All prices quoted in AUD including 10% Australian GST.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy/" className="hover:text-slate-400">Privacy</Link>
            <span>·</span>
            <Link href="/terms/" className="hover:text-slate-400">Terms</Link>
            <span>·</span>
            <Link href="/llms.txt" className="hover:text-amber-400">llms.txt</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
