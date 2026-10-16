// app/api/admin/send-payment-email/route.js - Send payment details email and mark order sent
import { checkAdminPasscode } from '@/lib/adminAuth';
import { getOrder, markOrderSent } from '@/lib/orderStore';
import { sendMail } from '@/lib/mailer';
import { paymentDetailsEmail } from '@/utils/emailTemplates';
import { parsePaymentDetail, money, paymentMethodParts, findMethod } from '@/lib/order';
import { SITE } from '@/config/site';

export async function POST(request) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  try {
    const { orderId, methodId, paymentDetailText, customOpening, customClosing } = await request.json();

    if (!orderId) {
      return Response.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    const customerEmail = order.customer?.email;
    if (!customerEmail) {
      return Response.json({ error: 'Order has no customer email address' }, { status: 400 });
    }

    const parsedFields = parsePaymentDetail(paymentDetailText || '');
    const amountStr = money(order.total);
    const method = findMethod(methodId || order.paymentMethod);
    const defaultParts = paymentMethodParts(methodId || order.paymentMethod, amountStr, order.ref || order.id);

    const opening = customOpening || defaultParts.opening;
    const closing = customClosing || defaultParts.closing;
    const methodLabel = method?.label || methodId || order.paymentMethod || 'Direct Payment';

    const appUrl = process.env.APP_URL || `https://${SITE.domain}`;

    const emailData = paymentDetailsEmail({
      order,
      customer: order.customer,
      methodLabel,
      opening,
      fields: parsedFields,
      closing,
      appUrl,
    });

    const sendResult = await sendMail({
      to: customerEmail,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      replyTo: SITE.reply?.channels?.email || 'sales@theatricalz.com.au',
    });

    await markOrderSent(orderId, parsedFields);

    return Response.json({
      success: true,
      emailSent: sendResult.sent,
      reason: sendResult.reason || null,
      parsedFields,
    });
  } catch (err) {
    console.error('[send-payment-email] Error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
