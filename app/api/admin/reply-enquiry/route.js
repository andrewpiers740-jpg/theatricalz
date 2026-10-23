// app/api/admin/reply-enquiry/route.js - Send enquiry reply email
import { checkAdminPasscode } from '@/lib/adminAuth';
import { getEnquiry, markEnquiryReplied } from '@/lib/enquiryStore';
import { sendMail } from '@/lib/mailer';
import { enquiryReplyEmail } from '@/utils/emailTemplates';
import { SITE } from '@/config/site';

export async function POST(request) {
  const authError = await checkAdminPasscode(request);
  if (authError) return authError;

  try {
    const { enquiryId, replyMessage } = await request.json();

    if (!enquiryId || !replyMessage) {
      return Response.json({ error: 'Enquiry ID and reply message are required' }, { status: 400 });
    }

    const enquiry = await getEnquiry(enquiryId);
    if (!enquiry) {
      return Response.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    const emailData = enquiryReplyEmail({ enquiry, replyMessage });

    const sendResult = await sendMail({
      to: enquiry.email,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      replyTo: SITE.reply?.channels?.email || 'sales@theatricalz.com.au',
    });

    await markEnquiryReplied(enquiryId, {
      message: replyMessage,
      sentAt: new Date().toISOString(),
    });

    return Response.json({
      success: true,
      emailSent: sendResult.sent,
      reason: sendResult.reason || null,
    });
  } catch (err) {
    console.error('[reply-enquiry] Error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
