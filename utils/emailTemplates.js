// utils/emailTemplates.js - Light shell branded HTML email templates for Theatricalz
import { SITE, REPLY, CONTACT } from '@/config/site';
import { money, paymentTermsHtml } from '@/lib/order';

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function label(text) {
  return `<div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 4px;">${escapeHtml(text)}</div>`;
}

export function field(labelStr, valueHtml, marginBottom = 16) {
  return `
    <div style="margin-bottom: ${marginBottom}px;">
      ${label(labelStr)}
      <div style="font-size: 14px; color: #1e293b; font-weight: 500; line-height: 1.5;">${valueHtml}</div>
    </div>
  `;
}

export const divider = `<div style="height: 1px; background-color: #e2e8f0; margin: 24px 0;"></div>`;

export function callout(innerHtml) {
  const accent = REPLY?.brand?.primary || '#f59e0b';
  return `
    <div style="background-color: #fffbeb; border-left: 4px solid ${accent}; padding: 16px 20px; border-radius: 6px; margin: 20px 0;">
      ${innerHtml}
    </div>
  `;
}

export function button(href, text) {
  const headerDark = REPLY?.brand?.headerDark || '#0f172a';
  return `
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: ${headerDark};">
          <a href="${escapeHtml(href)}" target="_blank" style="font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 600; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 8px; display: inline-block;">
            ${escapeHtml(text)} &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function shell({ eyebrow, title, meta, body }) {
  const primaryAccent = REPLY?.brand?.primary || '#f59e0b';
  const headerDark = REPLY?.brand?.headerDark || '#0f172a';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F2F4F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F2F4F0; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Band -->
          <tr>
            <td style="background-color: ${headerDark}; padding: 32px 32px 28px 32px;">
              ${eyebrow ? `<div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: ${primaryAccent}; margin-bottom: 6px;">${escapeHtml(eyebrow)}</div>` : ''}
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.25;">${escapeHtml(title)}</h1>
              ${meta ? `<div style="font-size: 13px; color: #94a3b8; margin-top: 6px;">${escapeHtml(meta)}</div>` : ''}
            </td>
          </tr>

          <!-- Accent Rule -->
          <tr>
            <td style="height: 3px; background-color: ${primaryAccent};"></td>
          </tr>

          <!-- Card Body -->
          <tr>
            <td style="padding: 32px; background-color: #ffffff;">
              ${body}
            </td>
          </tr>

          <!-- Footer Band -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <div style="font-size: 13px; font-weight: 600; color: #334155;">${escapeHtml(SITE.name)} · 3 Kirks Lane, Melbourne VIC 3000</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                ABN: ${escapeHtml(SITE.abn)} · Phone: ${escapeHtml(CONTACT.phoneDisplay)} · sales&#64;theatricalz.com.au
              </div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">
                Pro Camera, Audio & Music Gear Australia
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// 1. Order Notification (Admin)
export function orderNotificationAdminEmail(order, customer, appUrl = '') {
  const itemsHtml = (order.items || [])
    .map((item) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-size: 14px; color: #1e293b;">
          <strong>${escapeHtml(item.name || item.title)}</strong> × ${item.quantity || 1}
        </td>
        <td style="padding: 10px 0; font-size: 14px; color: #0f172a; text-align: right; font-weight: 600;">
          ${money((item.price || 0) * (item.quantity || 1))}
        </td>
      </tr>
    `)
    .join('');

  const body = `
    <p style="font-size: 15px; color: #334155; margin-top: 0; line-height: 1.5;">
      A new order has been received via <strong>${escapeHtml(order.channel || 'web')}</strong>.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <tr>
        <td>
          ${field('Order Reference', `<strong style="font-size: 18px; color: #0f172a;">${escapeHtml(order.ref || order.id)}</strong>`, 12)}
          ${field('Selected Payment Rail', escapeHtml(order.paymentMethod || 'Not specified'), 12)}
          ${field('Total Payable (AUD inc. GST)', `<strong style="color: #0f172a; font-size: 16px;">${money(order.total)}</strong>`, 0)}
        </td>
      </tr>
    </table>

    ${divider}

    <h3 style="font-size: 16px; color: #0f172a; margin: 0 0 12px 0;">Customer Information</h3>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td>
          ${field('Full Name', escapeHtml(customer.name), 8)}
          ${field('Email Address', `<a href="mailto:${escapeHtml(customer.email)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(customer.email)}</a>`, 8)}
          ${field('Phone Number', escapeHtml(customer.phone), 8)}
          ${field('Delivery Address', `${escapeHtml(customer.address)}, ${escapeHtml(customer.city || '')} ${escapeHtml(customer.state || '')} ${escapeHtml(customer.postcode || '')}`, 8)}
          ${customer.notes ? field('Order Notes', escapeHtml(customer.notes), 8) : ''}
        </td>
      </tr>
    </table>

    ${divider}

    <h3 style="font-size: 16px; color: #0f172a; margin: 0 0 12px 0;">Ordered Equipment</h3>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      ${itemsHtml}
    </table>

    ${button(`${appUrl || 'https://' + SITE.domain}/admin/orders/${encodeURIComponent(order.ref || order.id)}/`, 'View Order in Admin Dashboard')}
  `;

  return {
    subject: `[New Order] ${order.ref || order.id} — ${money(order.total)} (${customer.name})`,
    html: shell({
      eyebrow: 'New Order Received',
      title: `Order ${order.ref || order.id}`,
      meta: `${customer.name} · ${money(order.total)}`,
      body,
    }),
    text: `New order ${order.ref || order.id} for ${money(order.total)} by ${customer.name}. Check admin dashboard.`,
  };
}

// 2. Order Confirmation (Customer)
// Mandatory: NO bank details here, "keep this as reference; payment details coming"
export function orderConfirmationEmail(order, customer, appUrl = '') {
  const itemsHtml = (order.items || [])
    .map((item) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; font-size: 14px; color: #334155;">
          ${escapeHtml(item.name || item.title)} × ${item.quantity || 1}
        </td>
        <td style="padding: 10px 0; font-size: 14px; color: #0f172a; text-align: right; font-weight: 600;">
          ${money((item.price || 0) * (item.quantity || 1))}
        </td>
      </tr>
    `)
    .join('');

  const body = `
    <p style="font-size: 15px; color: #334155; margin-top: 0; line-height: 1.6;">
      Hi ${escapeHtml(customer.name)},
    </p>
    <p style="font-size: 15px; color: #334155; line-height: 1.6;">
      Thank you for your order with <strong>Theatricalz</strong>. We have successfully logged your equipment request and our Melbourne warehouse team is preparing your order.
    </p>

    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            ${field('Order Reference', `<strong style="font-size: 18px; color: #0f172a;">${escapeHtml(order.ref || order.id)}</strong>`, 12)}
            ${field('Payment Method', escapeHtml(order.paymentMethod || 'PayID / Bank Transfer / Crypto'), 12)}
            ${field('Total Order Amount', `<strong style="font-size: 18px; color: #0f172a;">${money(order.total)} AUD (inc. GST)</strong>`, 0)}
          </td>
        </tr>
      </table>
    </div>

    ${callout(`
      <strong style="color: #92400e; font-size: 14px;">Next Step: Payment Instructions Coming Shortly</strong>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #78350f; line-height: 1.5;">
        Please keep this email as your reference. Our team is generating your tailored payment link with full verification details. Once dispatched, you will receive full StarTrack express tracking.
      </p>
    `)}

    ${divider}

    <h3 style="font-size: 16px; color: #0f172a; margin: 0 0 12px 0;">Gear Summary</h3>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      ${itemsHtml}
    </table>

    ${divider}

    <h3 style="font-size: 16px; color: #0f172a; margin: 0 0 8px 0;">Delivery Destination</h3>
    <p style="font-size: 14px; color: #475569; margin: 0; line-height: 1.5;">
      ${escapeHtml(customer.name)}<br>
      ${escapeHtml(customer.address)}, ${escapeHtml(customer.city || '')} ${escapeHtml(customer.state || '')} ${escapeHtml(customer.postcode || '')}<br>
      Phone: ${escapeHtml(customer.phone)}
    </p>

    <p style="font-size: 13px; color: #64748b; margin-top: 24px; line-height: 1.5;">
      Need immediate assistance or urgent shoot dispatch? Reply directly to this email or chat with our team on WhatsApp at <strong>+61 489 989 442</strong>.
    </p>
  `;

  return {
    subject: `Order Received: ${order.ref || order.id} — Theatricalz`,
    html: shell({
      eyebrow: 'Order Logged',
      title: 'We’ve Received Your Order',
      meta: `Reference: ${order.ref || order.id}`,
      body,
    }),
    text: `Hi ${customer.name}, we have received your order ${order.ref || order.id} for ${money(order.total)}. Payment details email is coming shortly.`,
  };
}

// 3. Payment Details Email (Customer)
export function paymentDetailsEmail(opts) {
  const { order, customer, methodLabel, opening, fields = [], closing, appUrl = '' } = opts;
  const ref = order.ref || order.id;
  const baseUrl = appUrl || `https://${SITE.domain}`;
  const paymentPageUrl = `${baseUrl}/order/payment-details/?id=${encodeURIComponent(ref)}`;
  const confirmPageUrl = `${baseUrl}/order/confirm-payment/?id=${encodeURIComponent(ref)}`;

  const fieldsHtml = fields
    .map((f) => `
      <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px 16px; margin-bottom: 8px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">${escapeHtml(f.label)}</div>
        <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 15px; color: #0f172a; font-weight: 600; margin-top: 4px; word-break: break-all;">
          ${escapeHtml(f.value)}
        </div>
      </div>
    `)
    .join('');

  const body = `
    <p style="font-size: 15px; color: #334155; margin-top: 0; line-height: 1.6;">
      Hi ${escapeHtml(customer.name)},
    </p>
    <p style="font-size: 15px; color: #334155; line-height: 1.6;">
      ${escapeHtml(opening)}
    </p>

    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
      ${field('Order Reference', `<strong style="font-size: 18px; color: #0f172a;">${escapeHtml(ref)}</strong>`, 12)}
      ${field('Amount Due', `<strong style="font-size: 22px; color: #0f172a;">${money(order.total)} AUD</strong>`, 12)}
      ${field('Payment Rail', escapeHtml(methodLabel), 16)}

      <div style="margin-top: 16px;">
        ${label('Payment Information')}
        ${fieldsHtml}
      </div>
    </div>

    <p style="font-size: 14px; color: #334155; line-height: 1.6;">
      ${escapeHtml(closing)}
    </p>

    ${button(paymentPageUrl, 'View & One-Click Copy Details')}

    ${callout(`
      <strong style="color: #92400e; font-size: 14px;">Important Payment & Dispatch Terms</strong>
      <div style="margin-top: 8px;">
        ${paymentTermsHtml(ref)}
      </div>
    `)}

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px;">
      <tr>
        <td style="padding: 12px; background-color: #f1f5f9; border-radius: 8px; text-align: center;">
          <a href="${escapeHtml(confirmPageUrl)}" style="font-size: 13px; color: #0284c7; font-weight: 600; text-decoration: none;">
            I’ve Paid — Upload Confirmation / Receipt Screenshot &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  return {
    subject: `Payment Details for Order ${ref} — ${money(order.total)} (${SITE.name})`,
    html: shell({
      eyebrow: 'Payment Required',
      title: `Payment for Order ${ref}`,
      meta: `${money(order.total)} AUD · ${methodLabel}`,
      body,
    }),
    text: `Payment details for order ${ref}. Total: ${money(order.total)}. View and copy details at: ${paymentPageUrl}`,
  };
}

// 4. Enquiry Notification (Admin)
export function enquiryNotificationAdminEmail(enquiry, appUrl = '') {
  const body = `
    <p style="font-size: 15px; color: #334155; margin-top: 0; line-height: 1.5;">
      A new customer enquiry has been submitted.
    </p>

    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 16px 0; border: 1px solid #e2e8f0;">
      ${field('From', escapeHtml(enquiry.name), 12)}
      ${field('Email Address', `<a href="mailto:${escapeHtml(enquiry.email)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(enquiry.email)}</a>`, 12)}
      ${enquiry.phone ? field('Phone', escapeHtml(enquiry.phone), 12) : ''}
      ${field('Subject / Category', escapeHtml(enquiry.subject || 'General Enquiry'), 12)}
      ${field('Message', `<div style="white-space: pre-wrap; font-size: 14px; color: #334155; line-height: 1.6;">${escapeHtml(enquiry.message)}</div>`, 0)}
    </div>

    ${button(`${appUrl || 'https://' + SITE.domain}/admin/reply-enquiry/?id=${encodeURIComponent(enquiry.id)}`, 'Reply in Admin Dashboard')}
  `;

  return {
    subject: `[Enquiry] ${enquiry.subject || 'Gear Inquiry'} from ${enquiry.name}`,
    html: shell({
      eyebrow: 'New Enquiry',
      title: 'Customer Question Received',
      meta: `${enquiry.name} · ${enquiry.email}`,
      body,
    }),
    text: `Enquiry from ${enquiry.name} (${enquiry.email}):\n\n${enquiry.message}`,
  };
}

// 5. Enquiry Reply Email (Customer)
export function enquiryReplyEmail(opts) {
  const { enquiry, replyMessage } = opts;

  const body = `
    <p style="font-size: 15px; color: #334155; margin-top: 0; line-height: 1.6;">
      Hi ${escapeHtml(enquiry.name)},
    </p>

    <div style="font-size: 15px; color: #1e293b; line-height: 1.6; margin: 20px 0; white-space: pre-wrap;">
      ${escapeHtml(replyMessage)}
    </div>

    ${divider}

    <div style="background-color: #f8fafc; border-left: 3px solid #cbd5e1; padding: 12px 16px; margin: 16px 0;">
      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Original Message</div>
      <div style="font-size: 13px; color: #475569; margin-top: 4px; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(enquiry.message)}</div>
    </div>

    <p style="font-size: 13px; color: #64748b; margin-top: 24px; line-height: 1.5;">
      You can reply directly to this email or speak with our gear specialists on WhatsApp at <strong>+61 489 989 442</strong>.
    </p>
  `;

  return {
    subject: `Re: ${enquiry.subject || 'Your inquiry with Theatricalz'}`,
    html: shell({
      eyebrow: 'Theatricalz Support',
      title: 'Response from Gear Desk',
      meta: '3 Kirks Lane, Melbourne VIC',
      body,
    }),
    text: `Hi ${enquiry.name},\n\n${replyMessage}\n\n---\nOriginal message:\n${enquiry.message}`,
  };
}
