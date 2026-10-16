'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Filter, Trash2, Send, ExternalLink } from 'lucide-react';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import StatusBadge from '@/components/admin/StatusBadge';
import { money } from '@/lib/order';

export default function AdminOrdersPage() {
  const { passcode } = useAdminPasscode();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'X-Admin-Passcode': passcode },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (passcode) fetchOrders();
  }, [passcode]);

  const handleDelete = async (id) => {
    if (!confirm(`Delete order ${id}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Passcode': passcode },
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => (o.ref || o.id) !== id));
      }
    } catch (e) {
      alert('Delete failed');
    }
  };

  const filtered = orders.filter((o) => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const cleanSearch = search.toLowerCase();
    const matchesSearch =
      !search ||
      (o.ref || o.id).toLowerCase().includes(cleanSearch) ||
      o.customer?.name?.toLowerCase().includes(cleanSearch) ||
      o.customer?.email?.toLowerCase().includes(cleanSearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Customer Orders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage allocations, review payments, and dispatch via StarTrack Express.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'pending', 'details-sent', 'payment-received'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filter === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            {loading ? 'Loading orders from store...' : 'No orders found matching filters.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Total (AUD)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((order) => {
                  const ref = order.ref || order.id;
                  return (
                    <tr key={ref} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        <Link href={`/admin/orders/${encodeURIComponent(ref)}/`} className="hover:underline">
                          {ref}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{order.customer?.name}</div>
                        <div className="text-[11px] text-slate-400">{order.customer?.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono uppercase text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                          {order.channel || 'web'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {money(order.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={order.status} type="order" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-AU')}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/admin/send-payment-email/?id=${encodeURIComponent(ref)}`}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 font-semibold border border-amber-500/30 transition"
                          title="Compose Payment Details Email"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Details</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(ref)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
