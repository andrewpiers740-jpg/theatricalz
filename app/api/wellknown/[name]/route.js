// app/api/wellknown/[name]/route.js - serves the extensionless /.well-known/* documents with the right Content-Type.
// next.config.ts rewrites /.well-known/<name> here. The documents come from lib/wellKnown.generated.json,
// which scripts/gen-agent-files.mjs builds from config/site.js.
import docs from '@/lib/wellKnown.generated.json';

export const dynamic = 'force-static';

const TYPES = {
  'api-catalog': 'application/linkset+json',
};

export function generateStaticParams() {
  return Object.keys(docs).map((name) => ({ name }));
}

export async function GET(_request, { params }) {
  const { name } = await params;
  const doc = docs[name];
  if (!doc) return new Response('Not found', { status: 404 });
  return new Response(JSON.stringify(doc, null, 2), {
    headers: {
      'Content-Type': `${TYPES[name] || 'application/json'}; charset=utf-8`,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
