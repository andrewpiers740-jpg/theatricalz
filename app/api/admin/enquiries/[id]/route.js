// app/api/admin/enquiries/[id]/route.js - Single enquiry endpoint
import { checkAdminPasscode } from '@/lib/adminAuth';
import { getEnquiry, deleteEnquiry, saveEnquiry } from '@/lib/enquiryStore';

export async function GET(request, { params }) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  const { id } = await params;
  const enquiry = await getEnquiry(id);

  if (!enquiry) {
    return Response.json({ error: 'Enquiry not found' }, { status: 404 });
  }

  return Response.json({ enquiry });
}

export async function DELETE(request, { params }) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  const { id } = await params;
  await deleteEnquiry(id);
  return Response.json({ success: true, deleted: id });
}

export async function PATCH(request, { params }) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const enquiry = await getEnquiry(id);

  if (!enquiry) {
    return Response.json({ error: 'Enquiry not found' }, { status: 404 });
  }

  const updated = {
    ...enquiry,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  await saveEnquiry(updated);
  return Response.json({ success: true, enquiry: updated });
}
