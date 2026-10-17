'use client';

import { useState } from 'react';
import { useAdminPasscode } from './AdminPasscodeContext';
import { Lock, ShieldAlert, Film, Key } from 'lucide-react';
import { SITE } from '@/config/site';

export default function PasscodeGate({ children }) {
  const { isAuthorized, setPasscode } = useAdminPasscode();
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthorized) {
    return <>{children}</>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/orders', {
        headers: {
          'X-Admin-Passcode': inputCode.trim(),
        },
      });

      if (res.ok) {
        setPasscode(inputCode.trim());
      } else if (res.status === 401) {
        setError('Incorrect passcode. Access denied.');
      } else if (res.status === 503) {
        setError('Server admin passcode not set or service unavailable.');
      } else {
        setError('Authorization error. Please try again.');
      }
    } catch (err) {
      setError('Connection failure. Check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle amber ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Theatricalz Reply Portal
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Passcode-gated command hub for Melbourne pro dispatch desk
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-800/80 text-red-300 text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-passcode"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
            >
              Enter Passcode
            </label>
            <div className="relative">
              <input
                id="admin-passcode"
                type="password"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center tracking-widest text-lg font-mono"
                autoFocus
                required
              />
              <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-4 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Unlock Portal'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          Theatricalz Australia · 3 Kirks Lane, Melbourne VIC 3000
        </div>
      </div>
    </div>
  );
}
