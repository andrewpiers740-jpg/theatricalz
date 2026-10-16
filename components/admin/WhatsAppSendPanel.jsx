'use client';

import { useState } from 'react';
import { MessageCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { waLinkTo, waMessageText } from '@/lib/whatsapp';

export default function WhatsAppSendPanel({ customerPhone, messageBody, customerName }) {
  const [copied, setCopied] = useState(false);

  const cleanPhone = customerPhone ? customerPhone.replace(/[^0-9]/g, '') : '';
  const waUrl = cleanPhone ? waLinkTo(cleanPhone, messageBody) : '#';
  const rawFormattedMessage = waMessageText(messageBody);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(rawFormattedMessage);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = rawFormattedMessage;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">WhatsApp Direct Reply</h4>
            <p className="text-xs text-slate-400">
              Send directly to {customerName || 'customer'} ({customerPhone || 'no phone on file'})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Message Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy WhatsApp Text
            </>
          )}
        </button>
      </div>

      <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/80 mb-4 max-h-48 overflow-y-auto">
        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans">
          {rawFormattedMessage}
        </pre>
      </div>

      {cleanPhone ? (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition"
        >
          <span>Open in WhatsApp Web / App</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      ) : (
        <p className="text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded p-2 text-center">
          Customer did not provide a mobile phone number for direct WhatsApp linking. Copy the text above to reply via alternate channels.
        </p>
      )}
    </div>
  );
}
