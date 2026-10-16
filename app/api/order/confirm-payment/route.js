// app/api/order/confirm-payment/route.js - Customer payment confirmation submission
import { markPaymentConfirmed, getOrder } from '@/lib/orderStore';
import { sendMail } from '@/lib/mailer';
import { CONTACT, FORMS } from '@/config/site';

export async function POST(request) {
  try {
    const { id, notes, receiptUrl, transactionHash } = await request.json();

    if (!id) {
      return Response.json({ success: false, error: 'Order reference ID is required' }, { status: 400 });
    }

    const order = await getOrder(id);

    const receiptInfo = {
      notes: notes || '',
      receiptUrl: receiptUrl || '',
      transactionHash: transactionHash || '',
      submittedAt: new Date().toISOString(),
    };

    await markPaymentConfirmed(id, receiptInfo);

    // Notify gear desk
    const adminTo = process.env.ORDER_EMAIL || FORMS.destinations.order || CONTACT.orderEmail || CONTACT.email;
    await sendMail({
      to: adminTo,
      subject: `[Payment Submitted] Order ${id} — Verification Requested`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Customer Marked Payment Sent: ${id}</h2>
          <p>Customer for order <strong>${id}</strong> has submitted proof of payment.</p>
          <p><strong>Transaction / Note:</strong> ${notes || 'None'}</p>
          ${transactionHash ? `<p><strong>Tx Hash:</strong> <code>${transactionHash}</code></p>` : ''}
          ${receiptUrl ? `<p><strong>Screenshot:</strong> <a href="${receiptUrl}" target="_blank">View Receipt Image</a></p>` : ''}
          <p>Please reconcile in NAB bank portal or blockchain explorer, then dispatch goods.</p>
        </div>
      `,
      text: `Customer submitted payment proof for order ${id}. Note: ${notes || ''}`,
    });

    return Response.json({ success: true, ref: id });
  } catch (err) {
    console.error('[confirm-payment] Error:', err);
    return Response.json({ success: false, error: 'Failed to record payment' }, { status: 500 });
  }
}
