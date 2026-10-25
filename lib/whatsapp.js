// lib/whatsapp.js - WhatsApp message links and formatting
import { SITE, CONTACT } from '@/config/site';

export const WA_HEADER = `*${SITE.name}*`;

export function waGreeting() {
  return `Hi ${SITE.name},`;
}

export function toWhatsAppNumber(phone) {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}

// Admin -> Customer link
export function waLinkTo(phone, body) {
  const cleanPhone = toWhatsAppNumber(phone);
  const text = `${WA_HEADER}\n\n${body}`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

// Admin copy text
export function waMessageText(body) {
  return `${WA_HEADER}\n\n${body}`;
}

// Customer -> Business link (opens with Hi Theatricalz,)
export function waLink(body) {
  const businessNumber = toWhatsAppNumber(CONTACT.whatsapp || '61489989442');
  const greeting = waGreeting();
  const fullText = body ? `${greeting}\n\n${body}` : `${greeting} `;
  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(fullText)}`;
}

// Itemised customer checkout link
export function waOrderLink(order, customer) {
  const itemsText = (order.items || [])
    .map((item) => `• ${item.name || item.title} (x${item.quantity}) - $${((item.price || 0) * (item.quantity || 1)).toFixed(2)} AUD`)
    .join('\n');

  const lines = [
    `I would like to place an order for cinema/audio gear:`,
    ``,
    `*Order Ref:* ${order.ref || order.id}`,
    `*Total:* ${order.totalFormatted || `$${order.total} AUD`}`,
    `*Payment Method:* ${order.paymentMethod || 'PayID / Bank Transfer / Crypto'}`,
    ``,
    `*Items:*`,
    itemsText || 'None',
    ``,
    `*Delivery Details:*`,
    `Name: ${customer.name}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}, ${customer.city || ''} ${customer.state || ''} ${customer.postcode || ''}, ${customer.country || 'Australia'}`,
    customer.notes ? `Notes: ${customer.notes}` : '',
  ].filter(Boolean);

  return waLink(lines.join('\n'));
}

export function waPaymentConfirmationLink(ref) {
  const body = `I have sent the payment for order reference: *${ref}*. Please find my receipt attached for verification and dispatch.`;
  return waLink(body);
}

export function waPaymentDetailsMessage(opts) {
  const { ref, amountStr, methodLabel, opening, fields = [], closing, paymentPageUrl } = opts;
  const fieldsText = fields.map((f) => `*${f.label}:* ${f.value}`).join('\n');

  const text = [
    `Payment Details for Order: *${ref}*`,
    `Amount Due: *${amountStr}*`,
    `Method: *${methodLabel}*`,
    ``,
    opening,
    ``,
    fieldsText,
    ``,
    closing,
    ``,
    `Tap below to view and one-click copy details:`,
    paymentPageUrl,
    ``,
    `Dispatched via insured express from Melbourne once confirmed.`,
  ].join('\n');

  return text;
}
