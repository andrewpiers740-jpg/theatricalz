'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Upload, FileCheck, ArrowRight, MessageCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { SITE, CONTACT } from '@/config/site';
import { waPaymentConfirmationLink } from '@/lib/whatsapp';

function ConfirmPaymentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const token = searchParams.get('token') || '';

  const [notes, setNotes] = useState('');
  const [txHash, setTxHash] = useState('');
  const [filePreview, setFilePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError('File size exceeds 4MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setError('Missing order reference ID.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/order/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          token,
          notes,
          transactionHash: txHash,
          receiptUrl: filePreview,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit payment confirmation.');
      }
    } catch (err) {
      setError('Connection failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const waLink = waPaymentConfirmationLink(id);

  if (submitted) {
    return (
      <div className="bg-slate-950 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
              Order: {id}
            </span>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Payment Confirmation Received!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our Melbourne accounting desk has logged your payment submission. Once reconciled, your consignment will be dispatched with StarTrack Express tracking.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/"
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition text-center"
            >
              Back to Storefront
            </Link>
            <Link
              href="/tracking/"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold text-center transition border border-slate-700"
            >
              Track Order Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-8 text-white">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
          <FileCheck className="w-3.5 h-3.5" />
          <span>PAYMENT VERIFICATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
          Confirm Payment for {id}
        </h1>
        <p className="text-xs text-slate-400">
          Upload your bank transfer receipt, PayID confirmation, or blockchain transaction hash.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Transaction Reference / Blockchain Tx Hash (Optional)
            </label>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="e.g. bank transfer ID, PayID ref, or crypto transaction hash"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Upload Payment Receipt Screenshot (Max 4MB)
            </label>
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-6 text-center bg-slate-950/60 cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <span className="text-xs text-slate-300 block font-medium">
                Tap or drag screenshot here (PNG, JPG, WebP)
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Up to 4MB file size
              </span>
            </div>

            {filePreview && (
              <div className="mt-2 p-2 bg-slate-950 rounded-lg text-emerald-400 text-xs flex items-center gap-2 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>Screenshot attached and ready for upload.</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Additional Notes for Accounts Team (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sent from Commonwealth Bank account ending in 4921."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <span>{loading ? 'Submitting Receipt...' : 'Submit Payment Proof'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800 text-center">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Or send receipt directly via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 p-12 text-center text-slate-400 text-sm">Loading verification...</div>}>
      <ConfirmPaymentContent />
    </Suspense>
  );
}
