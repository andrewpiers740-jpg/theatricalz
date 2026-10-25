import Link from 'next/link';
import HeroSlideshow from '@/components/HeroSlideshow';
import Image from 'next/image';
import {
  Film,
  Camera,
  Mic2,
  Sun,
  Layers,
  HardDrive,
  Truck,
  ShieldCheck,
  Coins,
  CreditCard,
  ArrowRight,
  Star,
  CheckCircle,
  HelpCircle,
  Percent,
  Sparkles,
  PhoneCall,
  ChevronRight,
} from 'lucide-react';
import { SITE, BRAND, CATEGORIES, FAQ, CONTACT, SHOP } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import ProductCard from '@/components/ProductCard';
import { cardProduct } from '@/lib/cardProduct';
import TrustpilotBadge from '@/components/TrustpilotBadge';
import TrustpilotReviewsList from '@/components/TrustpilotReviewsList';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Theatricalz — Pro Camera, Audio & Music Gear Australia',
  description:
    'Shop over 13,000 genuine Australian-stock cameras, lenses, microphones, lighting, guitars and more from Melbourne. Free StarTrack Express over $500.',
  alternates: {
    canonical: `https://${SITE.domain}/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function HomePage() {
  const featuredProducts = PRODUCTS.slice(0, 8);

  const homeSchema = [
    {
      '@context': 'https://schema.org',
      '@type': ['Store', 'Organization'],
      name: SITE.name,
      description: BRAND.description,
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
      url: `https://${SITE.domain}/`,
      sameAs: BRAND.sameAs,
      areaServed: ['Australia', 'New Zealand', 'Worldwide'],
      numberOfItems: PRODUCTS.length,
      knowsAbout: [
        'Digital Cinema Cameras',
        'Cine Primes',
        'Wireless Audio',
        'Field Recorders',
        'Studio Lighting',
        'Camera Gimbals',
      ],
      priceRange: '$$$',
      brand: {
        '@type': 'Brand',
        name: SITE.name,
      },
      makesOffer: {
        '@type': 'AggregateOffer',
        priceCurrency: SITE.currency,
        lowPrice: 599,
        highPrice: 28500,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: `https://${SITE.domain}/`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `https://${SITE.domain}/search/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.slice(0, 6).map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  const categoryIcons: Record<string, any> = {
    'prop-money': Layers,
    'audio-visual': HardDrive,
    'cables-connectors': Layers,
    'cases-bags': Layers,
    'computers': HardDrive,
    'lighting-studio': Sun,
    'mobile': Camera,
    'music-audio': Mic2,
    'outdoor-optics': Camera,
    'photography': Camera,
    'radio-security': Mic2,
    'streaming-podcasting': Mic2,
    'video': Film,
  };

  return (
    <>
      <JsonLd data={homeSchema} />

      {/* 1. Cinematic Hero Section */}
      <section className="relative bg-slate-950 overflow-hidden border-b border-slate-800">
        {/* Ambient lighting backdrop */}
        <div className="absolute inset-0 z-0">
          <HeroSlideshow images={['/images/hero/home-1.webp', '/images/hero/home-2.webp', '/images/hero/home-3.webp']} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/10"></div>
          <div aria-hidden="true" className="absolute -top-24 right-0 w-[40rem] h-[40rem] rounded-full bg-amber-500/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Trustpilot pill banner */}
              <div className="inline-flex items-center gap-2">
                <TrustpilotBadge />
              </div>

              {/* Exact Single H1 containing target keywords */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase">
                Pro Camera, Audio & Music Gear <span className="text-amber-400">Australia</span>
              </h1>

              {/* Brand Entity Statement */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Cinema cameras, lenses, microphones, LED lighting, guitars, drums, keys and more — over 13,000 genuine Australian-stock products shipped from our Melbourne warehouse to Australia, New Zealand and worldwide.
              </p>

              {/* Highlights List */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>100% Genuine Australian Stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Free StarTrack Express Over $500</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>10% Off with Crypto (BTC, USDT, SOL)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>30-Day Returns on Eligible Items</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/shop/"
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 hover:-translate-y-0.5 text-slate-950 font-black text-sm tracking-wide uppercase transition duration-150 flex items-center gap-2 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40"
                >
                  <span>Shop All Gear</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/financing/"
                  className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 hover:-translate-y-0.5 text-white font-semibold text-sm transition border border-slate-700/80 hover:border-amber-500/50 flex items-center gap-2"
                >
                  <span>Pay in 4 Installments</span>
                </Link>
              </div>
            </div>

            {/* Hero Showcase Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-700/70 rounded-3xl p-6 shadow-2xl shadow-black/40 ring-1 ring-amber-500/10 relative overflow-hidden backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Flagship Melbourne Stock
                    </span>
                  </div>
                  <span className="text-xs text-amber-400 font-mono font-semibold">
                    StarTrack Dispatch Ready
                  </span>
                </div>

                <div className="relative aspect-[4/3] bg-white rounded-2xl overflow-hidden my-4 flex items-center justify-center p-4">
                  <Image
                    src="/images/products/video/sony-fx3-cinema-line-camera.webp"
                    alt="Sony FX3 Cinema Line Full-Frame Camera"
                    fill
                    className="object-contain p-4"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-500/30">
                    TOP SELLER
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase">Sony Cinema Line</span>
                    <span className="text-xs text-emerald-400 font-medium">In Stock (Melb)</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Sony FX3 Full-Frame Cinema Camera</h2>
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-2xl font-black text-white font-mono">$5,999.00 AUD</span>
                      <span className="text-xs text-slate-400 ml-2">(inc. 10% GST)</span>
                    </div>
                    <Link
                      href="/shop/video/sony-fx3-cinema-line-camera/"
                      className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>View Kit</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar (4 Pro Anchors) */}
      <section className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">100% AU Stock Guarantee</div>
              <div className="text-xs text-slate-400">Direct Australian distributor warranties</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Free StarTrack Express</div>
              <div className="text-xs text-slate-400">Over $500 AUD with transit insurance</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">10% Crypto Discount</div>
              <div className="text-xs text-slate-400">Pay with BTC, USDT, ETH, SOL, BNB</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Bank Transfer, PayID & Crypto</div>
              <div className="text-xs text-slate-400">10% off when you pay with crypto</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pro Categories Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Shop By Category
            </div>
            <h2 className="section-title text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Find Gear For Every Project
            </h2>
          </div>
          <Link
            href="/shop/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const IconComponent = categoryIcons[cat.slug] || Film;
            return (
              <Link
                key={cat.slug}
                href={`/shop/${cat.slug}/`}
                className="group relative bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/70 backdrop-blur-sm text-amber-400 border border-slate-800">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white">
                    <span>{cat.subcategories?.length || 4} Specialized Ranges</span>
                    <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Explore &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Pro Products Showcase */}
      <section className="bg-slate-950 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                Popular Right Now
              </div>
              <h2 className="section-title text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Featured Gear
              </h2>
            </div>
            <Link
              href="/shop/"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300"
            >
              <span>View Full Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={cardProduct(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trustpilot Real Reviews Feed (300 reviews Jan 2017 - Present) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Customer Feedback & Verification
          </div>
          <h2 className="section-title text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Rated 4.9/5 by Australian Creators & Crews
          </h2>
          <p className="text-sm text-slate-400">
            Real reviews from cinematographers, documentary crews, sound recordists, and rental houses across Australia from January 2017 to present.
          </p>
        </div>

        <TrustpilotReviewsList initialCount={4} showFilters={true} />
      </section>

      {/* 6. Authority Section: "About Theatricalz" */}
      <section className="bg-slate-900 border-y border-slate-800 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Who We Are
            </div>
            <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-tight">
              About Theatricalz
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {BRAND.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-2xl font-black text-amber-400 font-mono">2016</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Established in Melbourne VIC</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-2xl font-black text-amber-400 font-mono">15,000+</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Australian creators outfitted</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-2xl font-black text-amber-400 font-mono">100%</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Genuine Australian Warranty</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-2xl font-black text-amber-400 font-mono">4.9 / 5</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Trustpilot average</div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about/"
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300"
              >
                <span>Read Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                <span>Why Shop With Theatricalz</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                {BRAND.differentiation.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300 flex items-start gap-3">
              <PhoneCall className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">
                  Talk To Our Melbourne Team
                </strong>
                <span>
                  Our team at 3 Kirks Lane, Melbourne VIC 3000 can help with stock, compatibility and quotes. Call{' '}
                  <strong className="text-amber-400">{CONTACT.phoneDisplay}</strong> or message us on WhatsApp.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pay in 4 Equipment Financing Banner */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PAY IN 4 · INTEREST-FREE</span>
            </div>
            <h2 className="section-title text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Split Bigger Purchases Into 4 Payments
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Get the gear you need now and spread the cost of products from $400 AUD across 4 equal fortnightly payments with 0% interest.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              href="/financing/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase transition shadow-lg text-center"
            >
              Calculate Repayments
            </Link>
            <Link
              href="/contact/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition border border-slate-700 text-center"
            >
              Ask Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions (with Schema) */}
      <section className="bg-slate-950 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Got Questions?
            </div>
            <h2 className="section-title text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Quick answers on genuine stock, delivery, payment options and returns.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 hover:border-slate-700 transition"
              >
                <h3 className="text-base font-bold text-white flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 pl-7 leading-relaxed font-sans">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/faq/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline"
            >
              <span>See all help &amp; FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
