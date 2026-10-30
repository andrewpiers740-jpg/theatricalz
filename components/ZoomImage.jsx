'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';

// Product image with a magnifier: while a mouse pointer is over it the image is enlarged around the cursor
// (move the mouse to look at details). Touch and keyboard users get the normal image, so taps still follow links.
// Fills its parent, which must be `relative`.
export default function ZoomImage({ src, alt, sizes, zoom = 1.8, priority = false, imageClassName = 'object-contain p-4', showHint = true }) {
  const frameRef = useRef(null);
  const imgRef = useRef(null);

  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;
    const r = frame.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = `scale(${zoom})`;
    img.style.transition = 'transform 120ms ease-out';
  };
  const onLeave = () => {
    const img = imgRef.current;
    if (!img) return;
    img.style.transform = 'scale(1)';
    img.style.transition = 'transform 250ms ease-out';
  };

  return (
    <div ref={frameRef} onPointerMove={onMove} onPointerLeave={onLeave} className="group/zoom absolute inset-0 overflow-hidden cursor-zoom-in">
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={imageClassName} referrerPolicy="no-referrer" />
      </div>
      {showHint ? (
        <span aria-hidden="true" className="pointer-events-none absolute bottom-2 right-2 z-10 rounded-full bg-slate-950/70 text-white p-1.5 opacity-0 group-hover/zoom:opacity-100 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5" />
        </span>
      ) : null}
    </div>
  );
}
