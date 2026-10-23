// app/api/crypto-rate/route.js - live AUD prices for the crypto checkout quote.
// Server-side proxy with a short in-memory cache so the browser never calls the price API directly
// and the upstream rate limit is respected. Only the tokens listed in config/wallets.js are requested.
import { WALLETS } from '@/config/wallets';

export const dynamic = 'force-dynamic';

const TTL_MS = 30 * 1000;
let cache = { at: 0, rates: null };

async function fetchRates() {
  const ids = Object.values(WALLETS).map((t) => t.coingeckoId).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=aud`;
  const res = await fetch(url, { headers: { accept: 'application/json' }, cache: 'no-store' });
  if (!res.ok) throw new Error(`price API responded ${res.status}`);
  const data = await res.json();
  const rates = {};
  for (const [symbol, t] of Object.entries(WALLETS)) {
    const aud = data?.[t.coingeckoId]?.aud;
    if (typeof aud === 'number' && aud > 0) rates[symbol] = aud;
  }
  if (!Object.keys(rates).length) throw new Error('no rates returned');
  return rates;
}

export async function GET() {
  const now = Date.now();
  if (cache.rates && now - cache.at < TTL_MS) {
    return Response.json({ success: true, rates: cache.rates, updatedAt: new Date(cache.at).toISOString(), source: 'CoinGecko' });
  }
  try {
    const rates = await fetchRates();
    cache = { at: now, rates };
    return Response.json({ success: true, rates, updatedAt: new Date(now).toISOString(), source: 'CoinGecko' });
  } catch (err) {
    // Serve the last good quote for up to 5 minutes if the price API is briefly unavailable.
    if (cache.rates && now - cache.at < 5 * 60 * 1000) {
      return Response.json({ success: true, rates: cache.rates, updatedAt: new Date(cache.at).toISOString(), source: 'CoinGecko', stale: true });
    }
    console.error('[crypto-rate]', err.message);
    return Response.json({ success: false, error: 'Live rate unavailable' }, { status: 502 });
  }
}
