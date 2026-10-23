// app/api/admin/enquiries/route.js - Admin Enquiries List
import { checkAdminPasscode } from '@/lib/adminAuth';
import { listEnquiries } from '@/lib/enquiryStore';

export async function GET(request) {
  const authError = await checkAdminPasscode(request);
  if (authError) return authError;

  const enquiries = await listEnquiries();
  return Response.json({ enquiries });
}
