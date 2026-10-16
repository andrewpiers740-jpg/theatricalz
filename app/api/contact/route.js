// app/api/contact/route.js - Central submission route for orders, contact, and wholesale
import { saveOrder } from '@/lib/orderStore';
import { saveEnquiry } from '@/lib/enquiryStore';
import { sendMail } from '@/lib/mailer';
import {
  orderNotificationAdminEmail,
  orderConfirmationEmail,
  enquiryNotificationAdminEmail,
} from '@/utils/emailTemplates';
import { CONTACT, FORMS, SITE } from '@/config/site';

export async function POST(request) {
  try {
    const data = await request.json();
    const formName = data.formName || (data.items ? 'order' : 'contact');
    const appUrl = process.env.APP_URL || `https://${SITE.domain}`;

    // 1. ORDER HANDLING (EITHER channel: email or whatsapp)
    if (formName === 'order') {
      const { order, customer, channel } = data;
      if (!customer?.email) {
        return Response.json({ success: false, error: 'Customer email is required.' }, { status: 400 });
      }

      const orderRecord = {
        ...order,
        channel: channel || 'email',
        customer,
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
      });
    }

    // 2. CONTACT / WHOLESALE / ENQUIRY HANDLING
    const { name, email, phone, message, subject } = data;
    if (!name || !email || !message) {
      return Response.json({ success: false, error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const enquiryRecord = {
      name,
      email,
      phone: phone || '',
      subject: subject || (formName === 'wholesale' ? 'Wholesale Account Application' : 'Gear Advice & Quote'),
      message,
      formName,
      createdAt: new Date().toISOString(),
    };

    const savedEnquiry = await saveEnquiry(enquiryRecord);

    const adminEmailData = enquiryNotificationAdminEmail(savedEnquiry, appUrl);
    const dest = formName === 'wholesale'
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
