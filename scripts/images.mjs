// scripts/images.mjs - Normalise product photos onto a white 4:3 canvas as WebP.
// Usage: node scripts/images.mjs <products.json> <sourceDir> <outDir>
// products.json: [{ slug, images: [filename, ...] }] — outputs <slug>.webp, <slug>-2.webp, ...
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const [, , listFile, srcDir, outDir] = process.argv;
const W = 1000, H = 750, FILL = 0.9, MAX_BYTES = 145 * 1024;
const list = JSON.parse(fs.readFileSync(listFile, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

async function processOne(src, dest) {
  const meta = await sharp(src).metadata();
  let img = sharp(src).flatten({ background: '#ffffff' });
  // Trim uniform border, but keep the trim only if it doesn't collapse the image
  const trimmed = await img.clone().trim({ threshold: 12 }).toBuffer({ resolveWithObject: true }).catch(() => null);
  let buf = await img.toBuffer();
  if (trimmed && trimmed.info.width > meta.width * 0.12 && trimmed.info.height > meta.height * 0.12) buf = trimmed.data;
  const m = await sharp(buf).metadata();
  const scale = Math.min((W * FILL) / m.width, (H * FILL) / m.height);
  let resized = sharp(buf).resize(Math.round(m.width * scale), Math.round(m.height * scale), { kernel: 'lanczos3' });
  if (scale > 1.1) resized = resized.sharpen({ sigma: 1 });
  const inner = await resized.toBuffer();
  const canvas = sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } }).composite([{ input: inner, gravity: 'center' }]);
  let q = 86, out;
  do { out = await canvas.clone().webp({ quality: q }).toBuffer(); q -= 6; } while (out.length > MAX_BYTES && q >= 40);
  fs.writeFileSync(dest, out);
  return { bytes: out.length, srcShort: Math.min(m.width, m.height) };
}

let total = 0, n = 0;
for (const p of list) {
  for (let i = 0; i < p.images.length; i++) {
    const name = i === 0 ? `${p.slug}.webp` : `${p.slug}-${i + 1}.webp`;
    const r = await processOne(path.join(srcDir, p.images[i]), path.join(outDir, name));
    total += r.bytes; n++;
  }
}
console.log(`[images] ${n} images written to ${outDir}, ${(total / 1024 / 1024).toFixed(1)} MB total`);
