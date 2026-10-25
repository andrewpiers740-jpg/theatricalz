'use client';

import { useEffect } from 'react';
import { CRYPTO_TOKENS, WALLETS, getNetworks } from '@/config/wallets';

// Controlled payment picker used by the checkout page and the cart drawer.
//   pay      : { type: 'bank-transfer' | 'payid' | 'crypto', token: '', network: '' }
//   onChange : (nextPay) => void
//   onReady  : (token, networkId) => void  - called once a token (and network, if it has several) is chosen
export default function PaymentMethodPicker({ pay, onChange, onReady, selectClassName, country = 'Australia' }) {
  // PayID and OSKO are Australian-only; customers overseas pay by international bank transfer or crypto.
  const isAU = country === 'Australia';
  useEffect(() => {
    if (!isAU && pay.type === 'payid') onChange({ type: 'bank-transfer', token: '', network: '' });
  }, [isAU, pay.type]); // eslint-disable-line react-hooks/exhaustive-deps
  const tokens = CRYPTO_TOKENS.filter((t) => getNetworks(t).length > 0);
  const networks = pay.token ? getNetworks(pay.token) : [];
  const needsNetwork = networks.length > 1;
  const cls =
    selectClassName || 'w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white';

  const setType = (type) => onChange({ type, token: '', network: '' });

  const setToken = (token) => {
    const nets = token ? getNetworks(token) : [];
    if (nets.length === 1) {
      onChange({ type: 'crypto', token, network: nets[0].id });
      onReady?.(token, nets[0].id);
    } else {
      onChange({ type: 'crypto', token, network: '' });
    }
  };

  const setNetwork = (network) => {
    onChange({ ...pay, network });
    if (network) onReady?.(pay.token, network);
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="pay-method" className="block text-slate-300 font-semibold mb-1">Payment Method</label>
        <select id="pay-method" value={pay.type} onChange={(e) => setType(e.target.value)} className={cls}>
          <option value="bank-transfer">{isAU ? 'Bank Transfer (OSKO)' : 'International Bank Transfer'}</option>
          {isAU ? <option value="payid">PayID</option> : null}
          <option value="crypto">Cryptocurrency — 10% Discount</option>
        </select>
        {pay.type !== 'crypto' ? (
          <p className="mt-1 text-[11px] text-slate-500">
            {isAU
              ? 'We email you payment details after you place your order.'
              : 'We email you international bank transfer details (in AUD) after you place your order. Your bank may charge transfer fees.'}
          </p>
        ) : null}
      </div>

      {pay.type === 'crypto' ? (
        <div>
          <label htmlFor="pay-token" className="block text-slate-300 font-semibold mb-1">Crypto Token</label>
          <select id="pay-token" value={pay.token} onChange={(e) => setToken(e.target.value)} className={cls}>
            <option value="">Select a token…</option>
            {tokens.map((t) => (
              <option key={t} value={t}>
                {WALLETS[t].name} ({t})
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {pay.type === 'crypto' && pay.token && needsNetwork ? (
        <div>
          <label htmlFor="pay-network" className="block text-slate-300 font-semibold mb-1">Network</label>
          <select id="pay-network" value={pay.network} onChange={(e) => setNetwork(e.target.value)} className={cls}>
            <option value="">Select a network…</option>
            {networks.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
