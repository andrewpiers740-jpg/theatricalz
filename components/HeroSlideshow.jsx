'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Background slideshow for hero sections: 3 images, one shown at a time, swapping every 5 seconds with a
// "pop" (fade + slight scale-in). Purely decorative, so it is hidden from assistive tech. With
// prefers-reduced-motion it stays on the first image. Place inside a `relative overflow-hidden` parent.
export default function HeroSlideshow({ images, interval = 5000, priorityFirst = true }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [paused, images.length, interval]);

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={priorityFirst && i === 0}
          className={`object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
            i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        />
      ))}
      <div className="absolute bottom-3 right-4 flex gap-1.5 z-20" aria-hidden="true">
        {images.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
}
