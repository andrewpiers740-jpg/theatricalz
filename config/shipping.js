// config/shipping.js - single source of truth for delivery estimates (product pages + /shipping/ policy).
// Business days are counted from dispatch out of our Melbourne warehouse. International times are estimates
// only: customs clearance, weather and courier delays are outside our control.

export const DISPATCH_NOTE = 'Orders placed before 2:00 PM AEST on business days are normally dispatched the same day.';

export const AU_RATES = [
  { region: 'Melbourne Metro', time: '1 business day (same-day courier available)' },
  { region: 'Sydney, Canberra & Brisbane Metro', time: '1 – 2 business days (StarTrack Overnight)' },
  { region: 'Adelaide & Hobart Metro', time: '1 – 2 business days' },
  { region: 'Perth & Darwin Metro', time: '2 – 3 business days' },
  { region: 'Regional & Remote Australia', time: '2 – 4 business days' },
];

export const INTL_RATES = [
  { region: 'New Zealand', time: '3 – 7 business days' },
  { region: 'Asia (selected countries)', time: '5 – 10 business days' },
  { region: 'Europe & United Kingdom', time: '7 – 14 business days' },
  { region: 'North & South America', time: '7 – 14 business days' },
  { region: 'Africa', time: '10 – 20 business days' },
];

// Destinations we cannot ship to from Australia (comprehensive sanctions / embargo or carrier restrictions).
export const RESTRICTED_DESTINATIONS = [
  'North Korea',
  'Iran',
  'Syria',
  'Cuba',
  'Russia',
  'Belarus',
  'Crimea, Donetsk and Luhansk regions',
];

export const INTL_NOTE =
  'International delivery times are estimates from dispatch, and we confirm the international shipping cost before you pay. Import duties, taxes and customs fees charged by the destination country are the buyer’s responsibility. Some products, such as drones, radios and lithium batteries, have export or carrier restrictions; we confirm any restriction before you pay.';
