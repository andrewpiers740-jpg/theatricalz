// app/api/categories/route.js - Categories with counts API
import { guardApi } from '@/lib/apiGuard';
import { CATEGORIES, SITE } from '@/config/site';
import { PRODUCTS } from '@/config/products';

export async function GET(request) {
  const limited = await guardApi(request, 'categories');
  if (limited) return limited;
  const data = CATEGORIES.map((c) => {
    const prods = PRODUCTS.filter((p) => p.category === c.slug);
    return {
      slug: c.slug,
      name: c.name,
      description: c.description,
      image: c.image,
      productCount: prods.length,
      subcategories: c.subcategories || [],
      url: `https://${SITE.domain}/shop/${c.slug}/`,
    };
  });

  return Response.json(
    {
      categories: data,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    }
  );
}
