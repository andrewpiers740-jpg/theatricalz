// app/api/order/payment-details/route.js - Public endpoint for order payment instructions
import { getOrder } from '@/lib/orderStore';
import { money, parsePaymentDetail, paymentTermsLines, paymentMethodParts, findMethod } from '@/lib/order';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'Order reference ID is required' }, { status: 400 });
  }

  const order = await getOrder(id);

  if (!order) {
    // If order was placed in another session or memory reset, synthesize a clean fallback order view
    return Response.json({
      ref: id,
      total: 0,
      totalFormatted: '$0.00 AUD',
      paymentMethod: 'PayID / Bank Transfer / Crypto',
      status: 'pending',
      fields: [],
      terms: paymentTermsLines(id),
      found: false,
    });
  }

  const amountStr = money(order.total);
  const method = findMethod(order.paymentMethod);
  const { opening, closing } = paymentMethodParts(order.paymentMethod, amountStr, id);

  // Only show payment fields the admin has sent via the Reply Portal — never auto-filled defaults.
  const fields = order.parsedPaymentFields || [];

  return Response.json({
    found: true,
    ref: order.ref || order.id,
    total: order.total,
    totalFormatted: amountStr,
    status: order.status || 'pending',
    paymentMethod: order.paymentMethod,
    methodLabel: method?.label || order.paymentMethod || 'Bank Transfer / PayID',
    opening,
    closing,
    fields,
    terms: paymentTermsLines(id),
    customer: {
      name: order.customer?.name || '',
      email: order.customer?.email || '',
    },
  });
}
