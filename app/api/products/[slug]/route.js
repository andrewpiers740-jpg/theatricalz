// app/api/products/[slug]/route.js - Single product detail endpoint
import { SITE } from '@/config/site';
import { PRODUCTS } from '@/config/products';

export async function GET(request, { params }) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }

  return Response.json(
    {
      ...product,
      currency: SITE.currency,
      url: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    }
  );
}
