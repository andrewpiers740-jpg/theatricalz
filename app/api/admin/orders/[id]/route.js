// app/api/admin/orders/[id]/route.js - Admin single order endpoints
import { checkAdminPasscode } from '@/lib/adminAuth';
import { getOrder, deleteOrder, saveOrder } from '@/lib/orderStore';

export async function GET(request, { params }) {
  const authError = await checkAdminPasscode(request);
  if (authError) return authError;

  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return Response.json({ error: 'Order not found' }, { status: 404 });
  }

  return Response.json({ order });
}

export async function DELETE(request, { params }) {
  const authError = await checkAdminPasscode(request);
  if (authError) return authError;

  const { id } = await params;
  await deleteOrder(id);
  return Response.json({ success: true, deleted: id });
}

export async function PATCH(request, { params }) {
  const authError = await checkAdminPasscode(request);
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const order = await getOrder(id);

  if (!order) {
    return Response.json({ error: 'Order not found' }, { status: 404 });
  }

  const updated = {
    ...order,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  await saveOrder(updated);
  return Response.json({ success: true, order: updated });
}
