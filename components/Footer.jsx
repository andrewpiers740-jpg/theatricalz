import Link from 'next/link';
import { Film, ShieldCheck, Truck, RefreshCw, Star, Lock, Heart, ArrowUpRight } from 'lucide-react';
import { SITE, CONTACT, SHOP, CATEGORIES } from '@/config/site';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
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
              <div className="text-sm font-bold text-white">14-Day Pro Return Policy</div>
              <div className="text-xs text-slate-400">Australian Consumer Law protection</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">PayID & Crypto Discount</div>
              <div className="text-xs text-slate-400">Instant 10% discount on crypto rails</div>
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
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight uppercase">Theatricalz</span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Australia’s premier supplier of pro cinema cameras, anamorphic lenses, wireless broadcast audio, high-output LED lighting, and studio post-production hardware.
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Pro Equipment
            </h4>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/shop/${cat.slug}/`} className="text-slate-400 hover:text-amber-400 transition">
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer & Sales
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tracking/" className="text-slate-400 hover:text-amber-400 transition">
                  StarTrack Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/financing/" className="text-slate-400 hover:text-amber-400 transition">
                  Pay in 4 Equipment Financing
                </Link>
              </li>
              <li>
                <Link href="/compare/" className="text-slate-400 hover:text-amber-400 transition">
                  Gear Compare Tool
                </Link>
              </li>
              <li>
                <Link href="/wishlist/" className="text-slate-400 hover:text-amber-400 transition">
                  Saved Gear Wishlist
                </Link>
              </li>
              <li>
                <Link href="/faq/" className="text-slate-400 hover:text-amber-400 transition">
                  Help Desk & FAQs
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="text-slate-400 hover:text-amber-400 transition">
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Policies & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/shipping/" className="text-slate-400 hover:text-amber-400 transition">
                  Delivery & Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns/" className="text-slate-400 hover:text-amber-400 transition">
                  Returns & Warranty
                </Link>
              </li>
              <li>
                <Link href="/sales-policy/" className="text-slate-400 hover:text-amber-400 transition">
                  Sales Policy & GST
                </Link>
              </li>
              <li>
                <Link href="/terms/" className="text-slate-400 hover:text-amber-400 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy/" className="text-slate-400 hover:text-amber-400 transition">
                  Privacy Policy (GDPR / AU)
                </Link>
              </li>
              <li>
                <Link href="/about/" className="text-slate-400 hover:text-amber-400 transition">
                  About Us & Milestones
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="text-slate-400 hover:text-amber-400 transition">
                  Contact Melbourne Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Accepted Payment Rails & StarTrack Badge */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 mr-2">Accepted Payment Rails:</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300">
              PayID (sales&#64;theatricalz.com.au)
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-amber-400 font-medium">
              Crypto 10% Off (BTC, USDT, ETH, SOL, BNB)
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              EFT Bank Transfer (NAB)
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              Pay in 4 Installments
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              4.9/5 Rating on Trustpilot (300+ Reviews)
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Theatricalz Australia (ABN: {SITE.abn}, ACN: {SITE.acn}). All rights reserved. All prices quoted in AUD including 10% Australian GST.
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
