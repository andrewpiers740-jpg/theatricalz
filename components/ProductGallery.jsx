'use client';

import { useState } from 'react';
import Image from 'next/image';
import ZoomImage from '@/components/ZoomImage';

// Product page gallery: large image with a magnifier, and thumbnails that switch the large image.
export default function ProductGallery({ images = [], name, badge }) {
  const [active, setActive] = useState(0);
  const list = images.filter(Boolean);
  const current = list[active] || list[0];

  return (
    <div className="space-y-4">
      <div className="relative bg-white aspect-[4/3] rounded-3xl overflow-hidden flex items-center justify-center border border-slate-700/60 shadow-2xl shadow-black/40 ring-1 ring-amber-500/10">
        {current ? (
          <ZoomImage
            key={current}
            src={current}
            alt={active === 0 ? name : `${name} view ${active + 1}`}
            sizes="(max-width: 1024px) 100vw, 58vw"
            zoom={2.4}
            priority={active === 0}
            imageClassName="object-contain p-8"
          />
        ) : (
          <div className="text-slate-400">No Image Available</div>
        )}

        {badge && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-lg bg-slate-950 text-amber-400 border border-amber-500/40 text-xs font-black uppercase tracking-wider shadow">
              {badge}
            </span>
          </div>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex flex-wrap gap-3" role="group" aria-label="Product images">
          {list.map((imgUrl, i) => (
            <button
              key={imgUrl}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${list.length}`}
              aria-pressed={i === active}
              className={`w-20 h-20 rounded-xl bg-white p-2 border relative overflow-hidden transition ${
                i === active ? 'border-amber-500 ring-2 ring-amber-500/40' : 'border-slate-700 hover:border-amber-500/60'
              }`}
            >
              <Image src={imgUrl} alt="" fill sizes="80px" className="object-contain p-1" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
