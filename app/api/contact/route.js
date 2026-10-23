// app/api/contact/route.js - Central submission route for orders, contact, and wholesale
import { saveOrder, getOrder } from '@/lib/orderStore';
import { saveEnquiry } from '@/lib/enquiryStore';
import { sendMail } from '@/lib/mailer';
import { generateOrderRef } from '@/lib/order';
import { newAccessToken } from '@/lib/orderToken';
import { buildServerOrder, validateEnquiry, isValidRef } from '@/lib/orderValidation';
import { rateLimit, clientIp, tooManyResponse, looksLikeBot, emailKey } from '@/lib/formGuard';
import {
  orderNotificationAdminEmail,
  orderConfirmationEmail,
  enquiryNotificationAdminEmail,
} from '@/utils/emailTemplates';
import { CONTACT, FORMS, SITE } from '@/config/site';

const MAX_BODY_BYTES = 64 * 1024;

export async function POST(request) {
  try {
    // Throttle by IP before doing any work: 6 submissions per 10 minutes and 20 per hour.
    const ip = clientIp(request);
    const burst = await rateLimit(`form:ip10:${ip}`, 6, 600);
    if (!burst.ok) return tooManyResponse(burst.retryAfter);
    const hourly = await rateLimit(`form:ip60:${ip}`, 20, 3600);
    if (!hourly.ok) return tooManyResponse(hourly.retryAfter);

    const declared = Number(request.headers.get('content-length') || 0);
    if (declared > MAX_BODY_BYTES) {
      return Response.json({ success: false, error: 'Request too large.' }, { status: 413 });
    }
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ success: false, error: 'Request too large.' }, { status: 413 });
    }
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return Response.json({ success: false, error: 'Invalid request.' }, { status: 400 });
    }
    if (!data || typeof data !== 'object') {
      return Response.json({ success: false, error: 'Invalid request.' }, { status: 400 });
    }

    // Bot check: hidden field filled in, or submitted faster than a person could.
    const guard = looksLikeBot(data);
    if (guard.bot) {
      if (guard.silent) return Response.json({ success: true, ref: generateOrderRef('TH') }); // looks fine to the bot, nothing is stored or sent
      return Response.json({ success: false, error: 'Please take a moment to check your details and try again.' }, { status: 400 });
    }

    const formName = data.formName || (data.order ? 'order' : 'contact');
    const appUrl = process.env.APP_URL || `https://${SITE.domain}`;

    // 1. ORDER HANDLING (EITHER channel: email or whatsapp)
    if (formName === 'order') {
      // Prices, totals, product names and status are rebuilt on the server. Nothing from the browser is trusted.
      const result = buildServerOrder(data);
      if (!result.ok) {
        return Response.json({ success: false, error: result.error }, { status: 400 });
      }
      const { order, customer } = result;

      // No more than 4 orders per hour for the same email address, so the site cannot be used to mail strangers.
      const perEmail = await rateLimit(`form:email:${await emailKey(customer.email)}`, 4, 3600);
      if (!perEmail.ok) return tooManyResponse(perEmail.retryAfter);

      // Only crypto orders show a reference before placing (the payment popup), so only those may keep it,
      // and only if it is well formed and unused. Every other order gets a server-made reference.
      let ref = order.paymentMethod.startsWith('crypto-') ? result.requestedRef : '';
      if (!isValidRef(ref) || (await getOrder(ref))) {
        ref = generateOrderRef('TH');
        for (let i = 0; i < 5 && (await getOrder(ref)); i++) ref = generateOrderRef('TH');
      }

      const orderRecord = {
        ...order,
        id: ref,
        ref,
        customer,
        accessToken: newAccessToken(),
        createdAt: new Date().toISOString(),
      };

      // Persist order in store
      const saved = await saveOrder(orderRecord);

      // A: Notify shop admin
      const adminEmailData = orderNotificationAdminEmail(saved, customer, appUrl);
      const adminTo = process.env.ORDER_EMAIL || FORMS.destinations.order || CONTACT.orderEmail || CONTACT.email;
      await sendMail({
        to: adminTo,
        subject: adminEmailData.subject,
        html: adminEmailData.html,
        text: adminEmailData.text,
        replyTo: customer.email,
      });

      // B: UNCONDITIONAL Customer Confirmation Email (Mandatory on ANY channel including WhatsApp!)
      const customerEmailData = orderConfirmationEmail(saved, customer, appUrl);
      await sendMail({
        to: customer.email,
        subject: customerEmailData.subject,
        html: customerEmailData.html,
        text: customerEmailData.text,
      });

      return Response.json({
        success: true,
        orderId: saved.id || saved.ref,
        ref: saved.ref,
        token: saved.accessToken,
      });
    }

    // 2. CONTACT / WHOLESALE / ENQUIRY HANDLING
    const checked = validateEnquiry(data);
    if (!checked.ok) {
      return Response.json({ success: false, error: checked.error }, { status: 400 });
    }
    const { name, email, phone, subject, message } = checked.enquiry;
    const enquiryFormName = checked.enquiry.formName;

    const perEmail = await rateLimit(`form:email:${await emailKey(email)}`, 4, 3600);
    if (!perEmail.ok) return tooManyResponse(perEmail.retryAfter);

    const enquiryRecord = {
      name,
      email,
      phone,
      subject,
      message,
      formName: enquiryFormName,
      createdAt: new Date().toISOString(),
    };

    const savedEnquiry = await saveEnquiry(enquiryRecord);

    const adminEmailData = enquiryNotificationAdminEmail(savedEnquiry, appUrl);
    const dest = enquiryFormName === 'wholesale'
      ? (process.env.WHOLESALE_EMAIL || FORMS.destinations.wholesale || CONTACT.email)
      : (process.env.CONTACT_EMAIL || FORMS.destinations.contact || CONTACT.email);

    await sendMail({
      to: dest,
      subject: adminEmailData.subject,
      html: adminEmailData.html,
      text: adminEmailData.text,
      replyTo: email,
    });

    return Response.json({
      success: true,
      enquiryId: savedEnquiry.id,
    });
  } catch (err) {
    console.error('[api/contact] Error processing request:', err);
    return Response.json({ success: false, error: 'Server error processing submission.' }, { status: 500 });
  }
}
