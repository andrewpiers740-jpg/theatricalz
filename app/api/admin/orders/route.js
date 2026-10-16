// app/api/admin/orders/route.js - Admin Orders List (passcode protected)
import { checkAdminPasscode } from '@/lib/adminAuth';
import { listOrders } from '@/lib/orderStore';

export async function GET(request) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  const orders = await listOrders();
  return Response.json({ orders });
}
