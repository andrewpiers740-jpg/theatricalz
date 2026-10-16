'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, ArrowLeft, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import { SITE } from '@/config/site';

function ReplyEnquiryContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const router = useRouter();

  const { passcode } = useAdminPasscode();
  const [enquiry, setEnquiry] = useState(null);
  const [replyText, setReplyText] = useState(
    'Hi, thanks for reaching out to Theatricalz. We have checked our Melbourne stock...'
  );
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!passcode || !id) return;
    fetch(`/api/admin/enquiries/${encodeURIComponent(id)}`, {
      headers: { 'X-Admin-Passcode': passcode },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.enquiry) {
          setEnquiry(data.enquiry);
          setReplyText(
            `Hi ${data.enquiry.name},\n\nThank you for reaching out to Theatricalz pro gear desk.\n\n`
          );
        }
      });
  }, [passcode, id]);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/admin/reply-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Passcode': passcode,
        },
        body: JSON.stringify({
          enquiryId: id,
          replyMessage: replyText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/admin/enquiries/'), 2500);
      } else {
        setError(data.error || 'Failed to send reply email.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setSending(false);
    }
  };

  if (!enquiry) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading enquiry details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          href="/admin/enquiries/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Enquiries</span>
        </Link>
        <span className="text-xs text-amber-400 font-mono font-bold">
          Enquiry Reply Composer
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white uppercase tracking-tight">
            Reply to {enquiry.name} ({enquiry.email})
          </h1>
          <p className="text-xs text-slate-400">
            Subject: <strong className="text-white">{enquiry.subject}</strong>
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Response email sent successfully! Redirecting...</span>
          </div>
        )}

        {/* Original Message Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider block">Original Message:</span>
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{enquiry.message}</p>
        </div>

        {/* Compose Reply */}
        <div className="space-y-2 text-xs">
          <label className="block text-slate-300 font-semibold">Your Response (Sent via Branded Email)</label>
          <textarea
            rows={8}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-white text-xs font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <button
          type="button"
          disabled={sending}
          onClick={handleSendReply}
          className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{sending ? 'Sending Branded Email...' : `Send Reply to ${enquiry.email}`}</span>
        </button>
      </div>
    </div>
  );
}

export default function ReplyEnquiryPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 text-sm">Loading composer...</div>}>
      <ReplyEnquiryContent />
    </Suspense>
  );
}
