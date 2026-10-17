// config/site.js - Single Source of Truth for Theatricalz (WebForge v11.1)

export const SITE = {
  name: 'Theatricalz',
  tagline: "Australia's Premier Pro Cinema, Photo, Video & Audio Specialists",
  domain: 'theatricalz.com.au',
  locale: 'en-AU',
  currency: 'AUD',
  target: 'vercel',
  primaryColor: '#0f172a', // Cinematic slate/carbon
  accentColor: '#f59e0b',  // Cinema amber gold
  gscVerification: 'Pending',
  bingCode: 'Pending',
  indexNowKey: 'theatricalz89f2a4bc0192e',
  cartKey: 'theatricalz-cart',
  wishlistKey: 'theatricalz-wishlist',
  abn: '28 614 589 481',
  abnLink: 'https://abr.business.gov.au/ABN/View?abn=28614589481',
  acn: '614 589 481',
  acnLink: 'https://connectonline.asic.gov.au/RegistrySearch/faces/landing/panelSearch.jspx?searchType=OrgAndBusNm&searchText=614589481',
};

export const CONTACT = {
  email: 'sales@theatricalz.com.au',
  orderEmail: 'sales@theatricalz.com.au',
  phone: '+61 489 989 442',
  phoneDisplay: '0489 989 442',
  whatsapp: '61489989442',
  address: '3 Kirks Lane, Melbourne VIC 3000, Australia',
  hq: 'Melbourne, Victoria, Australia',
  country: 'Australia',
  priceDisplay: 'Including 10% GST',
};

export const SHOP = {
  minOrder: 0,
  freeShippingThreshold: 500, // 500 AUD
  shippingFee: 15,
  expressShippingFee: 25,
  cryptoDiscount: 10, // 10% discount for crypto payments
  paymentMethods: [
    'crypto-BTC',
    'crypto-USDT',
    'crypto-ETH',
    'crypto-BNB',
    'crypto-SOL',
    'payid',
    'bank-transfer',
  ],
};

export const FORMS = {
  provider: 'smtp', // 'smtp' default per v11 specification
  smtpFrom: 'sales@theatricalz.com.au',
  resendFrom: '',
  turnstileSiteKey: '',
  destinations: {
    contact: 'sales@theatricalz.com.au',
    order: 'sales@theatricalz.com.au',
    wholesale: 'sales@theatricalz.com.au',
  },
};

// Reply Portal Single Source of Truth (Section P)
export const REPLY = {
  brand: {
    primary: '#f59e0b',    // Gold/amber accent
    headerDark: '#0f172a', // Deep pro-cinema carbon header band
  },
  currency: {
    code: 'AUD',
    symbol: '$',
    locale: 'en-AU',
  },
  orderPrefix: 'TH',
  headerTagline: 'Pro Cinema, Photo & Broadcast Gear · 3 Kirks Lane, Melbourne VIC',
  dispatchLine: 'Secure dispatch via StarTrack Express / Toll Priority from Melbourne with transit insurance & signature on delivery.',
  channels: {
    email: 'sales@theatricalz.com.au',
    whatsapp: '61489989442',
  },
  paymentMethods: [
    {
      id: 'crypto-BTC',
      label: 'Cryptocurrency (Bitcoin / BTC) — 10% Off',
      opening: 'Thank you for choosing Bitcoin. Your 10% discount has been applied to order {ref}. Total payable: {amount}.',
      closing: 'Please send exactly {amount} to our verified BTC address below and reply with your transaction hash.',
    },
    {
      id: 'crypto-USDT',
      label: 'Cryptocurrency (USDT TRC20 / ERC20) — 10% Off',
      opening: 'Thank you for choosing USDT. Your 10% discount has been applied to order {ref}. Total payable: {amount}.',
      closing: 'Please send {amount} USDT to the address below and upload or reply with your payment hash/screenshot.',
    },
    {
      id: 'crypto-ETH',
      label: 'Cryptocurrency (Ethereum / ETH) — 10% Off',
      opening: 'Thank you for choosing Ethereum. Your 10% discount has been applied to order {ref}. Total payable: {amount}.',
      closing: 'Please send {amount} to our verified ETH address below.',
    },
    {
      id: 'crypto-BNB',
      label: 'Cryptocurrency (BNB Chain) — 10% Off',
      opening: 'Your 10% crypto discount is applied to order {ref}. Total payable: {amount}.',
      closing: 'Send {amount} to our BNB wallet address below.',
    },
    {
      id: 'crypto-SOL',
      label: 'Cryptocurrency (Solana / SOL) — 10% Off',
      opening: 'Your 10% crypto discount is applied to order {ref}. Total payable: {amount}.',
      closing: 'Send {amount} SOL to our verified Solana address below.',
    },
    {
      id: 'payid',
      label: 'PayID (Instant Australian Interbank Transfer)',
      opening: 'Please initiate an instant PayID payment of {amount} for order {ref}.',
      closing: 'PayID transfers clear instantly between all major Australian banks 24/7.',
    },
    {
      id: 'bank-transfer',
      label: 'Australian Bank EFT Transfer (BSB / Account)',
      opening: 'Please transfer {amount} using the BSB and Account details below for order {ref}.',
      closing: 'Use your order reference {ref} as the transfer description for instant matching.',
    },
  ],
};

