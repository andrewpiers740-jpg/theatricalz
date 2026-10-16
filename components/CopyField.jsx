'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyField({ label, value, monospace = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
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
    <div className="bg-slate-900/40 border border-slate-700/60 rounded-lg p-3 hover:border-amber-500/50 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded font-medium transition-all ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-slate-700'
          }`}
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <div
        onClick={handleCopy}
        className={`cursor-pointer text-slate-100 select-all font-medium break-all text-sm sm:text-base py-0.5 ${
          monospace ? 'font-mono' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}
