// lib/adminAuth.js - Server-only passcode verification for Reply Portal.
// Wrong passcodes are counted per IP address: after 5 wrong attempts in 15 minutes that address is locked out for the
// rest of the 15 minutes, even if it then sends the right passcode. A correct passcode clears the counter.
import { rateLimit, peekCount, clearCount, clientIp } from '@/lib/formGuard';

const MAX_FAILS = 5;
const WINDOW_SEC = 15 * 60;

function json(body, status, extra = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...extra } });
}

// Compares every character, so the time taken does not reveal how much of a guess was right.
function safeEqual(a, b) {
  const x = String(a);
  const y = String(b);
  let diff = x.length ^ y.length;
  const len = Math.max(x.length, y.length);
  for (let i = 0; i < len; i++) diff |= (x.charCodeAt(i) || 0) ^ (y.charCodeAt(i) || 0);
  return diff === 0;
}

export async function checkAdminPasscode(request) {
  // Configured server-only passcode (never expose via NEXT_PUBLIC_*)
  const expected = process.env.ADMIN_PASSCODE || '';

  if (!expected) {
    return json({ error: 'ADMIN_PASSCODE is not configured on the server' }, 503);
  }

  const ip = clientIp(request);
  const key = `adm:fail:${ip}`;

  const state = await peekCount(key);
  if (state.count >= MAX_FAILS) {
    return json(
      { error: 'Too many incorrect passcodes. Please wait before trying again.' },
      429,
      { 'Retry-After': String(state.retryAfter || WINDOW_SEC) }
    );
  }

  const provided = request.headers.get('x-admin-passcode');

  if (!provided || !safeEqual(provided.trim(), expected.trim())) {
    const hit = await rateLimit(key, MAX_FAILS, WINDOW_SEC);
    console.warn(`[adminAuth] Wrong passcode from ${ip} (attempt in window: limit ${MAX_FAILS}, ok=${hit.ok})`);
    if (!hit.ok) {
      return json({ error: 'Too many incorrect passcodes. Please wait before trying again.' }, 429, { 'Retry-After': String(hit.retryAfter || WINDOW_SEC) });
    }
    return json({ error: 'Unauthorized. Invalid admin passcode.' }, 401);
  }

  if (state.count > 0) await clearCount(key);
  return null; // Authorization passed
}