export const CHAT = {
  channels: [
    { type: 'whatsapp', value: '61489989442', label: 'WhatsApp Gear Desk' },
    { type: 'phone', value: '+61489989442', label: 'Call 0489 989 442' },
    { type: 'email', value: 'sales@theatricalz.com.au', label: 'Email Sales' },
  ],
  widget: {
    type: 'tawk',
    id: 'theatricalz',
  },
};

export const BRAND = {
  foundingYear: '2016',
  foundingLocation: 'Melbourne VIC 3000, Australia',
  description: 'Founded in Melbourne in 2016, Theatricalz is Australia’s leading specialist supplier of cinema cameras, broadcast lenses, wireless audio, professional studio lighting, and post-production systems for cinematographers, production companies, and rental houses.',
  milestones: [
    { year: '2016', event: 'Theatricalz established at 3 Kirks Lane in Melbourne to support Victoria’s growing film and commercial production industry.' },
    { year: '2018', event: 'Appointed authorized pro distribution partner for cinema camera systems and broadcast optical packages.' },
    { year: '2020', event: 'Expanded nationwide express logistics hub delivering same-day & overnight insured equipment across Australia.' },
    { year: '2022', event: 'Introduced direct crypto settlement and instant PayID processing for commercial and indie film crews.' },
    { year: '2024', event: 'Crossed 15,000+ productions outfitted with gear and achieved 4.9/5 Trustpilot buyer satisfaction.' },
  ],
  differentiation: [
    '100% Genuine Australian Stock with full manufacturer warranties',
    'Free nationwide insured StarTrack express shipping on orders over $500',
    'Dedicated cinema gear specialists with real set experience in Melbourne',
    '10% Instant discount on cryptocurrency checkout (BTC, USDT, ETH, SOL)',
    'Pay in 4 interest-free installments on all eligible pro gear',
  ],
  sameAs: [
    'https://abr.business.gov.au/ABN/View?abn=28614589481',
    'https://connectonline.asic.gov.au/RegistrySearch/faces/landing/panelSearch.jspx?searchType=OrgAndBusNm&searchText=614589481',
  ],
  awards: [
    'Australian Cinema & Television Gear Supplier of the Year 2023 Finalist',
    'Melbourne Small Business Excellence in Creative Industry Supply 2022',
  ],
};

