// config/site.js - Single Source of Truth for Theatricalz (WebForge v11.1)

export const SITE = {
  name: 'Theatricalz',
  tagline: 'Pro Camera, Audio & Music Gear Australia',
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
  payInFourMin: 400, // Pay in 4 is offered only on products priced from this amount (AUD inc. GST); cheaper items are one-time purchases
  paymentMethods: [
    'crypto-BTC',
    'crypto-USDT',
    'crypto-USDC',
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
  headerTagline: 'Pro Camera, Audio & Music Gear · 3 Kirks Lane, Melbourne VIC',
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
      id: 'crypto-USDC',
      label: 'Cryptocurrency (USDC) — 10% Off',
      opening: 'Thank you for choosing USDC. Your 10% discount has been applied to order {ref}. Total payable: {amount}.',
      closing: 'Please send {amount} in USDC to the address below and upload your payment screenshot.',
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
      label: 'PayID',
      opening: 'Please make a PayID payment of {amount} for order {ref}.',
      closing: 'Please use your order reference {ref} as the payment reference and reply to confirm once paid.',
    },
    {
      id: 'bank-transfer',
      label: 'Bank Transfer (OSKO)',
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
  description: 'Melbourne supplier of genuine Australian-stock cameras, audio, lighting, music gear and more. Prices in AUD inc. GST, free StarTrack Express over $500.',
  milestones: [
    { year: '2016', event: 'Theatricalz established at 3 Kirks Lane in Melbourne to support Victoria’s growing film and commercial production industry.' },
    { year: '2018', event: 'Appointed authorized pro distribution partner for cinema camera systems and broadcast optical packages.' },
    { year: '2020', event: 'Expanded nationwide express logistics hub delivering same-day & overnight insured equipment across Australia.' },
    { year: '2022', event: 'Introduced direct crypto settlement and PayID payments for commercial and indie film crews.' },
    { year: '2024', event: 'Crossed 15,000+ productions outfitted with gear and achieved 4.9/5 Trustpilot buyer satisfaction.' },
  ],
  differentiation: [
    '100% genuine Australian stock with official local manufacturer warranties',
    'Free insured StarTrack Express shipping on orders over $500',
    'Over 13,000 products from cinema cameras to guitars, shipped from our Melbourne warehouse',
    '10% off when you pay with cryptocurrency (BTC, USDT, ETH, SOL, BNB)',
    'Pay in 4 interest-free instalments on products from $400 AUD',
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
    image: '/images/products/prop-money/100-us-dollar-prop-money-stack.webp',
    subcategories: ['Australian Dollar (AUD)', 'US Dollar (USD)', 'Euro (EUR)', 'British Pound (GBP)', 'Japanese Yen (JPY)', 'Canadian Dollar (CAD)', 'Hong Kong Dollar (HKD)', 'Korean Won (KRW)', 'Russian Ruble (RUB)', 'Singapore Dollar (SGD)', 'Zimbabwe Dollar (ZWL)'],
  },
  {
    slug: 'audio-visual',
    name: 'Audio Visual',
    description: 'Broadcast converters, fibre and NDI links, switchers, routers, PA systems, conferencing, projectors and test gear for venues, studios and installs.',
    image: '/images/categories/audio-visual.webp',
    subcategories: ['Fibre, IP & NDI', 'Converters & Mini Converters', 'Switchers, Routers & Matrix', 'Distribution & Multiviewers', 'Capture, Recording & Streaming', 'Video Conferencing & Cameras', 'PA Speakers & Amplifiers', 'Audio Interfaces & Processing', 'Projectors & Digital Signage', 'Test, Measurement & Monitoring', 'Storage & Archiving', 'Carts, Stands & Mounts', 'Rackmount, Power & Accessories'],
  },
  {
    slug: 'cables-connectors',
    name: 'Cables & Connectors',
    description: 'Pro HDMI, SDI, XLR, USB-C and power cables, adapters and connectors for cameras, audio rigs and broadcast systems.',
    image: '/images/categories/cables-connectors.webp',
    subcategories: ['Video Cables', 'Audio Cables', 'Power & Data Cables', 'Adapters & Connectors'],
  },
  {
    slug: 'cases-bags',
    name: 'Cases & Bags',
    description: 'Hard cases, wheeled cases, camera backpacks and soft bags that protect cinema, photo and audio gear on set and in transit.',
    image: '/images/categories/cases-bags.webp',
    subcategories: ['Hard Cases', 'Wheeled Cases', 'Camera Backpacks', 'Shoulder & Sling Bags'],
  },
  {
    slug: 'computers',
    name: 'Computers',
    description: 'Editing workstations, NVMe storage, RAID arrays, card readers and colour grading panels for post-production workflows.',
    image: '/images/categories/computers.webp',
    subcategories: ['Storage & RAID', 'Card Readers & Media', 'Editing Panels', 'Monitors & Calibration', 'Computer Monitors', 'Laptops & Notebooks'],
  },
  {
    slug: 'lighting-studio',
    name: 'Lighting & Studio',
    description: 'LED monolights, panel lights, modifiers, light stands and studio grip for film sets, photo studios and content creators.',
    image: '/images/categories/lighting-studio.webp',
    subcategories: ['LED Monolights', 'Panel & Tube Lights', 'Modifiers & Softboxes', 'Stands & Grip'],
  },
  {
    slug: 'mobile',
    name: 'Mobile',
    description: 'Smartphone gimbals, mobile microphones, phone rigs, lenses and accessories for shooting pro-quality content on mobile.',
    image: '/images/categories/mobile.webp',
    subcategories: ['Smartphone Gimbals', 'Mobile Microphones', 'Phone Rigs & Mounts', 'Mobile Lenses'],
  },
  {
    slug: 'music-audio',
    name: 'Music & Audio',
    description: 'Shotgun and studio microphones, wireless systems, field recorders, mixers, audio interfaces and monitoring headphones.',
    image: '/images/categories/music-audio.webp',
    subcategories: ['Studio Condenser & Ribbon Mics', 'Dynamic & Vocal Mics', 'Instrument & Drum Mics', 'USB & Broadcast Mics', 'Shotgun, Camera & Lavalier Mics', 'Wireless Systems', 'Audio Interfaces', 'Studio Headphones', 'Studio Monitors & Subwoofers', 'Recorders & Mixers', 'Preamps & Outboard', 'Stands, Mounts & Acoustic Treatment', 'Studio Furniture & Accessories'],
  },
  {
    slug: 'guitars-basses',
    name: 'Guitars & Basses',
    description: 'Acoustic, acoustic-electric, classical, electric and bass guitars, plus ukuleles, cases, strings and accessories from leading makers.',
    image: '/images/categories/guitars-basses.webp',
    subcategories: ['Acoustic Guitars', 'Acoustic-Electric Guitars', 'Classical & Nylon Guitars', 'Travel & Mini Guitars', 'Electric Guitars', 'Bass Guitars', 'Ukuleles, Mandolins & Banjos', 'Guitar Cases & Gig Bags', 'Strings & Guitar Accessories'],
  },
  {
    slug: 'amps-effects',
    name: 'Amps & Effects',
    description: 'Guitar and bass amplifiers, speaker cabinets, effects pedals, multi-effects, loopers, pedal power and amp accessories.',
    image: '/images/categories/amps-effects.webp',
    subcategories: ['Guitar Amp Combos', 'Guitar Amp Heads', 'Guitar Speaker Cabinets', 'Practice & Portable Amps', 'Bass Amplifiers', 'Bass Cabinets', 'Acoustic & Keyboard Amps', 'Overdrive Pedals', 'Distortion Pedals', 'Fuzz & Boost', 'Delay & Reverb', 'Modulation Pedals', 'Wah, Filter & Pitch', 'Compressors, EQ & Utility', 'Bass Effects', 'Multi-Effects & Amp Modellers', 'Loopers', 'Pedal Power, Boards & Cables', 'Amp Accessories & Load Boxes'],
  },
  {
    slug: 'drums-percussion',
    name: 'Drums & Percussion',
    description: 'Acoustic and electronic drum kits, snares, cymbals, drum heads, pedals, hardware, thrones, sticks and hand percussion.',
    image: '/images/categories/drums-percussion.webp',
    subcategories: ['Acoustic Drum Kits & Shells', 'Electronic Drum Kits', 'Electronic Percussion & Pads', 'Snare Drums', 'Crash Cymbals', 'Ride Cymbals', 'Hi-Hat Cymbals', 'Splash, China & FX Cymbals', 'Cymbal Packs', 'Drum Heads', 'Drum Pedals', 'Stands & Hardware', 'Drum Thrones', 'Drumsticks & Mallets', 'Hand & Orchestral Percussion', 'Drum Accessories & Cases'],
  },
  {
    slug: 'keys-synths',
    name: 'Keys & Synths',
    description: 'Digital and stage pianos, portable keyboards, synthesizers, Eurorack modules, grooveboxes, MIDI controllers and keyboard accessories.',
    image: '/images/categories/keys-synths.webp',
    subcategories: ['Pianos & Digital Pianos', 'Stage Pianos & Organs', 'Portable & Arranger Keyboards', 'Synthesizers', 'Eurorack & Modular', 'Drum Machines, Samplers & Grooveboxes', 'MIDI Controllers', 'Keyboard Stands, Benches & Pedals'],
  },
  {
    slug: 'brass-woodwind',
    name: 'Brass & Woodwind',
    description: 'Trumpets, trombones, horns, saxophones, clarinets and flutes, plus mouthpieces, mutes, cases, stands, care products and sheet music.',
    image: '/images/categories/brass-woodwind.webp',
    subcategories: ['Trumpets & Cornets', 'Trombones & Tubas', 'Flugelhorns & Euphoniums', 'French Horns', 'Saxophones', 'Clarinets, Oboes & Bassoons', 'Flutes & Piccolos', 'Recorders, Folk & Digital Wind', 'Mouthpieces', 'Mutes', 'Reeds, Care & Accessories', 'Instrument Cases & Gig Bags', 'Music & Instrument Stands', 'Woodwind Sheet Music', 'Brass & Ensemble Sheet Music'],
  },
  {
    slug: 'dj-live-sound',
    name: 'DJ & Live Sound',
    description: 'DJ controllers, mixers and turntables, PA speakers, column PA, live mixers and in-ear monitoring for performers, venues and events.',
    image: '/images/categories/dj-live-sound.webp',
    subcategories: ['DJ Controllers & Mixers', 'Turntables & Media Players', 'DJ Headphones & Accessories', 'PA Speakers & Subwoofers', 'Column & Portable PA', 'Live Mixers', 'In-Ear Monitoring', 'Live Sound Accessories'],
  },
  {
    slug: 'outdoor-optics',
    name: 'Outdoor & Optics',
    description: 'Binoculars, spotting scopes, rangefinders, torches and outdoor power for location scouting and field production.',
    image: '/images/categories/outdoor-optics.webp',
    subcategories: ['Binoculars', 'Spotting Scopes', 'Torches & Lighting', 'Multi-Tools', 'Outdoor Power'],
  },
  {
    slug: 'photography',
    name: 'Photography',
    description: 'Mirrorless camera bodies, lenses, filters, tripods and flashes for professional and enthusiast photographers.',
    image: '/images/categories/photography.webp',
    subcategories: ['Mirrorless Cameras', 'Lenses', 'Filters', 'Tripods & Flash', 'Camera Accessories'],
  },
  {
    slug: 'radio-security',
    name: 'Radio & Security',
    description: 'Two-way radios, crew comms, intercom headsets and security cameras for production crews, events and venues.',
    image: '/images/categories/radio-security.webp',
    subcategories: ['Two-Way Radios', 'Crew Intercom', 'Headsets & Accessories', 'Security Cameras'],
  },
  {
    slug: 'streaming-podcasting',
    name: 'Streaming & Podcasting',
    description: 'Podcast microphones, boom arms, streaming encoders, capture cards and webcams for live streams and studio podcasts.',
    image: '/images/categories/streaming-podcasting.webp',
    subcategories: ['Podcast Microphones', 'Boom Arms & Mounts', 'Capture & Encoding', 'Webcams & Streaming Kits'],
  },
  {
    slug: 'video',
    name: 'Video',
    description: 'Cinema cameras, camcorders, monitors, wireless video, gimbals, tripods and rigging for film, broadcast and content production.',
    image: '/images/categories/video.webp',
    subcategories: ['Cinema Cameras', 'Cinema Lenses', 'Monitors & Recorders', 'Gimbals & Tripods', 'Rigs & Wireless Video', 'Camera Cages & Plates', 'Filters & Matte Boxes', 'Monitor Mounts & Accessories', 'Timecode, Audio & Sync', 'Batteries & Power', 'Drones & Accessories', 'Action & 360 Cameras'],
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
    question: 'Is everything you sell genuine Australian stock?',
    answer: 'Yes. Every product is 100% genuine Australian stock, supplied with the official local manufacturer warranty and the guarantees you are entitled to under the Australian Consumer Law.',
  },
  {
    question: 'What does Theatricalz sell?',
    answer: 'Cameras, lenses, monitors, gimbals and rigging for film and video; photography and studio lighting; microphones, interfaces and streaming gear; guitars, amps, drums, keys and DJ equipment; audio visual and install products; computers, mobile accessories, cables, cases, optics, radio and security gear; and clearly marked prop money for productions.',
  },
  {
    question: 'Are your prices in Australian dollars and do they include GST?',
    answer: 'Yes. All prices are quoted in AUD and include 10% Australian GST. The price you see on the product page is the price you pay for the item, before any shipping that applies to orders under $500.',
  },
  {
    question: 'How much does delivery cost and how long does it take?',
    answer: 'Orders over $500 AUD delivered within Australia ship free by StarTrack Express with transit insurance. Melbourne, Sydney and Brisbane metro addresses typically receive orders within 1–2 business days, and regional or interstate deliveries generally arrive in 2–4 business days. Our shipping policy has the full details.',
  },
  {
    question: 'Do you ship to New Zealand and overseas?',
    answer: 'Yes. We ship from our Melbourne warehouse to customers in Australia, New Zealand and the rest of the world. Australia is our main market, followed by New Zealand. For orders outside Australia, contact us and we will confirm shipping cost and delivery time before you pay.',
  },
  {
    question: 'How do I pay after I place an order?',
    answer: 'We email you payment details and your order reference once your order is in. You can pay by bank transfer (OSKO), PayID or cryptocurrency (BTC, USDT, ETH, BNB or SOL). Please quote your order reference (for example TH-XXXXXX) so we can match your payment quickly.',
  },
  {
    question: 'How does the 10% cryptocurrency discount work?',
    answer: 'Choose Crypto (BTC, USDT, ETH, BNB or SOL) as your payment method at checkout and 10% is deducted from your order subtotal. We then send you the wallet details and instructions to complete your payment.',
  },
  {
    question: 'Can I pay in instalments?',
    answer: 'Yes. Products priced from $400 AUD can be split into 4 equal fortnightly payments with Pay in 4, with 0% interest. Products under $400 AUD are a one-time purchase.',
  },
  {
    question: 'What does "Price on request" mean?',
    answer: 'Price on request products have no fixed online price, so use the Get a Quote button and we will reply with a price in AUD including GST.',
  },
  {
    question: 'Can I return something I have bought?',
    answer: 'Eligible products can be returned within 30 days if they are unopened, brand new and in their original factory-sealed packaging. Any product that is not eligible for return will be noted. If an item arrives defective or damaged in transit, contact us straight away and we will arrange a replacement under warranty. Your rights under the Australian Consumer Law are not affected.',
  },
  {
    question: 'Is your prop money real currency?',
    answer: 'No. Prop notes are clearly marked as props and are not legal tender. They are sold for film, TV, stage and photography use only and must never be spent or passed off as real money.',
  },
  {
    question: 'Can you help me choose gear or check compatibility?',
    answer: 'Yes. Call 0489 989 442, message us on WhatsApp or send an enquiry from our contact page with the model you own, and we will help you check mounts, connectors and compatibility before you buy.',
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
