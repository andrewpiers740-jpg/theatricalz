// app/api/order/confirm-payment/route.js - Customer payment confirmation submission.
// Needs the order reference and the private token from the customer's own link (orders from before tokens existed need only the reference).
import { markPaymentConfirmed, getOrder } from '@/lib/orderStore';
import { accessAllowed } from '@/lib/orderToken';
import { rateLimit, clientIp, tooManyResponse } from '@/lib/formGuard';
import { cleanText } from '@/lib/orderValidation';
import { sendMail } from '@/lib/mailer';
import { escapeHtml } from '@/utils/emailTemplates';
import { CONTACT, FORMS } from '@/config/site';

const MAX_BODY_BYTES = 6 * 1024 * 1024;
// A pasted screenshot only: an image data URL in plain base64.
const RECEIPT_RE = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/;

export async function POST(request) {
  try {
    const limit = await rateLimit(`cp:ip:${clientIp(request)}`, 10, 600);
    if (!limit.ok) return tooManyResponse(limit.retryAfter);

    if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) {
      return Response.json({ success: false, error: 'That file is too large.' }, { status: 413 });
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ success: false, error: 'Invalid request.' }, { status: 400 });
    }

    const id = cleanText(body && body.id, 20).toUpperCase();
    const token = cleanText(body && body.token, 80);
    if (!id) {
      return Response.json({ success: false, error: 'This link is incomplete. Please use the link in your payment-details email.' }, { status: 400 });
    }

    const order = await getOrder(id);
    if (!order || !accessAllowed(order, token)) {
      return Response.json({ success: false, error: 'We could not find that order. Please use the link in your email.' }, { status: 404 });
    }

    const notes = cleanText(body.notes, 1000);
    const transactionHash = cleanText(body.transactionHash, 200);
    let receiptUrl = '';
    if (typeof body.receiptUrl === 'string' && body.receiptUrl) {
      if (body.receiptUrl.length > 5.5 * 1024 * 1024 || !RECEIPT_RE.test(body.receiptUrl)) {
        return Response.json({ success: false, error: 'Please attach the receipt as a PNG, JPG, WebP or GIF image.' }, { status: 400 });
      }
      receiptUrl = body.receiptUrl;
    }

    const receiptInfo = {
      notes,
      receiptUrl,
      transactionHash,
      submittedAt: new Date().toISOString(),
    };

    await markPaymentConfirmed(id, receiptInfo);

    // The screenshot goes to the gear desk as an attachment.
    const attachments = [];
    const m = receiptUrl.match(/^data:image\/([a-z]+);base64,(.+)$/);
    if (m) attachments.push({ filename: `receipt-${id}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`, content: Buffer.from(m[2], 'base64'), contentType: `image/${m[1]}` });

    // Notify gear desk. Everything the customer typed is escaped before it goes into the email.
    const adminTo = process.env.ORDER_EMAIL || FORMS.destinations.order || CONTACT.orderEmail || CONTACT.email;
    await sendMail({
      to: adminTo,
      subject: `[Payment Submitted] Order ${id} — Verification Requested`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Customer Marked Payment Sent: ${escapeHtml(id)}</h2>
          <p>Customer for order <strong>${escapeHtml(id)}</strong> has submitted proof of payment.</p>
          <p><strong>Transaction / Note:</strong> ${notes ? escapeHtml(notes) : 'None'}</p>
          ${transactionHash ? `<p><strong>Tx Hash:</strong> <code>${escapeHtml(transactionHash)}</code></p>` : ''}
          ${receiptUrl ? `<p><strong>Screenshot:</strong> attached to this email.</p>` : ''}
          <p>Please reconcile in your bank portal or the blockchain explorer, then dispatch goods.</p>
        </div>
      `,
      text: `Customer submitted payment proof for order ${id}. Note: ${notes}`,
      attachments,
    });

    return Response.json({ success: true, ref: id });
  } catch (err) {
    console.error('[confirm-payment] Error:', err);
    return Response.json({ success: false, error: 'Failed to record payment' }, { status: 500 });
  }
}
