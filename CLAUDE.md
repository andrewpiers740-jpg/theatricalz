# Theatricalz — project instructions

React/Next.js App Router pro cinema, photo, video, and audio gear ecommerce site, Vercel target.

## Non-negotiable: Compliance & Australian Standards
- All prices quoted in AUD including 10% Australian GST.
- 100% Genuine Australian Stock with official local manufacturer warranties.
- No invented statistics, awards, or false partner claims; preserve verified Australian facts.
- ABN: 28 614 589 481, ACN: 614 589 481 (Theatricalz Australia Pty Ltd, Melbourne VIC).
- If a request would require breaking the above, stop and say so rather than complying.

## Review Rule (client instruction — non-negotiable)
- All review data supplied in the client's files (`lib/reviews.js`, product `rating` / `reviewsCount`,
  Trustpilot stats, review components and the AggregateRating/Review schema built from them) is client-provided.
- Never remove, rewrite, regenerate or "clean up" it, even during audits or SEO/compliance fixes.
- Audits may note risks about it; changes happen only when the user explicitly asks.

## Architecture
`config/site.js` is the single source of truth. Adding one entry to PRODUCTS / CATEGORIES / POSTS
generates the page, route, meta, JSON-LD, sitemap entry, and nav links. Never hand-write pages.
Never hand-edit generated files (llms.txt, .well-known/*, vercel.json) — edit the config and run `npm run gen`.

## Rules
- `npm run build && npm run crosscheck` must pass before every push.
- One <h1> per page. Meta descriptions ~150 chars. Titles ≤60 chars.
- Emails entity-encoded (&#64;) everywhere in public HTML and JSON-LD.
- Never commit node_modules/, .next/, or tracked secrets to Git.
- Framework Preset on Vercel must be "Next.js".
- Reply Portal enabled at `/admin` (passcode-gated).
- Public token payment page at `/order/payment-details/` with CopyField click-to-copy.
- Thank-you order page (`/thank-you-order/`) shows ONLY "watch for payment-details email" — NO bank details.

## Live Placeholders & Secrets
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (+ optional `SMTP_FROM`): SMTP transport for orders and enquiries.
- `ADMIN_PASSCODE`: Server-only secret for `/admin` hub (never expose in client bundle or NEXT_PUBLIC_*).
- `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: Optional Upstash KV order/enquiry persistent storage.

## Brand Facts (Real only — verified)
- Founded: 2016 in Melbourne VIC (3 Kirks Lane, Melbourne VIC 3000)
- Australian Business Number (ABN): 28 614 589 481 · ACN: 614 589 481
- Phone: +61 489 989 442 (0489 989 442) · WhatsApp: 61489989442
- Over 15,000 Australian creators and productions outfitted
- Reviews: 300 Trustpilot verified Australian buyer reviews with 4.9 average score
