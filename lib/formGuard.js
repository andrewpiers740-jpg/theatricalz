// lib/formGuard.js - rate limiting and simple bot checks for public form routes.
// Uses Upstash Redis when configured (shared across serverless instances) and falls back to memory.
import { getRedisClient } from './redis';

const memory = new Map(); // key -> { count, resetAt }

function memoryHit(key, windowSec) {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    if (memory.size > 5000) {
      for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
    }
    return { count: 1, retryAfter: windowSec };
  }
  entry.count += 1;
  return { count: entry.count, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
}

// Counts one hit for `key` and reports whether it is still within `limit` per `windowSec`.
export async function rateLimit(key, limit, windowSec) {
  const redis = getRedisClient();
  const k = `rl:${key}`;
  if (redis) {
    try {
      const count = await redis.incr(k);
      if (count === 1) await redis.expire(k, windowSec);
      let ttl = windowSec;
      if (count > 1) {
        ttl = await redis.ttl(k);
        if (ttl < 0) {
          await redis.expire(k, windowSec); // never leave a counter without an expiry
          ttl = windowSec;
        }
      }
      return { ok: count <= limit, retryAfter: ttl };
    } catch (err) {
      console.warn('[formGuard] Redis rate limit error, using memory:', err && err.message);
    }
  }
  const { count, retryAfter } = memoryHit(k, windowSec);
  return { ok: count <= limit, retryAfter };
}

// Reads a counter without adding to it.
export async function peekCount(key) {
  const k = `rl:${key}`;
  const redis = getRedisClient();
  if (redis) {
    try {
      const count = Number((await redis.get(k)) || 0);
      const ttl = count ? await redis.ttl(k) : 0;
      return { count, retryAfter: ttl > 0 ? ttl : 0 };
    } catch (err) {
      console.warn('[formGuard] Redis peek error, using memory:', err && err.message);
    }
  }
  const entry = memory.get(k);
  if (!entry || entry.resetAt <= Date.now()) return { count: 0, retryAfter: 0 };
  return { count: entry.count, retryAfter: Math.max(1, Math.ceil((entry.resetAt - Date.now()) / 1000)) };
}

export async function clearCount(key) {
  const k = `rl:${key}`;
  memory.delete(k);
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.del(k);
    } catch (err) {
      console.warn('[formGuard] Redis clear error:', err && err.message);
    }
  }
}

export function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim().slice(0, 64);
  return (request.headers.get('x-real-ip') || 'unknown').slice(0, 64);
}

export function tooManyResponse(retryAfter) {
  return Response.json(
    { success: false, error: 'Too many requests. Please wait a few minutes and try again, or contact us by phone.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter || 60) } }
  );
}

const MIN_FILL_MS = 2000;

// Honeypot field filled in, or the form submitted faster than a person can. Missing timing data also fails,
// because the site's own forms always send it.
export function looksLikeBot(data) {
  if (!data || typeof data !== 'object') return { bot: true, silent: false };
  if (typeof data._hp === 'string' && data._hp.trim() !== '') return { bot: true, silent: true };
  const t = Number(data._t);
  if (!Number.isFinite(t)) return { bot: true, silent: false };
  const elapsed = Date.now() - t;
  if (elapsed < MIN_FILL_MS || elapsed < 0) return { bot: true, silent: false };
  return { bot: false, silent: false };
}

export async function emailKey(email) {
  const data = new TextEncoder().encode(String(email || '').toLowerCase());
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
}
