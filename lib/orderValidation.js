// lib/orderValidation.js - server-side validation for orders and enquiries.
// The browser is never trusted for prices, totals, names of products or order status:
// items are looked up in the catalogue and every total is recalculated here.
import { PRODUCTS } from '@/config/products';
import { SHOP } from '@/config/site';
import { money } from '@/lib/order';

const MAX_ITEMS = 40;
const MAX_QTY = 99;
const REF_RE = /^TH-[A-HJ-NP-Z2-9]{6}$/;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^[0-9+()\-.\s]{6,30}$/;

let catalogue = null;
function getCatalogue() {
  if (!catalogue) {
    catalogue = new Map();
    for (const p of PRODUCTS) catalogue.set(p.slug, p);
  }
  return catalogue;
}

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

// Plain text only: drop control characters, collapse odd whitespace, trim, cap length.
export function cleanText(value, max) {
  if (value == null) return '';
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

export function isValidRef(ref) {
  return typeof ref === 'string' && REF_RE.test(ref);
}

function bad(error) {
  return { ok: false, error };
}

export function validateCustomer(raw) {
  const c = raw && typeof raw === 'object' ? raw : {};
  const customer = {
    name: cleanText(c.name, 100),
    email: cleanText(c.email, 254).toLowerCase(),
    phone: cleanText(c.phone, 30),
    address: cleanText(c.address, 200),
    city: cleanText(c.city, 80),
    state: cleanText(c.state, 30),
    postcode: cleanText(c.postcode, 12),
    notes: cleanText(c.notes, 1000),
  };
  if (!customer.name) return bad('Please enter your name.');
  if (!EMAIL_RE.test(customer.email)) return bad('Please enter a valid email address.');
  if (!PHONE_RE.test(customer.phone)) return bad('Please enter a valid phone number.');
  if (!customer.address) return bad('Please enter your delivery address.');
  return { ok: true, customer };
}

// Turns whatever the browser sent into a trusted order record.
// Returns { ok: true, order, customer } or { ok: false, error }.
export function buildServerOrder(data) {
  const input = data && typeof data === 'object' ? data : {};
  const rawOrder = input.order && typeof input.order === 'object' ? input.order : {};

  const customerResult = validateCustomer(input.customer);
  if (!customerResult.ok) return customerResult;

  const rawItems = Array.isArray(rawOrder.items) ? rawOrder.items : [];
  if (!rawItems.length) return bad('Your cart is empty.');
  if (rawItems.length > MAX_ITEMS) return bad('Too many different items in one order. Please contact us for a bulk quote.');

  const cat = getCatalogue();
  const merged = new Map();
  for (const raw of rawItems) {
    const slug = cleanText(raw && raw.slug, 200);
    const qty = Math.floor(Number(raw && raw.quantity));
    if (!slug || !Number.isFinite(qty) || qty < 1) return bad('One of the items in your cart is not valid.');
    merged.set(slug, Math.min(MAX_QTY, (merged.get(slug) || 0) + qty));
  }

  const items = [];
  for (const [slug, quantity] of merged) {
    const [baseSlug, stackPart] = slug.split('--');
    const product = cat.get(baseSlug);
    if (!product) return bad('An item in your cart is no longer available. Please remove it and try again.');

    let price = product.price;
    let name = product.name;
    let sku = product.sku || '';
    if (stackPart !== undefined) {
      const stacks = Number(stackPart);
      const variant = (product.variants || []).find((v) => Number(v.stacks) === stacks);
      if (!variant) return bad('An item in your cart is no longer available. Please remove it and try again.');
      price = variant.price;
      name = `${product.name} — ${variant.label}`;
      sku = `${product.sku || product.slug}-${variant.stacks}`;
    } else if (product.variants && product.variants.length) {
      // A variant product must be ordered with a chosen size.
      return bad('Please choose a size for that product and add it to the cart again.');
    }
    if (price == null || !(Number(price) > 0)) return bad('One item needs a quote. Please use the Get a Quote button instead.');

    items.push({
      slug,
      productSlug: product.slug,
      name,
      price: round2(price),
      category: product.category,
      image: (product.images && product.images[0]) || '',
      sku,
      quantity,
    });
  }

  const paymentMethod = cleanText(rawOrder.paymentMethod, 40);
  if (!SHOP.paymentMethods.includes(paymentMethod)) return bad('Please choose a payment method.');
  const isCrypto = paymentMethod.startsWith('crypto-');

  const subtotal = round2(items.reduce((s, it) => s + round2(it.price * it.quantity), 0));
  const discountAmount = isCrypto ? round2((subtotal * (SHOP.cryptoDiscount || 10)) / 100) : 0;
  const total = round2(subtotal - discountAmount);

  const channel = rawOrder.channel === 'whatsapp' || input.channel === 'whatsapp' ? 'whatsapp' : 'email';

  const order = {
    items,
    subtotal,
    discountAmount,
    total,
    totalFormatted: money(total),
    paymentMethod,
    channel,
    status: 'pending',
  };
  if (isCrypto) {
    const net = cleanText(rawOrder.cryptoNetwork, 60);
    if (net) order.cryptoNetwork = net;
  }

  return { ok: true, order, customer: customerResult.customer, requestedRef: cleanText(rawOrder.ref || rawOrder.id, 20).toUpperCase() };
}

export function validateEnquiry(data) {
  const d = data && typeof data === 'object' ? data : {};
  const formName = d.formName === 'wholesale' ? 'wholesale' : 'contact';
  const name = cleanText(d.name, 100);
  const email = cleanText(d.email, 254).toLowerCase();
  const message = cleanText(d.message, 5000);
  if (!name || !email || !message) return bad('Name, email, and message are required.');
  if (!EMAIL_RE.test(email)) return bad('Please enter a valid email address.');
  const phone = cleanText(d.phone, 40);
  if (phone && !PHONE_RE.test(phone)) return bad('Please enter a valid phone number.');
  const subject = cleanText(d.subject, 150) || (formName === 'wholesale' ? 'Wholesale Account Application' : 'Gear Advice & Quote');
  return { ok: true, enquiry: { name, email, phone, subject, message, formName } };
}
