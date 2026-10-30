'use client';

import { useEffect, useRef, useState } from 'react';

// Tabbed sections under the product hero (Description, Technical Specifications, Warranty, Delivery).
// Every panel is in the page HTML (inactive ones are only hidden), so search engines read all of it.
// Keyboard: arrow keys, Home and End move between tabs. A link such as #warranty opens that tab.
export default function ProductTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].id);
  const refs = useRef({});

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent((window.location.hash || '').replace('#', ''));
      if (id && tabs.some((t) => t.id === id)) setActive(id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [tabs]);

  const onKeyDown = (e, index) => {
    let next = null;
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  };

  return (
    <section aria-label="Product information" className="pt-8 border-t border-slate-800">
      <div role="tablist" aria-label="Product information" className="flex gap-1 overflow-x-auto border-b border-slate-800 -mb-px">
        {tabs.map((t, i) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => { refs.current[t.id] = el; }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`shrink-0 px-4 sm:px-5 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                selected ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-300 hover:text-white hover:border-slate-600'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== t.id}
          className="pt-8 max-w-5xl"
        >
          {t.content}
        </div>
      ))}
    </section>
  );
}
