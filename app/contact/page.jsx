'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, AlertCircle, ChevronRight, Clock } from 'lucide-react';
import { SITE, CONTACT } from '@/config/site';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Gear Advice & Quote',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  // Pre-fill a quote request when arriving from a "Price on request" product
  useEffect(() => {
    const product = new URLSearchParams(window.location.search).get('product');
    if (product) {
      setFormData((f) => ({
        ...f,
        subject: 'Gear Advice & Quote',
        message: f.message || `Please send me a quote and lead time for: ${product}`,
      }));
    }
  }, []);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'contact',
          ...formData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/thank-you-contact/');
      } else {
        setError(data.error || 'Failed to send message. Please try again or WhatsApp us.');
      }
    } catch (err) {
      setError('Network failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const greetingWa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi ${SITE.name}, I would like to speak with a pro gear specialist.`)}`;

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Contact Us</span>
      </nav>

      {/* Header */}
      <div className="max-w-3xl space-y-3 pb-6 border-b border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Melbourne, Victoria
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Contact Theatricalz
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Need a quote, a stock check, order help or advice on compatibility? Call, message us on WhatsApp or send an enquiry below and our Melbourne team will get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              Contact Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm font-semibold">Melbourne Warehouse</strong>
                  <span className="text-slate-300">{CONTACT.address}</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Melbourne CBD · Victoria 3000</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm font-semibold">Phone Contact</strong>
                  <a href={`tel:${CONTACT.phone}`} className="text-slate-300 hover:text-amber-400 font-mono text-sm">
                    {CONTACT.phoneDisplay}
                  </a>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Phone or WhatsApp</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm font-semibold">Sales & Quotes</strong>
                  <a href={`mailto:${CONTACT.email}`} className="text-slate-300 hover:text-amber-400 text-sm">
                    sales&#64;theatricalz.com.au
                  </a>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Invoicing, quotes, and equipment financing</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm font-semibold">Hours of Operation</strong>
                  <span className="text-slate-300">Monday – Friday: 8:30 AM – 6:00 PM AEST</span>
                  <span className="block text-slate-400">Saturday: 9:00 AM – 2:00 PM (Urgent shoot support)</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-4 border-t border-slate-800">
              <a
                href={greetingWa}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-emerald-950/40"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4"
          >
            <h3 className="text-base font-bold text-white uppercase tracking-tight mb-2">
              Send an Equipment Enquiry
            </h3>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Cameron Smith"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@production.com.au"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0489 989 442"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Enquiry Topic</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Gear Advice & Quote">Gear Advice & Quote</option>
                  <option value="Stock Availability Check">Stock Availability Check</option>
                  <option value="Pay in 4 & Equipment Financing">Pay in 4 & Equipment Financing</option>
                  <option value="Cryptocurrency Payment Question">Cryptocurrency Payment Question</option>
                  <option value="Urgent Courier Dispatch">Urgent Courier Dispatch</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-300 mb-1">Your Message or Gear Requirements *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what gear package you need, your shoot dates, and delivery location..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Send Message to Gear Desk'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
