'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageSquare, Clock, ArrowRight, CheckCircle, AlertCircle, RefreshCw, Send } from 'lucide-react';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import StatusBadge from '@/components/admin/StatusBadge';
import { money } from '@/lib/order';

export default function AdminDashboardPage() {
  const { passcode } = useAdminPasscode();
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, enqRes] = await Promise.all([
        fetch('/api/admin/orders', { headers: { 'X-Admin-Passcode': passcode } }),
        fetch('/api/admin/enquiries', { headers: { 'X-Admin-Passcode': passcode } }),
      ]);

      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData.orders || []);
      }
      if (enqRes.ok) {
        const enqData = await enqRes.json();
        setEnquiries(enqData.enquiries || []);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (passcode) fetchData();
  }, [passcode]);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const detailsSentOrders = orders.filter((o) => o.status === 'details-sent');
  const confirmedOrders = orders.filter((o) => o.status === 'payment-received');
  const newEnquiries = enquiries.filter((e) => e.status === 'new');

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            Melbourne Facility Dispatch Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Order & Enquiry Command Center
          </h1>
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-800 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Orders</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{pendingOrders.length}</div>
          <p className="text-[11px] text-amber-400 font-medium">Awaiting payment details email</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Details Sent</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{detailsSentOrders.length}</div>
          <p className="text-[11px] text-slate-400 font-medium">Awaiting customer payment</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Confirmed Payments</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{confirmedOrders.length}</div>
          <p className="text-[11px] text-emerald-400 font-medium">Ready for StarTrack dispatch</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>New Enquiries</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{newEnquiries.length}</div>
          <p className="text-[11px] text-amber-400 font-medium">Customer questions pending</p>
        </div>
      </div>

      {/* Recent Orders & Recent Enquiries Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Col */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Recent Equipment Orders</span>
            </h2>
            <Link href="/admin/orders/" className="text-xs font-semibold text-amber-400 hover:underline">
              View All ({orders.length}) &rarr;
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No orders placed yet. Orders submitted via web or WhatsApp will appear here immediately.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {order.ref || order.id}
                      </span>
                      <StatusBadge status={order.status} type="order" />
                      <span className="text-[10px] bg-slate-800 text-slate-400 uppercase font-mono px-1.5 py-0.5 rounded">
                        {order.channel || 'web'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      {order.customer?.name} ({order.customer?.email})
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleString('en-AU')}
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <div className="text-sm font-black text-white font-mono">
                      {money(order.total)}
                    </div>
                    <Link
                      href={`/admin/send-payment-email/?id=${encodeURIComponent(order.ref || order.id)}`}
                      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Payment Email</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Enquiries Col */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Customer Enquiries</span>
            </h2>
            <Link href="/admin/enquiries/" className="text-xs font-semibold text-amber-400 hover:underline">
              View All ({enquiries.length}) &rarr;
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No customer messages submitted yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {enquiries.slice(0, 5).map((enq) => (
                <div key={enq.id} className="py-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{enq.name}</span>
                    <StatusBadge status={enq.status} type="enquiry" />
                  </div>
                  <div className="text-xs text-slate-300 font-medium line-clamp-1">
                    {enq.subject}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-2">
                    {enq.message}
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono">
                      {new Date(enq.createdAt).toLocaleDateString('en-AU')}
                    </span>
                    <Link
                      href={`/admin/reply-enquiry/?id=${encodeURIComponent(enq.id)}`}
                      className="text-amber-400 hover:underline font-semibold"
                    >
                      Reply to Customer &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
