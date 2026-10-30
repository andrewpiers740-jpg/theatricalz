// lib/apiGuard.js - per-visitor rate limit for the public, read-only API routes (MCP, ACP, UCP, products, categories).
// Returns a 429 Response when the limit is hit, otherwise null. Cross-origin agents may call these routes, so the
// 429 carries the same open CORS header as the normal responses.
import { rateLimit, clientIp } from '@/lib/formGuard';

export async function guardApi(request, name, limit = 60, windowSec = 60) {
  const hit = await rateLimit(`api:${name}:${clientIp(request)}`, limit, windowSec);
  if (hit.ok) return null;
  return Response.json(
    { error: 'rate_limited', message: 'Too many requests. Please slow down and try again shortly.' },
    { status: 429, headers: { 'Retry-After': String(hit.retryAfter || 60), 'Access-Control-Allow-Origin': '*' } }
  );
}
