// app/sitemap-index/route.js - sitemap index, served at /sitemap.xml (see the rewrite in next.config.ts).
// Lists the split sitemaps built by app/sitemap.js.
import { SITE } from '@/config/site';
import { generateSitemaps } from '@/app/sitemap';

export const dynamic = 'force-static';

export async function GET() {
  const ids = await generateSitemaps();
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${ids
    .map(({ id }) => `  <sitemap><loc>https://${SITE.domain}/sitemap/${id}.xml</loc></sitemap>`)
    .join('\n')}\n</sitemapindex>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
