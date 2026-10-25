import Link from 'next/link';
import { fitDescription } from '@/lib/seoText';
import { notFound } from 'next/navigation';
import { ChevronRight, Film, Tag } from 'lucide-react';
import { SITE, CATEGORIES } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import ProductCard from '@/components/ProductCard';
import { cardProduct } from '@/lib/cardProduct';
import { subSlug } from '@/lib/subcategory';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category: catSlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === catSlug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} — Buy in Australia`,
    description: fitDescription(category.description, 'Genuine Australian stock, AUD inc. GST.'),
    alternates: {
      canonical: `https://${SITE.domain}/shop/${category.slug}/`,
    },
    other: {
      'og:updated_time': new Date().toISOString(),
    },
  };
}

export default async function CategoryPage({ params }) {
  const { category: catSlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === catSlug);

  if (!category) {
    notFound();
  }

  const categoryProducts = PRODUCTS.filter((p) => p.category === category.slug);

  const grouped = categoryProducts.some((p) => p.subcategory) && Array.isArray(category.subcategories);

  // Large categories show a lighter preview per range; the full range lives on its own paginated page.
  const PREVIEW = (category.subcategories || []).length > 8 ? 4 : 8;

  const breadcrumbSchema = {
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
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/shop/" className="hover:text-amber-400 transition">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-medium">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="pb-6 border-b border-slate-800 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Australian Warehouse Stock
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {category.description}
          </p>

          {/* Subcategories tags */}
          {category.subcategories && (
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <span className="text-xs text-slate-500 font-semibold mr-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Ranges:</span>
              </span>
              {category.subcategories.map((sub, idx) => (
                grouped ? (
                  <a
                    key={idx}
                    href={`/shop/${category.slug}/${subSlug(sub)}/`}
                    className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium hover:border-amber-500/60 hover:text-white transition"
                  >
                    {sub}
                  </a>
                ) : (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium"
                >
                  {sub}
                </span>
                )
              ))}
            </div>
          )}
        </div>

        {/* Product Grid — grouped by subcategory when products carry one */}
        {grouped ? (
          category.subcategories
            .filter((sub) => categoryProducts.some((p) => p.subcategory === sub))
            .map((sub) => (
              <section key={sub} id={subSlug(sub)} className="space-y-4 scroll-mt-28">
                <h2 className="section-title text-lg sm:text-xl font-black text-white uppercase tracking-tight">{sub}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryProducts.filter((p) => p.subcategory === sub).slice(0, PREVIEW).map((product) => (
                    <ProductCard key={product.slug} product={cardProduct(product)} />
                  ))}
                </div>
                {categoryProducts.filter((p) => p.subcategory === sub).length > PREVIEW && (
                  <Link
                    href={`/shop/${category.slug}/${subSlug(sub)}/`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300"
                  >
                    View all {categoryProducts.filter((p) => p.subcategory === sub).length} {sub} products →
                  </Link>
                )}
              </section>
            ))
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.slug} product={cardProduct(product)} />
          ))}
        </div>
        )}
      </div>
    </>
  );
}
