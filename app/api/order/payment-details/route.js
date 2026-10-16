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

  // If parsed fields were pre-saved by admin, use those; otherwise provide standard rail fields
  let fields = order.parsedPaymentFields || [];

  if (fields.length === 0) {
    if (order.paymentMethod?.includes('crypto-BTC')) {
      fields = parsePaymentDetail(`Coin: Bitcoin (BTC)\nNetwork: Bitcoin Core\nWallet Address: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh\nAmount: ${amountStr} (10% Crypto Discount Applied)\nReference: ${id}`);
    } else if (order.paymentMethod?.includes('crypto-USDT')) {
      fields = parsePaymentDetail(`Coin: Tether (USDT)\nNetwork: TRC20 / ERC20\nUSDT TRC20 Address: TXqY8d7hDkL2mPvN9e4s9A1c6V3k0L7b5P\nAmount: ${amountStr} (10% Crypto Discount Applied)\nReference: ${id}`);
    } else if (order.paymentMethod === 'payid') {
      fields = parsePaymentDetail(`PayID Type: Email\nPayID: sales@theatricalz.com.au\nAccount Name: Theatricalz Australia Pty Ltd\nAmount: ${amountStr}\nDescription / Reference: ${id}`);
    } else {
      fields = parsePaymentDetail(`Bank: National Australia Bank (NAB)\nAccount Name: Theatricalz Australia Pty Ltd\nBSB: 083-004\nAccount Number: 91-458-9481\nAmount: ${amountStr}\nReference: ${id}`);
    }
  }

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
