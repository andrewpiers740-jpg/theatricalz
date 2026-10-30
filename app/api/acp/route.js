// app/api/acp/route.js - ACP index: points to the live endpoints under /api/acp/
import { guardApi } from '@/lib/apiGuard';
import { SITE } from '@/config/site';

export async function GET(request) {
  const limited = await guardApi(request, 'acp');
  if (limited) return limited;
  return Response.json(
    {
      protocol: { name: 'acp', version: '0.1.0' },
      site: SITE.name,
      endpoints: {
        catalog: `https://${SITE.domain}/api/acp/catalog/`,
        manifest: `https://${SITE.domain}/.well-known/acp.json`,
      },
      ordering: 'human-assisted',
    },
    { headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' } }
  );
}
