'use client';

import Link from 'next/link';
import { COUNTRIES, addressConfig } from '@/config/countries';

const base = 'w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 transition';
const label = 'block text-slate-300 font-semibold mb-1';

// Delivery address for Australian and international customers: country, address, city, state/province, postcode/ZIP.
// `formData` + `setFormData` come from the parent form; the state value is reset when the country changes.
export default function AddressFields({ formData, setFormData }) {
  const cfg = addressConfig(formData.country);
  const set = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const setCountry = (e) => {
    const country = e.target.value;
    setFormData((p) => ({ ...p, country, state: country === 'Australia' ? 'VIC' : '' }));
  };

  return (
    <>
      <div>
        <label htmlFor="addr-country" className={label}>Country *</label>
        <select id="addr-country" name="country" value={formData.country} onChange={setCountry} className={base} required autoComplete="country-name">
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <p className="mt-1 text-[11px] text-slate-500">
          We ship worldwide from Melbourne. See <Link href="/shipping/" className="text-amber-400 hover:underline">delivery times and restrictions</Link>.
        </p>
      </div>

      <div>
        <label htmlFor="addr-street" className={label}>Street Address *</label>
        <input id="addr-street" type="text" name="address" value={formData.address} onChange={set} placeholder="Street address, unit / apartment" className={base} required autoComplete="street-address" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label htmlFor="addr-city" className={label}>City *</label>
          <input id="addr-city" type="text" name="city" value={formData.city} onChange={set} placeholder="City / suburb" className={base} required autoComplete="address-level2" />
        </div>
        <div>
          <label htmlFor="addr-state" className={label}>{cfg.stateLabel}{cfg.states ? ' *' : ''}</label>
          {cfg.states ? (
            <select id="addr-state" name="state" value={formData.state} onChange={set} className={base} required>
              {formData.country !== 'Australia' ? <option value="">Select…</option> : null}
              {cfg.states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          ) : (
            <input id="addr-state" type="text" name="state" value={formData.state} onChange={set} className={base} autoComplete="address-level1" />
          )}
        </div>
        <div>
          <label htmlFor="addr-postcode" className={label}>{cfg.postLabel} *</label>
          <input id="addr-postcode" type="text" name="postcode" value={formData.postcode} onChange={set} placeholder={cfg.postPlaceholder} className={base} required autoComplete="postal-code" />
        </div>
      </div>
    </>
  );
}