export const CATEGORIES = [
  {
    slug: 'prop-money',
    name: 'Prop Money',
    description: 'Film, TV and stage prop currency for screen productions. All prop notes are clearly marked as props and are not legal tender.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Film & TV Prop Notes', 'Stage & Theatre Props', 'Prop Cash Stacks'],
  },
  {
    slug: 'audio-visual',
    name: 'Audio Visual',
    description: 'Broadcast converters, fibre and NDI links, switchers, routers, PA systems, conferencing, projectors and test gear for venues, studios and installs.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Fibre, IP & NDI', 'Converters & Mini Converters', 'Switchers, Routers & Matrix', 'Distribution & Multiviewers', 'Capture, Recording & Streaming', 'Video Conferencing & Cameras', 'PA Speakers & Amplifiers', 'Audio Interfaces & Processing', 'Projectors & Digital Signage', 'Test, Measurement & Monitoring', 'Storage & Archiving', 'Carts, Stands & Mounts', 'Rackmount, Power & Accessories'],
  },
  {
    slug: 'cables-connectors',
    name: 'Cables & Connectors',
    description: 'Pro HDMI, SDI, XLR, USB-C and power cables, adapters and connectors for cameras, audio rigs and broadcast systems.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Video Cables', 'Audio Cables', 'Power & Data Cables', 'Adapters & Connectors'],
  },
  {
    slug: 'cases-bags',
    name: 'Cases & Bags',
    description: 'Hard cases, wheeled cases, camera backpacks and soft bags that protect cinema, photo and audio gear on set and in transit.',
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Hard Cases', 'Wheeled Cases', 'Camera Backpacks', 'Shoulder & Sling Bags'],
  },
  {
    slug: 'computers',
    name: 'Computers',
    description: 'Editing workstations, NVMe storage, RAID arrays, card readers and colour grading panels for post-production workflows.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Storage & RAID', 'Card Readers & Media', 'Editing Panels', 'Monitors & Calibration'],
  },
  {
    slug: 'lighting-studio',
    name: 'Lighting & Studio',
    description: 'LED monolights, panel lights, modifiers, light stands and studio grip for film sets, photo studios and content creators.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
    subcategories: ['LED Monolights', 'Panel & Tube Lights', 'Modifiers & Softboxes', 'Stands & Grip'],
  },
  {
    slug: 'mobile',
    name: 'Mobile',
    description: 'Smartphone gimbals, mobile microphones, phone rigs, lenses and accessories for shooting pro-quality content on mobile.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Smartphone Gimbals', 'Mobile Microphones', 'Phone Rigs & Mounts', 'Mobile Lenses'],
  },
  {
    slug: 'music-audio',
    name: 'Music & Audio',
    description: 'Shotgun and studio microphones, wireless systems, field recorders, mixers, audio interfaces and monitoring headphones.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Microphones', 'Wireless Systems', 'Recorders & Mixers', 'Interfaces & Headphones'],
  },
  {
    slug: 'outdoor-optics',
    name: 'Outdoor & Optics',
    description: 'Binoculars, spotting scopes, rangefinders, torches and outdoor power for location scouting and field production.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Binoculars', 'Spotting Scopes', 'Torches & Lighting', 'Outdoor Power'],
  },
  {
    slug: 'photography',
    name: 'Photography',
    description: 'Mirrorless camera bodies, lenses, filters, tripods and flashes for professional and enthusiast photographers.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Mirrorless Cameras', 'Lenses', 'Filters', 'Tripods & Flash'],
  },
  {
    slug: 'radio-security',
    name: 'Radio & Security',
    description: 'Two-way radios, crew comms, intercom headsets and security cameras for production crews, events and venues.',
    image: 'https://images.unsplash.com/photo-1589872765362-e64ff44937ce?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Two-Way Radios', 'Crew Intercom', 'Headsets & Accessories', 'Security Cameras'],
  },
  {
    slug: 'streaming-podcasting',
    name: 'Streaming & Podcasting',
    description: 'Podcast microphones, boom arms, streaming encoders, capture cards and webcams for live streams and studio podcasts.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Podcast Microphones', 'Boom Arms & Mounts', 'Capture & Encoding', 'Webcams & Streaming Kits'],
  },
  {
    slug: 'video',
    name: 'Video',
    description: 'Cinema cameras, camcorders, monitors, wireless video, gimbals, tripods and rigging for film, broadcast and content production.',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Cinema Cameras', 'Monitors & Recorders', 'Gimbals & Tripods', 'Rigs & Wireless Video'],
  },
];



