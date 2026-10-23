# Project Strategy: Theatricalz (theatricalz.com.au)
WebForge v11.1 Pro Cinema & Audio Ecommerce Build

## Executive Summary
- **Client**: THEATRICALZ PTY LTD
- **Domain**: theatricalz.com.au
- **HQ**: 3 Kirks Lane, Melbourne VIC 3000, Australia
- **ABN**: 28 614 589 481 | **ACN**: 614 589 481
- **Focus**: Authorized Australian supply of digital cinema cameras, cine primes, location 32-bit float audio, high-output LED fixtures, and production camera support.
- **Target Audience**: Australian cinematographers, documentary directors, rental houses, wedding filmmakers, and creative agencies.

## Core Differentiators
1. 100% Genuine Australian Stock with authorized local distributor warranties (Sony Australia, Canon Australia, Sennheiser Australia, Blackmagic Design).
2. Free StarTrack Express courier delivery across Australia for all orders over $500 AUD with signature on delivery and transit insurance.
3. 10% Instant discount on cryptocurrency checkout (BTC, USDT, ETH, SOL, BNB).
4. Direct PayID interbank settlement without surcharge.
5. Pay in 4 interest-free equipment financing installments.
6. 4.9/5 Trustpilot buyer satisfaction rating across 300 verified customer reviews from Jan 2017 to present.

## Architecture
- **Framework**: Next.js 15 App Router (Vercel target, real API routes).
- **Reply Portal**: Passcode-gated `/admin` hub with live orders, enquiries, payment-details composer (`parsePaymentDetail`), and WhatsApp send panel.
- **Email System**: Light-shell branded HTML templates with `#0f172a` pro header band and `#f59e0b` amber accent via nodemailer lazy singleton.
- **Agent Layer**: Complete RFC 9727 API catalog, Agent Skills index, live MCP Streamable HTTP server, ACP catalog, and UCP 1.0 services.
