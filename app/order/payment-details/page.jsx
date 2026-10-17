'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck, CheckCircle2, MessageCircle, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import CopyField from '@/components/CopyField';
import { SITE, CONTACT } from '@/config/site';
import { waPaymentConfirmationLink } from '@/lib/whatsapp';

function PaymentDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    fetch(`/api/order/payment-details?id=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setOrderData(data);
        } else {
          setError(data.error || 'Failed to retrieve payment details');
        }
      })
      .catch((err) => {
        setError('Connection error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8 text-slate-400 text-sm">
        Retrieving payment instructions for order {id}...
      </div>
    );
  }

  const ref = orderData?.ref || id;
  const waConfirmLink = waPaymentConfirmationLink(ref);

  return (
    <div className="bg-slate-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-bold border border-amber-500/20">
          <Lock className="w-3.5 h-3.5" />
          <span>ORDER PAYMENT PORTAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
          Payment Instructions: {ref}
        </h1>
        <p className="text-xs text-slate-400">
          Use the one-click copy buttons below to initiate your payment with exact details.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Amount Due</span>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {orderData?.totalFormatted || '$0.00 AUD'}
            </div>
            <span className="text-[11px] text-slate-400">Australian GST Included</span>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 font-semibold uppercase">Payment Rail</span>
            <div className="text-sm font-bold text-white">
              {orderData?.methodLabel || orderData?.paymentMethod || 'PayID / Bank / Crypto'}
            </div>
          </div>
        </div>

        {/* Opening note */}
        {orderData?.opening && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            {orderData.opening}
          </p>
        )}

        {/* Click-to-Copy Fields */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Payment Fields (Tap to Copy):
          </div>

          {orderData?.fields && orderData.fields.length > 0 ? (
            orderData.fields.map((f, idx) => (
              <CopyField key={idx} label={f.label} value={f.value} />
            ))
          ) : (
            <div className="p-4 bg-slate-950 rounded-xl text-xs text-slate-400 text-center">
              Your payment details will appear here once our team sends them. Watch your inbox for the payment-details email.
            </div>
          )}
        </div>

        {/* Closing note */}
        {orderData?.closing && (
          <p className="text-xs text-slate-400 leading-relaxed">
            {orderData.closing}
          </p>
        )}

        {/* Terms Bullet Points */}
        {orderData?.terms && (
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Terms & Logistics
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {orderData.terms.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 space-y-3">
          <Link
            href={`/order/confirm-payment/?id=${encodeURIComponent(ref)}`}
            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg"
          >
            <span>I’ve Sent Payment — Upload Receipt Screenshot</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={waConfirmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm Payment via WhatsApp Direct</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrderPaymentDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 p-12 text-center text-slate-400 text-sm">Loading details...</div>}>
      <PaymentDetailsContent />
    </Suspense>
  );
}