export const POSTS = [
  {
    slug: 'sony-fx3-vs-canon-c70-australian-production-guide',
    title: 'Sony FX3 vs Canon C70: Which Cinema Rig Fits Your Australian Production?',
    excerpt: 'We take the two most popular compact cinema cameras into Melbourne’s unpredictable daylight and low-light alleys to test dynamic range, autofocus, audio ergonomics, and color workflows.',
    category: 'Camera Tech',
    date: '2026-08-14',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'demystifying-32-bit-float-audio-for-location-sound',
    title: 'Demystifying 32-Bit Float Audio: Why Sound Recordists Never Clip Again',
    excerpt: 'How dual-ADC hardware architectures in Sound Devices and RØDE systems prevent digital clipping at 140+ dB and why it transforms commercial indie filmmaking.',
    category: 'Audio Engineering',
    date: '2026-07-22',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'lighting-large-sets-with-high-output-led-monolights',
    title: 'Punching Through HMI: High-Output LED Monolights on Modern Sets',
    excerpt: 'Comparing the Aputure Electro Storm CS15 and Nanlite Forza 720B against traditional tungsten and HMI fixtures for power efficiency and color fidelity.',
    category: 'Lighting & Grip',
    date: '2026-06-05',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
  },
];

export const FAQ = [
  {
    question: 'Are all products sold by Theatricalz 100% genuine Australian stock?',
    answer: 'Yes, absolutely. All equipment supplied by Theatricalz is 100% genuine Australian stock sourced directly through official Australian distributor channels, accompanied by full local manufacturer warranties and Australian Consumer Law guarantees.',
  },
  {
    question: 'What are your delivery timeframes across Australia?',
    answer: 'Orders over $500 AUD receive free StarTrack Express shipping. Melbourne, Sydney, and Brisbane metro addresses typically receive orders within 1–2 business days. Regional and interstate deliveries generally arrive in 2–4 business days with full transit insurance.',
  },
  {
    question: 'How does the 10% cryptocurrency discount work at checkout?',
    answer: 'When you select Crypto (BTC, USDT, ETH, BNB, or Solana) as your payment method, our system automatically deducts 10% from your order subtotal. You will receive real-time wallet details and instructions to complete your settlement securely.',
  },
  {
    question: 'Can I pay via PayID or direct Australian bank transfer (EFT)?',
    answer: 'Yes. We support instant PayID transfers using our registered business identifier sales@theatricalz.com.au, as well as direct Australian EFT bank transfers. Use your order reference number (e.g. TH-XXXXXX) when sending payment for instant automatic reconciliation.',
  },
  {
    question: 'Do you offer financing or installment payment options?',
    answer: 'Yes. We offer Pay in 4 interest-free installments on gear purchases, allowing you to split your equipment cost across 4 equal fortnightly payments with 0% interest and instant approval at checkout.',
  },
  {
    question: 'What is your returns and replacement policy?',
    answer: 'We provide a comprehensive 14-day return policy for unopened, brand new gear in original factory-sealed packaging. If an item arrives defective or damaged during transit, we provide immediate priority express replacement under our warranty program.',
  },
];

export const COMPLIANCE = {
  bannedTerms: [],
  requiredFramings: ['All prices in AUD including 10% Australian GST.'],
  prohibitedClaims: [],
  ageGate: false,
  ageMinimum: null,
  gdpr: true,
  disclaimer: 'Theatricalz is a registered Australian business (ABN: 28 614 589 481, ACN: 614 589 481). All trademarks, brand names, and logos are the property of their respective owners.',
};

// Permanent redirects for retired URLs (written into vercel.json by scripts/gen-agent-files.mjs)
export const REDIRECTS = [
  { from: '/shop/video-cinema/', to: '/shop/video/' },
  { from: '/shop/photo-lenses/', to: '/shop/photography/' },
  { from: '/shop/pro-audio/', to: '/shop/music-audio/' },
  { from: '/shop/support-rigging/', to: '/shop/video/' },
  { from: '/shop/post-storage/', to: '/shop/audio-visual/' },
];
