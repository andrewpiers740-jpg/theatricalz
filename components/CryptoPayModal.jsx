'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, AlertCircle, ShieldCheck } from 'lucide-react';

// token   : an entry from WALLETS (name, symbol, ...)
// network : one of that token's networks (label, address, memo)
export default function CryptoPayModal({ open, token, network, totalLabel, amountAud, orderRef, loading, error, onClose, onPaid }) {
  const [rate, setRate] = useState(null); // AUD per 1 token
  const [rateTime, setRateTime] = useState('');
  const [rateState, setRateState] = useState('loading'); // loading | ok | error
  const [qrSrc, setQrSrc] = useState('');
  const [copied, setCopied] = useState('');
  const dialogRef = useRef(null);
  const address = network?.address || '';

  useEffect(() => {
    if (!open) return undefined;
    setCopied('');
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, loading, onClose]);

  useEffect(() => {
    let cancelled = false;
    setQrSrc('');
    if (!open || !address) return undefined;
    import('qrcode')
      .then((mod) => (mod.default || mod).toDataURL(address, { width: 320, margin: 1, errorCorrectionLevel: 'M' }))
      .then((url) => {
        if (!cancelled) setQrSrc(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, address]);

  // Live AUD rate: fetched when the popup opens and refreshed every 30 seconds while it is open.
  const symbol = token?.symbol;
  useEffect(() => {
    if (!open || !symbol) return undefined;
    let cancelled = false;
    setRate(null);
    setRateState('loading');
    const load = async () => {
      try {
        const res = await fetch('/api/crypto-rate/', { cache: 'no-store' });
        const data = await res.json();
        const r = data?.rates?.[symbol];
        if (cancelled) return;
        if (res.ok && data.success && r) {
          setRate(r);
          setRateTime(new Date(data.updatedAt).toLocaleTimeString('en-AU'));
          setRateState('ok');
        } else {
          setRateState((s) => (s === 'ok' ? s : 'error'));
        }
      } catch {
        if (!cancelled) setRateState((s) => (s === 'ok' ? s : 'error'));
      }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [open, symbol]);

  if (!open || !token || !network) return null;

  const quoteAmount =
    rate && amountAud ? (amountAud / rate).toLocaleString('en-US', { minimumFractionDigits: token.decimals, maximumFractionDigits: token.decimals, useGrouping: false }) : null;
  const rateLabel = rate ? rate.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';

  const copy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      setCopied('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" role="presentation">
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" onClick={() => !loading && onClose()} aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="crypto-pay-title"
        className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-slate-900 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black/60 p-5 sm:p-6 space-y-4 text-white focus:outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Pay with {token.symbol}</div>
            <h2 id="crypto-pay-title" className="text-lg font-black text-white tracking-tight">
              Send {token.name} to complete your order
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
            aria-label="Close payment window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Order reference</span>
            <span className="font-mono font-bold text-white">{orderRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Amount due (after 10% crypto discount)</span>
            <span className="font-mono font-bold text-amber-400">{totalLabel} AUD</span>
          </div>
        </div>

        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs space-y-1">
          <div className="text-slate-300">Send this amount of {token.symbol}</div>
          {rateState === 'ok' && quoteAmount ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xl font-black text-amber-300 break-all">
                  {quoteAmount} {token.symbol}
                </span>
                <button
                  type="button"
                  onClick={() => copy('amount', quoteAmount)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white shrink-0"
                  aria-label="Copy amount"
                >
                  {copied === 'amount' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-[11px] text-slate-400">
                Live rate: 1 {token.symbol} = A${rateLabel} · updated {rateTime} · refreshes every 30 seconds (CoinGecko)
              </div>
            </>
          ) : rateState === 'loading' ? (
            <div className="text-[11px] text-slate-400">Getting the live rate…</div>
          ) : (
            <div className="text-[11px] text-slate-300">
              The live rate is unavailable right now. Send the {token.symbol} equivalent of {totalLabel} AUD at the current market rate.
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <div className="bg-white p-3 rounded-2xl w-48 h-48 flex items-center justify-center">
            {qrSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrSrc} alt={`${token.name} wallet QR code`} width={176} height={176} className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs text-slate-500">Loading QR…</span>
            )}
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <div className="text-slate-400 mb-1">Network (use exactly this network)</div>
            <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 font-semibold text-white">{network.label}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">{token.symbol} wallet address</div>
            <div className="flex items-stretch gap-2">
              <code className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-300 break-all select-all">
                {address}
              </code>
              <button
                type="button"
                onClick={() => copy('address', address)}
                className="px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center justify-center"
                aria-label="Copy wallet address"
              >
                {copied === 'address' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {network.memo ? (
            <div>
              <div className="text-slate-400 mb-1">Memo / tag (required)</div>
              <div className="flex items-stretch gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-300 break-all select-all">
                  {network.memo}
                </code>
                <button
                  type="button"
                  onClick={() => copy('memo', network.memo)}
                  className="px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center justify-center"
                  aria-label="Copy memo"
                >
                  {copied === 'memo' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Sending to the wrong network or address can result in permanent loss. After you pay, tap the button below, then upload a screenshot of your payment on the next page.
          </span>
        </div>

        {error ? (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onPaid}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-black rounded-xl transition text-sm shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Placing your order…' : 'I have paid'}
        </button>
      </div>
    </div>
  );
}
