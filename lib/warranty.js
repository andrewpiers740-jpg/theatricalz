// lib/warranty.js - manufacturer warranty information, keyed by brand.
//
// Only terms read from the manufacturer's own Australian warranty pages are listed here.
// A brand with no entry (or no matching rule) shows the generic notice, never a guessed period.
//
// Entry shape:
//   name    : brand display name
//   issuer  : who gives the warranty (optional)
//   url     : official warranty page
//   checked : date the page was last read
//   default : { period, note } shown when no rule matches (omit if the brand has no single default)
//   linkLabel / regionNote : optional label for the official link, and a note shown when no period is known
//   rules   : [{ category?: [..], name?: RegExp, exclude?: RegExp, period, note, url? }] - first match wins

const CHECKED = '2026-10-23';

// Accessories and consumables are not assumed to carry the same warranty as the main product.
const DRONE_ACCESSORY = /\b(battery|propellers?|charger|filter|lens|guard|hub|controller|remote|goggles|case|bag|strap|stand|cable|adapter|mount|bracket)\b/i;
const DRUM_ACCESSORY = /\b(bag|backpack|case|stand|felts?|sleeves?|towel|keyring|pack of|holder|throne|stool)\b/i;
const ACCESSORY = /\b(bag|case|strap|strings?|stand|cable|pick|capo|tuner|cover|polish|cloth|stool|bench|adapter|power supply|headphones?|mount|bracket)\b/i;

