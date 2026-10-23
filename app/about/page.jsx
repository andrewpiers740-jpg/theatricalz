import Link from 'next/link';
import { Film, ShieldCheck, MapPin, Award, CheckCircle, ChevronRight, Phone, Mail } from 'lucide-react';
import { SITE, BRAND, CONTACT } from '@/config/site';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'About Us — Melbourne Pro Gear Supplier',
  description:
    'Theatricalz is a Melbourne supplier of genuine Australian-stock cameras, audio, lighting, music gear and more. Founded 2016, ABN 28 614 589 481.',
  alternates: {
    canonical: `https://${SITE.domain}/about/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function AboutPage() {
  const aboutSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: `About ${SITE.name}`,
      description: BRAND.description,
      url: `https://${SITE.domain}/about/`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE.name,
      legalName: 'Theatricalz Australia Pty Ltd',
      url: `https://${SITE.domain}/`,
      foundingDate: BRAND.foundingYear,
      foundingLocation: {
        '@type': 'Place',
        name: BRAND.foundingLocation,
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '3 Kirks Lane',
        addressLocality: 'Melbourne',
        addressRegion: 'VIC',
        postalCode: '3000',
        addressCountry: 'AU',
      },
      telephone: CONTACT.phone,
      email: CONTACT.email,
      sameAs: BRAND.sameAs,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `https://${SITE.domain}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About Us',
          item: `https://${SITE.domain}/about/`,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={aboutSchema} />

      <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-medium">About Theatricalz</span>
        </nav>

        {/* Header */}
        <div className="space-y-4 pb-8 border-b border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Founded 2016 · Melbourne, Victoria
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            About Theatricalz Australia
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Theatricalz is a Melbourne-based supplier of cameras, lenses, microphones, lighting, music instruments and production accessories — genuine Australian stock, priced in AUD including GST, and backed by official local warranties.
          </p>
        </div>

        {/* At a glance — verified facts only */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { stat: '2016', label: 'Founded in Melbourne, Victoria' },
            { stat: '15,000+', label: 'Australian creators and productions outfitted' },
            { stat: '4.9 / 5', label: 'Average across 300 verified Trustpilot reviews' },
          ].map((f) => (
            <div key={f.label} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center sm:text-left">
              <div className="text-3xl font-black text-amber-400 font-mono">{f.stat}</div>
              <div className="text-xs text-slate-300 mt-1 leading-relaxed">{f.label}</div>
            </div>
          ))}
        </div>

        {/* Narrative */}
        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
          <h2 className="section-title text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
            Who We Are
          </h2>
          <p>
            Theatricalz Australia Pty Ltd has traded from 3 Kirks Lane, Melbourne VIC 3000 since 2016. We supply the gear that Australian filmmakers, photographers, podcasters, streamers, musicians, venues and schools use every day — and we do it as a local business you can phone, email or message on WhatsApp.
          </p>
          <p>
            Our focus is simple: genuine products, honest descriptions and clear pricing. Every item is sold as 100% genuine Australian stock with the official local manufacturer warranty, and all prices are quoted in AUD including 10% GST. Your rights under the Australian Consumer Law apply to every order.
          </p>

          <h2 className="section-title text-xl sm:text-2xl font-bold text-white uppercase tracking-tight pt-4">
            What You Can Buy
          </h2>
          <p>
            Our catalogue covers more than 13,000 products across the full creative chain. <Link href="/shop/video/" className="text-amber-400 hover:underline">Video</Link> includes cinema cameras, lenses, monitors, gimbals, tripods and rigging; <Link href="/shop/photography/" className="text-amber-400 hover:underline">Photography</Link> covers cameras, lenses and accessories; <Link href="/shop/lighting-studio/" className="text-amber-400 hover:underline">Lighting &amp; Studio</Link> stocks LED panels, modifiers and stands; and <Link href="/shop/streaming-podcasting/" className="text-amber-400 hover:underline">Streaming &amp; Podcasting</Link> brings together capture cards, microphones and interfaces.
          </p>
          <p>
            On the audio and music side, <Link href="/shop/music-audio/" className="text-amber-400 hover:underline">Music &amp; Audio</Link> spans microphones, interfaces, monitors, guitars, amps, drums, keys and synths, brass and woodwind, and DJ and live-sound equipment. You will also find <Link href="/shop/audio-visual/" className="text-amber-400 hover:underline">Audio Visual</Link> and install gear, <Link href="/shop/computers/" className="text-amber-400 hover:underline">computers</Link>, <Link href="/shop/mobile/" className="text-amber-400 hover:underline">mobile</Link> accessories, <Link href="/shop/cables-connectors/" className="text-amber-400 hover:underline">cables and connectors</Link>, <Link href="/shop/cases-bags/" className="text-amber-400 hover:underline">cases and bags</Link>, <Link href="/shop/outdoor-optics/" className="text-amber-400 hover:underline">outdoor and optics</Link>, <Link href="/shop/radio-security/" className="text-amber-400 hover:underline">radio and security</Link> products, and clearly marked <Link href="/shop/prop-money/" className="text-amber-400 hover:underline">prop money</Link> for screen and stage productions.
          </p>
          <p>
            We stock ranges from brands including Sony, Blackmagic Design, RODE, Sennheiser, Shure, SmallRig, DJI, Aputure, Yamaha, Roland, Fender and many more. Some items are special-order; where that applies, the product page says so and we confirm stock and lead time with you before you pay.
          </p>

          <h2 className="section-title text-xl sm:text-2xl font-bold text-white uppercase tracking-tight pt-4">
            Delivery Across Australia
          </h2>
          <p>
            We dispatch from Melbourne to every state and territory by StarTrack Express. Orders over $500 AUD ship free, and our <Link href="/shipping/" className="text-amber-400 hover:underline">shipping policy</Link> sets out timeframes, insurance and signature requirements in full.
          </p>

          <h2 className="section-title text-xl sm:text-2xl font-bold text-white uppercase tracking-tight pt-4">
            Flexible Ways To Pay
          </h2>
          <p>
            Pay by PayID or Australian bank transfer, split larger purchases with <Link href="/financing/" className="text-amber-400 hover:underline">Pay in 4</Link>, or take 10% off when you settle in cryptocurrency (BTC, USDT, ETH, SOL or BNB). After you place an order we email your payment details and order reference so you can pay securely.
          </p>

          <h2 className="section-title text-xl sm:text-2xl font-bold text-white uppercase tracking-tight pt-4">
            Talk To A Person
          </h2>
          <p>
            Not sure which lens mount, wireless system or interface fits your setup? <Link href="/contact/" className="text-amber-400 hover:underline">Contact our Melbourne team</Link> on {CONTACT.phoneDisplay} or by email and we will help you check compatibility before you buy.
          </p>
        </div>

        {/* Company Registration Details */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-tight">
            Corporate & Regulatory Verification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Registered Entity:</span>
              <strong className="text-white text-sm">Theatricalz Australia Pty Ltd</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Australian Business Number (ABN):</span>
              <a
                href={SITE.abnLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 font-mono font-bold text-sm hover:underline"
              >
                {SITE.abn} &rarr;
              </a>
            </div>
            <div>
              <span className="text-slate-400 block">Australian Company Number (ACN):</span>
              <a
                href={SITE.acnLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 font-mono font-bold text-sm hover:underline"
              >
                {SITE.acn} &rarr;
              </a>
            </div>
            <div>
              <span className="text-slate-400 block">Registered Physical Address:</span>
              <span className="text-white font-medium text-sm">{CONTACT.address}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
