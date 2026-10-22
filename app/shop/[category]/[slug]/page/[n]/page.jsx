import { notFound } from 'next/navigation';
import { SITE, CATEGORIES } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import SubcategoryListing from '@/components/SubcategoryListing';
import { subSlug, findSubcategory, PAGE_SIZE, rangePageHref } from '@/lib/subcategory';

// Page 2+ of a range, e.g. /shop/drums-percussion/crash-cymbals/page/2/
const rangeProducts = (catSlug, sub) => PRODUCTS.filter((p) => p.category === catSlug && p.subcategory === sub);

export async function generateStaticParams() {
  return CATEGORIES.flatMap((c) =>
    (c.subcategories || []).flatMap((sub) => {
      const pages = Math.ceil(rangeProducts(c.slug, sub).length / PAGE_SIZE);
      return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ category: c.slug, slug: subSlug(sub), n: String(i + 2) }));
    })
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { category: catSlug, slug, n } = await params;
  const category = CATEGORIES.find((c) => c.slug === catSlug);
  const sub = findSubcategory(category, slug);
  if (!sub) return { title: 'Not Found' };
  return {
    title: `${sub} — Page ${n}`,
    description: `Page ${n} of ${sub} in ${category.name} at Theatricalz. AUD pricing incl. GST, genuine Australian stock with local warranty.`.slice(0, 158),
    alternates: { canonical: `https://${SITE.domain}${rangePageHref(category.slug, sub, Number(n))}` },
  };
}

export default async function RangePage({ params }) {
  const { category: catSlug, slug, n } = await params;
  const category = CATEGORIES.find((c) => c.slug === catSlug);
  const sub = findSubcategory(category, slug);
  const page = Number(n);
  if (!sub || !Number.isInteger(page) || page < 2) notFound();
  const products = rangeProducts(category.slug, sub);
  if ((page - 1) * PAGE_SIZE >= products.length) notFound();
  return <SubcategoryListing category={category} sub={sub} products={products} page={page} />;
}
