// lib/orderToken.js - unguessable access tokens for customer-facing order links.
// A reference like TH-ABC123 is short and appears in emails, so on its own it must never unlock an order.

export function newAccessToken() {
  const bytes = new Uint8Array(24); // 192 bits
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64url');
}

// Orders created before tokens existed (no stored token) can still be opened with just their reference, so links already
// emailed keep working. Every new order has a token, and an old order gets one the next time the team emails it.
export function accessAllowed(order, token) {
  if (!order) return false;
  if (!order.accessToken) return true;
  return tokenMatches(order, token);
}

// Constant-time comparison of a stored token with the one in the link.
export function tokenMatches(order, token) {
  const expected = order && typeof order.accessToken === 'string' ? order.accessToken : '';
  const given = typeof token === 'string' ? token : '';
  if (!expected || expected.length !== given.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}