export const WARRANTIES = {
  roland: {
    name: 'Roland',
    issuer: 'Roland Corporation Australia Pty Ltd',
    url: 'https://www.roland.com/au/warranty-terms/',
    checked: CHECKED,
    rules: [
      {
        name: /^Roland\s+((HP|LX|GP|KF)[-\s]?\d|Kiyola)/i,
        period: '10 years',
        note: 'Premium digital pianos (HP, LX, Kiyola and GP series) bought from an authorised Australian dealer on or after 1 July 2025.',
        url: 'https://www.roland.com/au/ck_warranty/',
      },
      {
        name: /^Roland\s+(FP|RP|F)[-\s]?\d/i,
        period: '5 years',
        note: 'Home digital pianos (F, FP and RP series) bought from an authorised Australian dealer on or after 1 July 2025.',
        url: 'https://www.roland.com/au/five_ck_warranty',
      },
      {
        name: /cable/i,
        period: 'Lifetime',
        note: 'Roland and BOSS cables carry a lifetime manufacturer’s warranty.',
      },
    ],
    default: {
      period: '2 years (3 years on professional A/V equipment)',
      note: 'Standard manufacturer’s warranty on Roland products bought from an authorised Australian dealer on or after 1 July 2025. Roland professional A/V equipment has 3 years, and Roland digital pianos have longer cover.',
    },
  },
  boss: {
    name: 'BOSS',
    issuer: 'Roland Corporation Australia Pty Ltd',
    url: 'https://www.roland.com/au/warranty-terms/',
    checked: CHECKED,
    rules: [
      {
        name: /cable/i,
        period: 'Lifetime',
        note: 'Roland and BOSS cables carry a lifetime manufacturer’s warranty.',
      },
    ],
    default: {
      period: '2 years (5 years on compact effects pedals)',
      note: 'BOSS Compact Effects Pedals carry a 5-year manufacturer’s warranty. All other BOSS products carry 2 years. Applies to products bought from an authorised Australian dealer on or after 1 July 2025.',
    },
  },
  rode: {
    name: 'RØDE',
    issuer: 'Freedman Electronics Pty Ltd, trading as RØDE Microphones',
    url: 'https://rode.com/en-au/support/warranty-terms',
    checked: CHECKED,
    rules: [
      {
        name: /\b(M1|NTH-100|Classic II)\b/i,
        period: 'Lifetime when registered online',
        note: 'The RØDE M1, NTH-100 and Classic II (Limited Edition) can be extended to the lifetime of the product when the original purchaser registers online at warranty.rode.com.',
      },
    ],
    default: {
      period: '1 year, extendable on selected products',
      note: 'RØDE warrants products bought from authorised dealers for 1 year. On selected products the warranty can be extended to 2, 5 or 10 years when the original purchaser registers online at warranty.rode.com; the length shown in the portal at purchase applies.',
    },
  },
  sennheiser: {
    name: 'Sennheiser',
    issuer: 'Sennheiser Australia',
    url: 'https://support.sennheiser-hearing.com/hc/en-au/articles/34888653392285-Detailed-Warranty-information',
    checked: CHECKED,
    default: {
      period: '24 months',
      note: 'Professional and studio products carry a 24-month warranty. Most consumer products are also 24 months, with a short list of consumer models at 12 months. Warranty applies to new products bought from an authorised Australian dealer.',
    },
  },
  yamaha: {
    name: 'Yamaha',
    issuer: 'Yamaha Music Australia',
    url: 'https://au.yamaha.com/en/support/warranty/',
    checked: CHECKED,
    rules: [
      {
        category: ['guitars-basses'],
        exclude: ACCESSORY,
        period: '5 years',
        note: 'Yamaha guitars, bought from an authorised Australian Yamaha dealer. Normal wear, strings and frets are excluded.',
        url: 'https://au.yamaha.com/en/support/warranty/guitars',
      },
      {
        category: ['keys-synths'],
        exclude: ACCESSORY,
        period: '5 years',
        note: 'Yamaha digital pianos, keyboards and synthesizers bought from an authorised Australian Yamaha dealer. Freight and handling costs are excluded.',
        url: 'https://au.yamaha.com/en/support/warranty/keyboards/',
      },
      {
        category: ['brass-woodwind'],
        exclude: ACCESSORY,
        period: '3 years (some products 1 year)',
        note: 'Yamaha brass, woodwind and orchestral percussion carry 3 years, and brass and woodwind can be extended to 5 years when registered. Resin recorders, Venova and digital instruments carry 1 year.',
        url: 'https://au.yamaha.com/en/support/warranty/band-orchestral/',
      },
      {
        name: /\bLine ?6\b/i,
        period: '1 year',
        note: 'LINE 6 amplifiers, effects, wireless and accessories, serviced by Authorised LINE 6 Service Centres.',
        url: 'https://au.yamaha.com/en/support/warranty/line6/',
      },
    ],
  },
  zildjian: {
    name: 'Zildjian',
    url: 'https://zildjian.com/pages/warranty',
    checked: CHECKED,
    rules: [
      {
        name: /\b(ALCHEM-E)\b/i,
        exclude: /cymbal/i,
        period: '1 year on parts',
        note: 'Electronic drum kits and ALCHEM-E headphones carry 1 year on parts under normal use. Labour on electronic kits is covered for 90 days.',
      },
      {
        name: /\b(sticks?|mallets?)\b/i,
        exclude: DRUM_ACCESSORY,
        period: 'Not covered',
        note: 'Zildjian does not provide a warranty on drumsticks and mallets.',
      },
      {
        name: /cymbal|hi[- ]?hat|\bride\b|\bcrash\b|\bsplash\b|\bchina\b|\bstack\b/i,
        exclude: DRUM_ACCESSORY,
        period: '2 years',
        note: 'Zildjian cymbals are covered for 2 years from the date of purchase against manufacturing flaws, when bought from an authorised Zildjian dealer. Second-hand cymbals and cymbals used for rental, backline or studio use are not covered. Outside the United States, claims go through the dealer where the cymbal was bought.',
      },
    ],
  },
  dji: {
    name: 'DJI',
    url: 'https://www.dji.com/service/policy',
    checked: CHECKED,
    rules: [
      {
        name: /^DJI (Mini|Mavic|Air \d|Avata|Neo|Flip)/i,
        exclude: DRONE_ACCESSORY,
        stripParens: true,
        period: '12 months on main components',
        note: 'DJI lists 12 months on the main components of most consumer drones. Propellers have no warranty and batteries have shorter conditions. Warranty service is available in the DJI service region where the product was bought, and proof of purchase is required. See DJI\u2019s policy table for your model.',
      },
    ],
    regionNote: 'DJI sets the warranty period for each product and part. Check DJI\u2019s after-sales policy table for this model.',
    linkLabel: 'DJI after-sales warranty policy',
  },
  sony: {
    name: 'Sony',
    url: 'https://www.sony.com.au/support/resources/en_AU/html/Warranty/Consumer_Product_Warranty.html',
    checked: CHECKED,
    regionNote: 'Sony Australia sets different warranty periods for different product types. See Sony\u2019s Australian warranty terms for the period that applies to this model.',
    linkLabel: 'Sony Australia warranty terms',
  },
  sabian: {
    name: 'SABIAN',
    url: 'https://sabian.com/warranty/',
    checked: CHECKED,
    regionNote: 'SABIAN warranties apply only in the country of purchase, and terms outside North America are set locally. Contact us for the Australian terms before you order.',
    linkLabel: 'SABIAN warranty information',
  },
  electroharmonix: {
    name: 'Electro-Harmonix',
    url: 'https://www.ehx.com/support/',
    checked: CHECKED,
    regionNote: 'Electro-Harmonix publishes its warranty terms on its support page, and terms can vary by country. Contact us for the Australian terms before you order.',
    linkLabel: 'Electro-Harmonix support & warranty',
  },
  ibanez: {
    name: 'Ibanez',
    url: 'https://www.ibanez.com/usa/support/warranty_terms_and_conditions/',
    checked: CHECKED,
    regionNote: 'Ibanez warranty terms differ by country and Australian terms are set by the local distributor. The linked page shows Ibanez\u2019s US terms for reference only. Contact us for the Australian terms before you order.',
    linkLabel: 'Ibanez warranty terms (US page, for reference)',
  },
  smallrig: {
    name: 'SmallRig',
    url: 'https://smallrig.com/contentpage/after-sales-policy.html',
    checked: CHECKED,
    regionNote: 'SmallRig sets warranty terms by product type and refers to its separate warranty policy for details. Contact us for the terms that apply to this model before you order.',
    linkLabel: 'SmallRig after-sales policy',
  },
  blackmagicdesign: {
    name: 'Blackmagic Design',
    url: 'https://www.blackmagicdesign.com/au/support',
    checked: CHECKED,
    regionNote: 'Blackmagic Design lists the warranty for each product in its technical specifications. Contact us for the terms that apply to this model before you order.',
    linkLabel: 'Blackmagic Design support',
  },
  audiotechnica: {
    name: 'Audio-Technica',
    issuer: 'Audio-Technica Australia',
    url: 'https://www.audio-technica.com/en-au/support/australian-warranty',
    checked: CHECKED,
    default: {
      period: '5 years on analogue wired microphones, 3 years on certain wireless and ceiling-array products, 1 year on everything else',
      note: 'Audio-Technica\u2019s Australian limited warranty depends on the product type. Proof of purchase from an authorised Audio-Technica dealer is required for any claim. Check the Australian warranty page for the tier that applies to this model.',
    },
  },
  manfrotto: {
    name: 'Manfrotto',
    issuer: 'Manfrotto (Videndum)',
    url: 'https://www.manfrotto.com/au-en/customer-service/warranty-terms-%26-conditions/',
    checked: CHECKED,
    default: {
      period: '2 years, extendable by registering online',
      note: 'Manfrotto\u2019s Australian standard limited warranty is 2 years from the date of purchase. Registering the product online can extend it by up to 8 more years (up to 10 years in total), depending on the model.',
    },
  },
  sigma: {
    name: 'Sigma',
    url: 'https://www.sigma-global.com/en/support/warranty/',
    checked: CHECKED,
    default: {
      period: '1 year',
      note: 'Sigma\u2019s limited warranty for the Australian region is 1 year, and applies to products imported into the region by an authorised Sigma importer. Sigma\u2019s longer warranty on its US site applies to US purchases only.',
    },
  },
  paiste: {
    name: 'Paiste',
    url: 'https://www.paiste.com/en/support/requests/warranty',
    checked: CHECKED,
    default: {
      period: '2 years',
      note: 'Paiste gives a 2-year limited warranty against defects in material or workmanship from the original retail purchase. A dated sales receipt is required. Damage from abuse or neglect, playing a cracked cymbal, or unauthorised repairs is not covered.',
    },
  },
  korg: {
    name: 'Korg',
    url: 'https://www.korg.com/us/support/contact/',
    checked: CHECKED,
    regionNote: 'Korg warranty terms are set by the local distributor in each country. Contact us for the Australian terms for this model before you order.',
    linkLabel: 'Korg support & distributor contacts',
  },
  tama: {
    name: 'TAMA',
    url: 'https://www.tama.com/usa/support/warranty_terms_and_conditions/',
    checked: CHECKED,
    regionNote: 'TAMA publishes warranty terms by region. The linked page shows TAMA\u2019s US terms for reference only. Contact us for the Australian terms for this model before you order.',
    linkLabel: 'TAMA warranty terms (US page, for reference)',
  },
  remo: {
    name: 'Remo',
    url: 'https://support.remo.com/hc/en-us/articles/207214063-Product-Warranty',
    checked: CHECKED,
    regionNote: 'Remo reviews warranty claims case by case, and outside the US claims go through the authorised dealer where the product was bought. Contact us before you order if you need the terms for this model.',
    linkLabel: 'Remo product warranty information',
  },
  pearldrums: {
    name: 'Pearl',
    url: 'https://pearldrum.com/en/support',
    checked: CHECKED,
    regionNote: 'Pearl\u2019s warranty varies by country and by product. Choose Australia on Pearl\u2019s support page, or contact us for the terms for this model before you order.',
    linkLabel: 'Pearl support & warranty information',
  },
  blackstar: {
    name: 'Blackstar',
    url: 'https://blackstaramps.com/uk-warranty-policy/',
    checked: CHECKED,
    regionNote: 'Blackstar warranty terms differ by region. The linked page shows Blackstar\u2019s UK policy for reference only. Contact us for the Australian terms for this model before you order.',
    linkLabel: 'Blackstar warranty policy (UK page, for reference)',
  },
  aja: {
    name: 'AJA',
    url: 'https://www.aja.com/products',
    checked: CHECKED,
    regionNote: 'AJA lists the warranty period on each product\u2019s page, and it differs by product. Contact us for the terms that apply to this model before you order.',
    linkLabel: 'AJA product pages',
  },
};

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const KEY_ALIASES = {
  rode: 'rode',
  'rde': 'rode',
};

export function getWarranty(product) {
  if (!product) return null;
  const key = KEY_ALIASES[norm(product.brand)] || norm(product.brand);
  const entry = WARRANTIES[key];
  if (!entry) return null;

  const rules = entry.rules || [];
  for (const r of rules) {
    const catOk = !r.category || r.category.includes(product.category);
    const nameOk = !r.name || r.name.test(product.name || '');
    // stripParens: judge accessories by the main product name only, so "Fly More Combo (Single Battery)" is still a drone
    const exName = r.stripParens ? String(product.name || '').replace(/\([^)]*\)/g, '') : product.name || '';
    const notExcluded = !r.exclude || !r.exclude.test(exName);
    if (catOk && nameOk && notExcluded) {
      return { brand: entry.name, issuer: entry.issuer, period: r.period, note: r.note, url: r.url || entry.url, checked: entry.checked };
    }
  }
  if (entry.default) {
    return { brand: entry.name, issuer: entry.issuer, period: entry.default.period, note: entry.default.note, url: entry.url, checked: entry.checked };
  }
  return { brand: entry.name, issuer: entry.issuer, period: null, note: null, regionNote: entry.regionNote || null, url: entry.url, linkLabel: entry.linkLabel || null, checked: entry.checked };
}
