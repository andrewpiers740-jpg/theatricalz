import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Coins,
  ChevronRight,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SITE, CATEGORIES, CONTACT, SHOP } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import { money } from '@/lib/order';
import { getProductReviews } from '@/lib/reviews';
import JsonLd from '@/components/JsonLd';
import ProductActionBox from './ProductActionBox';
import SubcategoryListing from '@/components/SubcategoryListing';
import { subSlug, findSubcategory } from '@/lib/subcategory';

// Bulk-imported catalogue pages are rendered on first request and then cached, keeping build times inside Vercel's limit.
export const dynamicParams = true;

export async function generateStaticParams() {
  const productParams = PRODUCTS.filter((p) => !p.imported).map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
  // Subcategory ("range") pages share this route, e.g. /shop/audio-visual/fibre-ip-ndi/
  const rangeParams = CATEGORIES.flatMap((c) =>
    (c.subcategories || [])
      .filter((sub) => PRODUCTS.some((p) => p.category === c.slug && p.subcategory === sub))
      .map((sub) => ({ category: c.slug, slug: subSlug(sub) }))
  );
  return [...productParams, ...rangeParams];
}

export async function generateMetadata({ params }) {
  const { category: catSlug, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    const category = CATEGORIES.find((c) => c.slug === catSlug);
    const sub = findSubcategory(category, slug);
    if (sub) {
      return {
        title: `${sub} — ${category.name}`,
        description: `Shop ${sub} in ${category.name} at Theatricalz. AUD pricing incl. GST, genuine Australian stock with local warranty, and quotes on request.`.slice(0, 158),
        alternates: { canonical: `https://${SITE.domain}/shop/${category.slug}/${slug}/` },
      };
    }
    return { title: 'Product Not Found' };
  }

  return {
    title: product.metaTitle || `${product.name} — Buy in Australia | Theatricalz`,
    description: product.metaDescription || product.description,
    alternates: {
      canonical: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
    },
    openGraph: {
      title: `${product.name} — Theatricalz Pro Cinema & Audio`,
      description: product.metaDescription || product.description,
      images: [{ url: product.images?.[0] || '' }],
    },
    other: {
      'og:updated_time': new Date().toISOString(),
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { category: catSlug, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  const category = CATEGORIES.find((c) => c.slug === catSlug);

  if (!product && category) {
    const sub = findSubcategory(category, slug);
    if (sub) {
      const rangeProducts = PRODUCTS.filter((p) => p.category === category.slug && p.subcategory === sub);
      return <SubcategoryListing category={category} sub={sub} products={rangeProducts} />;
    }
  }

  if (!product || !category) {
    notFound();
  }

  const hasRating = product.rating != null;
  const reviews = hasRating ? getProductReviews(product.slug, 6) : [];
  const price = product.price;
  const priceOnRequest = price == null;
  const cryptoPrice = priceOnRequest ? 0 : price * (1 - (SHOP.cryptoDiscount || 10) / 100);
  const payInFour = priceOnRequest ? 0 : price / 4;
  const stockLabel = product.stockShort || 'In Stock (Melb Warehouse)';
  const specialOrder = Boolean(product.stockShort);

  const productSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      sku: product.sku || product.slug,
      image: product.images,
      brand: {
        '@type': 'Brand',
        name: product.brand || 'Theatricalz',
      },
      offers: priceOnRequest ? undefined : {
        '@type': 'Offer',
        priceCurrency: SITE.currency,
        price: product.price,
        availability: specialOrder ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
        url: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'AU',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 14,
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: product.price >= SHOP.freeShippingThreshold ? 0 : SHOP.shippingFee,
            currency: SITE.currency,
          },
        },
      },
      aggregateRating: hasRating ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating || '4.9',
        reviewCount: product.reviewsCount || 28,
        bestRating: '5',
        worstRating: '1',
      } : undefined,
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
          name: 'Shop',
          item: `https://${SITE.domain}/shop/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `https://${SITE.domain}/shop/${category.slug}/`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.name,
          item: `https://${SITE.domain}/shop/${category.slug}/${product.slug}/`,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={productSchema} />

      <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/shop/" className="hover:text-amber-400 transition">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href={`/shop/${category.slug}/`} className="hover:text-amber-400 transition">{category.name}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero: Gallery + Action Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery Col */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative bg-white aspect-[4/3] rounded-3xl overflow-hidden p-8 flex items-center justify-center border border-slate-800 shadow-2xl">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-6"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-slate-400">No Image Available</div>
              )}

              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-lg bg-slate-950 text-amber-400 border border-amber-500/40 text-xs font-black uppercase tracking-wider shadow">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-xl bg-white p-2 border border-slate-700 relative overflow-hidden"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Trust Points Panel */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine AU Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>StarTrack Express Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-blue-400 shrink-0" />
                <span>14-Day Pro Return Window</span>
              </div>
            </div>
          </div>

          {/* Details & Buy Box */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {product.brand || 'Theatricalz'} · SKU: {product.sku || product.slug}
                </span>
                <span className={`flex items-center gap-1.5 text-xs font-semibold ${specialOrder ? 'text-amber-300' : 'text-emerald-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${specialOrder ? 'bg-amber-300' : 'bg-emerald-400 animate-pulse'}`}></span>
                  <span>{stockLabel}</span>
                </span>
              </div>

              {/* Exact Single H1 */}
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
              {hasRating && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-white">{product.rating || '4.9'}</span>
                <span className="text-xs text-slate-400 font-medium">
                  ({product.reviewsCount || 28} Trustpilot verified buyer ratings)
                </span>
              </div>
              )}
            </div>

            {/* Pricing Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              {priceOnRequest ? (
                <div>
                  <span className="text-2xl font-black text-white">Price on request</span>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Contact our gear desk for a current quote in AUD (inc. 10% GST) and lead time on this item.
                  </p>
                </div>
              ) : (
              <>
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-white font-mono">
                    {product.variants?.length ? <span className="text-sm font-semibold text-slate-400 mr-1">From</span> : null}
                    {money(price)} AUD
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-500 line-through font-mono">
                      {money(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-medium">(inc. 10% GST)</span>
                </div>

                {/* 10% Crypto Incentive */}
                <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Coins className="w-4 h-4 text-amber-400" />
                    Pay with Crypto (10% Off):
                  </span>
                  <span className="font-mono font-black text-sm text-white">
                    {money(cryptoPrice)} AUD
                  </span>
                </div>
              </div>

              {/* Pay in 4 Installments */}
              <div className="text-xs text-slate-300 pt-1 space-y-1">
                <div>
                  Or 4 fortnightly payments of <strong className="text-white font-mono">{money(payInFour)}</strong> interest-free with <Link href="/financing/" className="text-amber-400 hover:underline">Pay in 4</Link>.
                </div>
              </div>
              </>
              )}

              {/* Client Action Box (Cart + WhatsApp) */}
              <ProductActionBox product={product} />
            </div>

            {/* Fast Dispatch Note */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="text-white block font-semibold">
                  {specialOrder ? 'Special Order Item' : 'Same-Day Dispatch Guarantee'}
                </strong>
                <span>
                  {specialOrder
                    ? 'Ordered in from the Australian distributor. Contact our gear desk to confirm lead time before you order.'
                    : 'Order before 2:00 PM AEST for same-day dispatch via StarTrack Express with signature required.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-800">
          <div className="lg:col-span-7 space-y-6">
            {product.content ? (
              <div className="space-y-6">
                {product.content.map((section) => (
                  <section key={section.h2} className="space-y-3">
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">{section.h2}</h2>
                    {section.body && <p className="text-sm text-slate-300 leading-relaxed">{section.body}</p>}
                    {section.sub?.map((sub) => (
                      <div key={sub.h3} className="space-y-1.5">
                        <h3 className="text-base font-bold text-amber-400 tracking-tight">{sub.h3}</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">{sub.body}</p>
                      </div>
                    ))}
                  </section>
                ))}
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                  Product Overview & Architecture
                </h2>
                <div className="text-sm text-slate-300 leading-relaxed space-y-4">
                  <p>{product.description}</p>
                  <p>
                    Engineered specifically for demanding on-set cinema workflows, documentary location sound, and broadcast live studio installations. Built to withstand rigours of Australian field production from Melbourne studios to remote outback shooting environments.
                  </p>
                </div>
              </>
            )}

            {/* Technical Specifications Table */}
            {product.specs && (
              <div className="space-y-3 pt-4">
                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                  Technical Specifications
                </h3>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
                  {Object.entries(product.specs).map(([label, val]) => (
                    <div key={label} className="grid grid-cols-3 p-3.5 text-xs">
                      <span className="font-semibold text-slate-400">{label}</span>
                      <span className="col-span-2 text-white font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Australian Warranty & Support Desk Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Australian Warranty & Support</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Full official Australian manufacturer warranty with local repair centers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Australian Consumer Law (ACL) consumer guarantees apply to all purchases.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Complimentary technical setup assistance via Melbourne gear desk.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-800">
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Speak with Gear Tech: {CONTACT.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews for this Product */}
        {hasRating && (
        <div className="pt-10 border-t border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Verified Customer Feedback
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Reviews for {product.name}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              <strong className="text-white">{product.rating} / 5.0</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{rev.author}</span>
                    <span className="text-[11px] text-slate-500">{rev.date}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer · {rev.location}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                    ))}
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">&ldquo;{rev.title}&rdquo;</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </>
  );
}
