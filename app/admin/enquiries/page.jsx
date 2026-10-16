'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Trash2, Mail, ExternalLink, ArrowRight } from 'lucide-react';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import StatusBadge from '@/components/admin/StatusBadge';

export default function AdminEnquiriesPage() {
  const { passcode } = useAdminPasscode();
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { 'X-Admin-Passcode': passcode },
      });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (passcode) fetchEnquiries();
  }, [passcode]);

  const handleDelete = async (id) => {
    if (!confirm('Delete enquiry?')) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Passcode': passcode },
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (e) {
      alert('Delete failed');
    }
  };

  const filtered = enquiries.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'new') return e.status === 'new';
    if (filter === 'replied') return e.status === 'replied';
    if (filter === 'wholesale') return e.formName === 'wholesale';
    if (filter === 'contact') return e.formName === 'contact';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Customer Enquiries
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Questions regarding stock, commercial quotes, and technical specs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'new', 'replied', 'wholesale', 'contact'].map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => setFilter(pill)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filter === pill
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            {loading ? 'Loading enquiries...' : 'No enquiries found.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filtered.map((enq) => (
              <div key={enq.id} className="p-6 hover:bg-slate-800/40 transition space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{enq.name}</span>
                    <StatusBadge status={enq.status} type="enquiry" />
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {enq.formName || 'contact'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {new Date(enq.createdAt).toLocaleString('en-AU')}
                  </div>
                </div>

                <div className="text-xs text-amber-400 font-semibold">{enq.subject}</div>
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 whitespace-pre-wrap">
                  {enq.message}
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="text-slate-400">
                    Email: <a href={`mailto:${enq.email}`} className="text-white hover:underline">{enq.email}</a>
                    {enq.phone && <span className="ml-3">Phone: {enq.phone}</span>}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/reply-enquiry/?id=${encodeURIComponent(enq.id)}`}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                    >
                      Reply to Customer &rarr;
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(enq.id)}
                      className="text-slate-500 hover:text-red-400 p-1.5 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
