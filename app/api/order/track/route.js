// app/api/order/track/route.js - Order status lookup for customers.
// The customer proves it is their order with the reference AND the email address used on it.
// A wrong reference and a wrong email get the same answer, and only the status is returned.
import { getOrder } from '@/lib/orderStore';
import { rateLimit, clientIp, tooManyResponse } from '@/lib/formGuard';
import { cleanText, isValidRef } from '@/lib/orderValidation';
import { findMethod } from '@/lib/order';

const NOT_FOUND = 'We could not match that reference and email. Check both, or contact our team.';

export async function POST(request) {
  const limit = await rateLimit(`tr:ip:${clientIp(request)}`, 20, 600);
  if (!limit.ok) return tooManyResponse(limit.retryAfter);

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const ref = cleanText(body && body.ref, 20).toUpperCase();
  const email = cleanText(body && body.email, 254).toLowerCase();
  if (!ref || !email) {
    return Response.json({ error: 'Please enter your order reference and the email address you ordered with.' }, { status: 400 });
  }

  const order = isValidRef(ref) ? await getOrder(ref) : null;
  const stored = order && order.customer && typeof order.customer.email === 'string' ? order.customer.email.toLowerCase() : '';
  if (!order || !stored || stored !== email) {
    return Response.json({ error: NOT_FOUND }, { status: 404 });
  }

  const method = findMethod(order.paymentMethod);
  return Response.json({
    ref: order.ref || order.id,
    status: order.status || 'pending',
    paymentMethod: method?.label || order.paymentMethod || '',
    createdAt: order.createdAt || '',
  });
}
