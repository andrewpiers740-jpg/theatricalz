'use client';

import { useState } from 'react';
import { MessageSquare, MessageCircle, Phone, Mail, X, HelpCircle, ArrowRight, Film } from 'lucide-react';
import { CONTACT, SITE } from '@/config/site';

export default function ChatHub() {
  const [isOpen, setIsOpen] = useState(false);

  const greetingWa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi ${SITE.name}, `)}`;

  const QUICK_QUESTIONS = [
    { text: 'Is the Sony FX3 or C70 in stock today?', query: 'Hi Theatricalz, I wanted to check current stock availability for the Sony FX3 / Canon C70 in Melbourne.' },
    { text: 'How do I claim the 10% Crypto discount?', query: 'Hi Theatricalz, I would like to pay with crypto (BTC/USDT) to get the 10% discount on my order.' },
    { text: 'Urgent shoot: Can I get overnight courier to Sydney/Brisbane?', query: 'Hi Theatricalz, I have an urgent shoot coming up and need StarTrack Express overnight delivery to my location.' },
    { text: 'Pay in 4 interest-free equipment financing', query: 'Hi Theatricalz, I would like to enquire about Pay in 4 interest-free installment options for my gear order.' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-3 rounded-full shadow-2xl shadow-amber-500/30 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-slate-950"
          aria-label="Open Pro Gear Chat Desk"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-slate-950 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950"></span>
          </div>
          <span className="text-sm font-bold tracking-tight">Gear Desk</span>
        </button>
      )}

      {/* Expanded Support Card */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-white">
          {/* Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none">Melbourne Gear Desk</h3>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online · 3 Kirks Lane, Melbourne</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Close Chat Desk"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Have technical questions regarding cinema camera mounts, wireless audio frequencies, or express dispatch? We’re on set and at the desk to help.
            </p>

            {/* Direct Channel Buttons */}
            <div className="space-y-2">
              <a
                href={greetingWa}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition group shadow-md shadow-emerald-950/40"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat on WhatsApp</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={`tel:${CONTACT.phone}`}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition group border border-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call {CONTACT.phoneDisplay}</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-400" />
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition group border border-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Email Sales Team</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-400" />
              </a>
            </div>

            {/* Quick Questions Pre-filler */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-amber-400" />
                <span>Common Enquiries</span>
              </div>
              <div className="space-y-1.5">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <a
                    key={idx}
                    href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(q.query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800/80 transition"
                  >
                    &ldquo;{q.text}&rdquo;
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
