'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, Coins, ShieldCheck, PhoneCall, ChevronRight } from 'lucide-react';
import { SITE, CONTACT, SHOP } from '@/config/site';

const SLIDES = [
  {
    icon: Truck,
    text: `FREE StarTrack Express delivery across Australia on all orders over $${SHOP.freeShippingThreshold} AUD`,
    link: '/shipping/',
    linkLabel: 'Shipping Policy',
  },
  {
    icon: Coins,
    text: `Instant 10% OFF at checkout when paying with Cryptocurrency (BTC, USDT, ETH, SOL, BNB)`,
    link: '/shop/',
    linkLabel: 'Shop & Save',
  },
  {
    icon: ShieldCheck,
    text: `100% Genuine Australian Stock with Official Manufacturer Warranties & ACL Guarantees`,
    link: '/about/',
    linkLabel: 'Our Guarantee',
  },
  {
    icon: PhoneCall,
    text: `Melbourne Pro Gear Desk: 3 Kirks Lane · Phone ${CONTACT.phoneDisplay} or WhatsApp us`,
    link: '/contact/',
    linkLabel: 'Contact Us',
  },
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];
  const Icon = slide.icon;

  return (
    <aside aria-label="Store Announcements" className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center sm:justify-start gap-2 overflow-hidden text-center sm:text-left transition-all duration-300">
          <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-medium text-slate-200 truncate">
            {slide.text}
          </span>
          <Link
            href={slide.link}
            className="hidden md:inline-flex items-center gap-0.5 text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 ml-1"
          >
            <span>{slide.linkLabel}</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-slate-400 text-[11px] shrink-0 font-medium">
          <span className="text-slate-500">ABN: {SITE.abn}</span>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <span>Prices AUD inc. GST</span>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <Link href="/financing/" className="text-amber-400 hover:underline">
            Pay in 4 Installments
          </Link>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <Link href="/tracking/" className="hover:text-white transition">
            Track Order
          </Link>
        </div>
      </div>
    </aside>
  );
}
