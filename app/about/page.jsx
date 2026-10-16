import Link from 'next/link';
import { Film, ShieldCheck, MapPin, Award, CheckCircle, ChevronRight, Phone, Mail } from 'lucide-react';
import { SITE, BRAND, CONTACT } from '@/config/site';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'About Theatricalz — Pro Cinema & Audio Supply Melbourne',
  description:
    'Founded in 2016 in Melbourne VIC, Theatricalz supplies Australia’s cinema, photo, video, and audio production community with genuine authorized equipment.',
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
            From our founding headquarters at 3 Kirks Lane, Melbourne, Theatricalz has evolved into Australia’s premier specialist pro cinema, photo, video, and audio gear partner.
          </p>
        </div>

        {/* Narrative Section (>700 words entity rich) */}
        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
            Our Origins in Victoria’s Film Heartland
          </h2>
          <p>
            Established in Melbourne in 2016, Theatricalz was built by working camera technicians and production crew who recognized an urgent gap in the Australian market: filmmakers, commercial production houses, and broadcast networks were struggling to obtain genuine, high-end optical systems, 32-bit float location audio equipment, and professional high-output LED fixtures with swift local dispatch and real technical accountability.
          </p>
          <p>
            Operating out of our central facility at 3 Kirks Lane, Melbourne VIC 3000, we established direct relationships with authorized Australian factory distributors. Our founding mission was unshakeable: zero grey-market imports, zero dubious overseas stock, and zero unverified warranties. Every cinema camera package, prime lens set, wireless lavalier kit, and motorized camera gimbal we ship carries full Australian Consumer Law statutory protections and comprehensive local manufacturer warranty coverage.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight pt-4">
            National Footprint & Insured StarTrack Express Logistics
          </h2>
          <p>
            What began as a boutique Melbourne film equipment supply desk now serves cinematographers, independent filmmakers, documentary creators, university film faculties, and television stations across all Australian states and territories. Whether delivering a multi-camera Sony FX3 kit to a commercial set in Sydney, outfitting a wildlife film team in Far North Queensland with weather-sealed Canon C70 bodies and Sennheiser shotgun microphones, or supplying cinema prime glass to Perth and Adelaide, our dispatch operations are engineered for set deadlines.
          </p>
          <p>
            All Australian orders exceeding $500 AUD receive complimentary StarTrack Express priority courier freight, fully insured against transit loss and requiring an adult signature upon delivery. When production shoot dates are fixed, our clients know our Melbourne fulfillment hub operates on strict same-day dispatch cutoffs.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight pt-4">
            Embracing Modern Production Settlement: Crypto & Instant PayID
          </h2>
          <p>
            Theatricalz is recognized across Australia as an early pioneer in modern commercial payment rails. We understand the financial complexities of independent film financing, equipment budgets, and international co-productions. In addition to direct Australian EFT interbank transfers via National Australia Bank (NAB) and instant 24/7 PayID settlements, we proudly offer a dedicated 10% discount on orders settled via major cryptocurrencies including Bitcoin (BTC), Tether (USDT), Ethereum (ETH), Solana (SOL), and BNB. This forward-looking capability provides significant savings to forward-thinking production crews and creative studios.
          </p>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-6 pt-6 border-t border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
            Historical Milestones & Growth
          </h2>
          <div className="space-y-4">
            {BRAND.milestones.map((m) => (
              <div
                key={m.year}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800"
              >
                <div className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 font-mono font-black text-sm border border-amber-500/20 shrink-0">
                  {m.year}
                </div>
                <div className="text-sm text-slate-300 leading-relaxed">
                  {m.event}
                </div>
              </div>
            ))}
          </div>
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
