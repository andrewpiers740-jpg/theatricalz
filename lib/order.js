// lib/order.js - Payment details parser, currency formatting, and terms builder
import { REPLY } from '@/config/site';

const UNAMBIGUOUS_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateOrderRef(prefix = REPLY.orderPrefix || 'TH') {
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += UNAMBIGUOUS_CHARS.charAt(Math.floor(Math.random() * UNAMBIGUOUS_CHARS.length));
  }
  return `${prefix}-${result}`;
}

export function money(amount) {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const locale = REPLY?.currency?.locale || 'en-AU';
  const symbol = REPLY?.currency?.symbol || '$';

  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  return `${symbol}${formattedNumber}`;
}

const KNOWN_LABELS = [
  'bsb',
  'account number',
  'account no',
  'account name',
  'acc no',
  'acc name',
  'bank',
  'sort code',
  'iban',
  'swift',
  'bic',
  'payid',
  'wallet address',
  'wallet',
  'btc address',
  'eth address',
  'usdt address',
  'network',
  'chain',
  'memo',
  'tag',
  'reference',
  'ref',
  'amount',
];

export function parsePaymentDetail(text) {
  if (!text || typeof text !== 'string') return [];

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const fields = [];
  let genericCount = 0;

  for (const line of lines) {
    // Rule 1: "Label: value" with a colon
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && colonIdx < line.length - 1) {
      const label = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      if (label && value) {
        fields.push({ label, value });
        continue;
      }
    }

    // Rule 2: No colon, but starts with known label
    const lowerLine = line.toLowerCase();
    let matchedLabel = null;
    for (const kl of KNOWN_LABELS) {
      if (lowerLine.startsWith(kl + ' ') || lowerLine.startsWith(kl + '\t')) {
        matchedLabel = kl;
        break;
      }
    }

    if (matchedLabel) {
      const label = line.slice(0, matchedLabel.length).trim();
      const value = line.slice(matchedLabel.length).trim();
      if (value) {
        // Capitalize first letter of label
        const prettyLabel = label.charAt(0).toUpperCase() + label.slice(1);
        fields.push({ label: prettyLabel, value });
        continue;
      }
    }

    // Rule 3: No colon, no known label - entire line is a copyable field
    genericCount++;
    const label = genericCount === 1 ? 'Detail' : `Detail ${genericCount}`;
    fields.push({ label, value: line });
  }

  return fields;
}

export function findMethod(methodId) {
  const methods = REPLY.paymentMethods || [];
  return methods.find((m) => m.id === methodId) || null;
}

export function paymentMethodParts(methodId, amountStr, ref) {
  const method = findMethod(methodId);
  const defaultOpening = `Please complete your payment of ${amountStr} for order ${ref}.`;
  const defaultClosing = `Once payment is sent, please reply with your receipt or transaction hash to dispatch your order.`;

  if (!method) {
    return { opening: defaultOpening, closing: defaultClosing };
  }

  const opening = (method.opening || defaultOpening)
    .replace(/{amount}/g, amountStr)
    .replace(/{ref}/g, ref);

  const closing = (method.closing || defaultClosing)
    .replace(/{amount}/g, amountStr)
    .replace(/{ref}/g, ref);

  return { opening, closing };
}

export function paymentTermsLines(ref) {
  const lines = [
    'This order is confirmed once payment is received — it is not yet final.',
    `Use your order number — ${ref} — as the payment reference.`,
    REPLY.dispatchLine || 'Dispatched via insured express courier with tracking and signature required.',
    'Australian tax invoice with full 10% GST breakdown provided with every dispatch.',
  ];
  return lines;
}

export function paymentTermsHtml(ref) {
  const items = paymentTermsLines(ref)
    .map((line) => `<li style="margin-bottom: 6px; color: #374151; font-size: 13px; line-height: 1.5;">${line}</li>`)
    .join('');
  return `<ul style="margin: 0; padding-left: 20px;">${items}</ul>`;
}
