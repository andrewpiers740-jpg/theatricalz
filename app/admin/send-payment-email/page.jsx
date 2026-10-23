'use client';

import { getToken, getNetworks } from '@/config/wallets';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, ArrowLeft, Check, Sparkles, MessageCircle, AlertCircle, Eye } from 'lucide-react';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import WhatsAppSendPanel from '@/components/admin/WhatsAppSendPanel';
import { REPLY, SITE } from '@/config/site';
import { parsePaymentDetail, money, paymentMethodParts } from '@/lib/order';

function SendPaymentEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialOrderId = searchParams.get('id') || '';

  const { passcode } = useAdminPasscode();
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [methodId, setMethodId] = useState('payid');
  const [paymentDetailText, setPaymentDetailText] = useState(
    'PayID Type: \nPayID: \nAccount Name: THEATRICALZ PTY LTD\nBank: '
  );
  const [customOpening, setCustomOpening] = useState('');
  const [customClosing, setCustomClosing] = useState('');

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch orders
  useEffect(() => {
    if (!passcode) return;
    fetch('/api/admin/orders', { headers: { 'X-Admin-Passcode': passcode } })
      .then((res) => res.json())
      .then((data) => {
        const ords = data.orders || [];
        setOrders(ords);
        if (initialOrderId) {
          const match = ords.find((o) => (o.ref || o.id) === initialOrderId);
          if (match) {
            setSelectedOrder(match);
            if (match.paymentMethod) setMethodId(match.paymentMethod);
          }
        } else if (ords.length > 0) {
          setSelectedOrderId(ords[0].ref || ords[0].id);
          setSelectedOrder(ords[0]);
          if (ords[0].paymentMethod) setMethodId(ords[0].paymentMethod);
        }
      });
  }, [passcode, initialOrderId]);

  // When order changes
  const handleOrderChange = (e) => {
    const newId = e.target.value;
    setSelectedOrderId(newId);
    const match = orders.find((o) => (o.ref || o.id) === newId);
    if (match) {
      setSelectedOrder(match);
      if (match.paymentMethod) setMethodId(match.paymentMethod);
    }
  };

  // Set default paste blobs based on selected method
  const handleMethodChange = (e) => {
    const m = e.target.value;
    setMethodId(m);
    if (m === 'payid') {
      setPaymentDetailText(
        'PayID Type: \nPayID: \nAccount Name: THEATRICALZ PTY LTD\nBank: '
      );
    } else if (m === 'bank-transfer') {
      setPaymentDetailText(
        'Bank: \nAccount Name: THEATRICALZ PTY LTD\nBSB: \nAccount Number: '
      );
    } else if (m.startsWith('crypto-')) {
      const tok = getToken(m.replace('crypto-', ''));
      const nets = tok ? getNetworks(tok.symbol) : [];
      setPaymentDetailText(
        nets
          .map(
            (n) =>
              `Currency: ${tok.name} (${tok.symbol})\nNetwork: ${n.label}\nAddress: ${n.address}${n.memo ? `\nMemo: ${n.memo}` : ''}`
          )
          .join('\n\n')
      );
    }
  };

  const parsedFields = parsePaymentDetail(paymentDetailText);
  const ref = selectedOrder?.ref || selectedOrderId || 'TH-XXXXXX';
  const amountStr = selectedOrder ? money(selectedOrder.total) : '$0.00 AUD';
  const defaultParts = paymentMethodParts(methodId, amountStr, ref);

  const handleSend = async () => {
    if (!selectedOrderId) {
      setError('Please select an order');
      return;
    }

    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/admin/send-payment-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Passcode': passcode,
        },
        body: JSON.stringify({
          orderId: selectedOrderId,
          methodId,
          paymentDetailText,
          customOpening: customOpening || defaultParts.opening,
          customClosing: customClosing || defaultParts.closing,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(data.error || 'Failed to send email. Check SMTP settings.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          href="/admin/orders/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Orders</span>
        </Link>
        <span className="text-xs text-amber-400 font-mono font-bold">
          Payment Details Composer
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white uppercase tracking-tight">
              Compose Payment Details
            </h1>
            <p className="text-xs text-slate-400">
              Paste your account or wallet details once. Our parser auto-splits it into individually copyable fields.
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
              <span>Payment details email sent successfully and order marked as details-sent!</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            {/* Select Order */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Order</label>
              <select
                value={selectedOrderId}
                onChange={handleOrderChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
              >
                {orders.map((o) => (
                  <option key={o.ref || o.id} value={o.ref || o.id}>
                    {o.ref || o.id} — {o.customer?.name} ({money(o.total)})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Method */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payment Method</label>
              <select
                value={methodId}
                onChange={handleMethodChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
              >
                {REPLY.paymentMethods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Paste Real Payment Info */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Paste Real Payment Detail Blob (Auto-Split by parsePaymentDetail)
              </label>
              <textarea
                rows={4}
                value={paymentDetailText}
                onChange={(e) => setPaymentDetailText(e.target.value)}
                placeholder="Bank: &#10;BSB: &#10;Account: "
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Works for any bank, PayID, BTC/USDT wallet, or SEPA rail with zero code changes.
              </span>
            </div>

            {/* Optional Custom Opening */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Opening Message (Optional Override)
              </label>
              <input
                type="text"
                value={customOpening}
                onChange={(e) => setCustomOpening(e.target.value)}
                placeholder={defaultParts.opening}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-600"
              />
            </div>

            {/* Optional Custom Closing */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Closing Message (Optional Override)
              </label>
              <input
                type="text"
                value={customClosing}
                onChange={(e) => setCustomClosing(e.target.value)}
                placeholder={defaultParts.closing}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-600"
              />
            </div>

            <button
              type="button"
              disabled={sending}
              onClick={handleSend}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Sending Branded Email...' : 'Send Payment Email to Customer'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live Preview & WhatsApp Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Field Parse Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Customer Copyfield Preview</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {parsedFields.length} {parsedFields.length === 1 ? 'field' : 'fields'} parsed
              </span>
            </div>

            <div className="space-y-2">
              {parsedFields.map((f, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">{f.label}</span>
                  <span className="text-xs font-mono font-bold text-white select-all">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Direct Reply Panel */}
          <WhatsAppSendPanel
            customerPhone={selectedOrder?.customer?.phone}
            customerName={selectedOrder?.customer?.name}
            messageBody={`Hi ${selectedOrder?.customer?.name || 'Customer'},\n\nPayment instructions for order *${ref}* (${amountStr}):\n\n${parsedFields.map((f) => `• *${f.label}:* ${f.value}`).join('\n')}\n\nView details & upload receipt at:\nhttps://${SITE.domain}/order/payment-details/?id=${encodeURIComponent(ref)}`}
          />
        </div>
      </div>
    </div>
  );
}

export default function SendPaymentEmailPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 text-sm">Loading composer...</div>}>
      <SendPaymentEmailContent />
    </Suspense>
  );
}
