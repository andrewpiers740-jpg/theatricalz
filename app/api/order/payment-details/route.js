// app/api/order/payment-details/route.js - Customer order payment instructions.
// Needs the order reference and the private token from the customer's own email link (orders from before tokens existed need only the reference).
// An unknown reference and a wrong token get the same answer, so references cannot be probed.
import { getOrder } from '@/lib/orderStore';
import { accessAllowed } from '@/lib/orderToken';
import { rateLimit, clientIp, tooManyResponse } from '@/lib/formGuard';
import { money, paymentTermsLines, paymentMethodParts, findMethod } from '@/lib/order';

const NOT_FOUND = 'We could not find that order. Please use the link in your payment-details email.';

export async function GET(request) {
  const limit = await rateLimit(`od:ip:${clientIp(request)}`, 30, 600);
  if (!limit.ok) return tooManyResponse(limit.retryAfter);

  const { searchParams } = new URL(request.url);
  const id = (searchParams.get('id') || '').trim().toUpperCase();
  const token = searchParams.get('token') || '';

  if (!id) {
    return Response.json({ error: 'This link is incomplete. Please use the link in your payment-details email.' }, { status: 400 });
  }

  const order = await getOrder(id);
  if (!order || !accessAllowed(order, token)) {
    return Response.json({ error: NOT_FOUND }, { status: 404 });
  }

  const amountStr = money(order.total);
  const method = findMethod(order.paymentMethod);
  const { opening, closing } = paymentMethodParts(order.paymentMethod, amountStr, id);

  // Only show payment fields the admin has sent via the Reply Portal — never auto-filled defaults.
  const fields = order.parsedPaymentFields || [];

  // No customer name, email or address is returned: the page does not need them.
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
  });
}
