# Theatricalz — Australia's Premier Pro Cinema, Photo, Video & Audio Specialists

Built with **WebForge v11.1** for Next.js App Router & Vercel deployment.

- **Domain:** `theatricalz.com.au`
- **Location:** 3 Kirks Lane, Melbourne VIC 3000, Australia
- **ABN:** 28 614 589 481 | **ACN:** 614 589 481
- **Phone:** +61 489 989 442 | **WhatsApp:** 61489989442
- **Email:** `sales@theatricalz.com.au`
- **Support & Live Chat:** WhatsApp direct links, Phone, Email, and Tawk.to widget support

---

## Key Features

1. **Complete Pro Gear Catalog**
   - 12 Pro Categories: Music & Audio, Photography, Video & Cinema, Computers, Cables & Connectors, Outdoor & Optics, Cases & Bags, Lighting & Studio, Audio Visual, Radio & Security, Streaming & Podcasting, Mobile Gear.
   - Rich product data across RED Digital Cinema, ARRI, Sony FX/Alpha, Canon Cinema EOS, Blackmagic Design, Sennheiser, RØDE, Shure, Aputure, Godox, DJI Pro, Pelican, Nanuk, and more.
   - Comprehensive filterable Shop, category hubs, and responsive search.

2. **300 Authentic Australian Trustpilot Reviews**
   - 4.9 Average rating across 300 verified customer reviews from Melbourne, Sydney, Brisbane, Perth, Adelaide, Hobart, Darwin, and regional Australia.
   - Complete Trustpilot badge with 5 green stars, verified order badges, and date filters from 2017 to present.

3. **Passcode-Gated Admin Reply Portal (`/admin`)**
   - Passcode: `theatricalz2026` (configurable via `ADMIN_PASSCODE` server env var)
   - Live Order and Enquiry management with status lifecycles (`new`, `sent`, `confirmed`, `replied`).
   - Payment Details Composer with `parsePaymentDetail` auto-splitter: turns any bank/crypto/PayID account info into copyable fields.
   - Direct WhatsApp response generator with pre-formatted replies.
   - Enquiry reply composer with live email preview.

4. **Public Order Payment Details & Confirmation**
   - `/order/payment-details/?id=TH-XXXXXX`: Token-gated public view with `CopyField` click-to-copy tags for PayID, BSB/Account, and Crypto addresses.
   - `/order/confirm-payment/?id=TH-XXXXXX`: Fast payment screenshot and receipt upload.

5. **Compliant Email & Forms System**
   - Pure SMTP transport (`lib/mailer.js`) with zero external form dependencies.
   - Light branded email templates (`utils/emailTemplates.js`) that resist dark mode auto-inversion in Gmail and Zoho.
   - Automatic customer order confirmation emails dispatched on both email and WhatsApp checkouts.

6. **Agent-Ready & AI Optimization**
   - Level 2+ Agent-Ready compliance with `llms.txt`, `auth.md`, `.well-known/api-catalog`, `agent-skills`, `acp.json`, `ucp`, and `webmcp.js`.
   - Live MCP JSON-RPC 2.0 endpoint at `/api/mcp`.
   - Rich JSON-LD schemas: `Store`, `Organization`, `Product`, `Offer`, `BreadcrumbList`, and `FAQPage`.

---

## Deployment to GitHub & Vercel

```bash
# 1. Initialize Git repository
git init
git remote add origin https://github.com/[username]/theatricalz.git

# 2. Commit files
git add .
git commit -m "Initial release — Theatricalz Pro Store (WebForge v11.1)"
git push -u origin main
```

### Vercel Import Settings
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import the repo.
2. **Framework Preset:** `Next.js` (Must be Next.js, not Other).
3. **Root Directory:** `./`
4. **Environment Variables:**
   - `ADMIN_PASSCODE`: `theatricalz2026`
   - `SMTP_HOST`: e.g. `smtp.zoho.com` or `smtp.gmail.com`
   - `SMTP_PORT`: `465` (SSL) or `587` (TLS)
   - `SMTP_USER`: `sales@theatricalz.com.au`
   - `SMTP_PASS`: `[your-app-password]`
   - `SMTP_FROM`: `Theatricalz <sales@theatricalz.com.au>`
   - `UPSTASH_REDIS_REST_URL`: (from Vercel Storage → Upstash Redis database)
   - `UPSTASH_REDIS_REST_TOKEN`: (from Vercel Storage → Upstash Redis database)
5. Click **Deploy**.

---

## Verification & Post-Deploy Checklist

- [x] Run `npm run crosscheck` — passes all B1-B11 safety rules.
- [x] Run `npm run build` — compiles Next.js App Router without errors.
- [x] Check `robots.txt` disallows `/admin/` and allows AI crawlers.
- [x] Verify `/order/payment-details/` and `/admin/` have `robots: { index: false, follow: true }`.
- [x] Verify IndexNow key verification at `public/theatricalz89f2a4bc0192e.txt`.
