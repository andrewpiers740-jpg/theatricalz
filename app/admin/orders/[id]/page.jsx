'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ChevronRight, Send, ArrowLeft, ExternalLink, Check, Trash2 } from 'lucide-react';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import StatusBadge from '@/components/admin/StatusBadge';
import { money } from '@/lib/order';

export default function AdminOrderDetailPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { passcode } = useAdminPasscode();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    if (!passcode || !id) return;
    fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
      headers: { 'X-Admin-Passcode': passcode },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.order) setOrder(data.order);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [passcode, id]);

  const handleUpdateStatus = async (newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Passcode': passcode,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Order {id} not found</h2>
        <Link href="/admin/orders/" className="text-amber-400 text-sm hover:underline">
          &larr; Back to Orders List
        </Link>
      </div>
    );
  }

  const ref = order.ref || order.id;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Nav */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          href="/admin/orders/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Orders List</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/order/payment-details/?id=${encodeURIComponent(ref)}${order.accessToken ? `&token=${encodeURIComponent(order.accessToken)}` : ''}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition"
          >
            <span>Customer View</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <Link
            href={`/admin/send-payment-email/?id=${encodeURIComponent(ref)}`}
            className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Compose Payment Details Email</span>
          </Link>
        </div>
      </div>

      {/* Main Order Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Order Reference</span>
            <h1 className="text-3xl font-black text-amber-400 font-mono tracking-tight">{ref}</h1>
            <div className="text-xs text-slate-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString('en-AU')} via{' '}
              <span className="text-white font-bold uppercase">{order.channel || 'web'}</span>
            </div>
          </div>

          <div className="space-y-2 text-left sm:text-right">
            <div className="text-xs text-slate-400 font-semibold uppercase">Status</div>
            <StatusBadge status={order.status} type="order" />
            <div className="flex items-center gap-1 pt-1 justify-start sm:justify-end">
              <span className="text-[11px] text-slate-500 mr-1">Change:</span>
              {['pending', 'details-sent', 'payment-received', 'dispatched'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleUpdateStatus(st)}
                  disabled={statusUpdating || order.status === st}
                  className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase transition ${
                    order.status === st
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st.split('-')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Customer & Delivery Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-400">Customer Details</h3>
            <div className="space-y-1 text-slate-300">
              <div className="text-sm font-bold text-white">{order.customer?.name}</div>
              <div>Email: {order.customer?.email}</div>
              <div>Phone: {order.customer?.phone}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-400">Delivery Address</h3>
            <div className="text-slate-300 leading-relaxed">
              {order.customer?.address}<br />
              {order.customer?.city} {order.customer?.state} {order.customer?.postcode}<br />
              Australia
            </div>
            {order.customer?.notes && (
              <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-300">
                <strong>Notes:</strong> {order.customer.notes}
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Equipment Line Items</h3>
          <div className="bg-slate-950 rounded-2xl overflow-hidden divide-y divide-slate-800 text-xs">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm">{item.name || item.title}</span>
                  <span className="text-slate-400 block text-xs">Qty: {item.quantity || 1}</span>
                </div>
                <div className="font-mono font-bold text-white text-sm">
                  {money((item.price || 0) * (item.quantity || 1))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-right space-y-1 text-xs text-slate-400">
            <div>Subtotal: <strong className="text-white font-mono">{money(order.subtotal || order.total)}</strong></div>
            {order.discountAmount > 0 && (
              <div className="text-amber-400">Discount: <strong className="font-mono">-{money(order.discountAmount)}</strong></div>
            )}
            <div className="text-base font-bold text-white pt-1">
              Total: <span className="text-amber-400 font-mono text-xl">{money(order.total)} AUD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
