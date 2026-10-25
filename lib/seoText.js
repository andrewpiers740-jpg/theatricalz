// lib/seoText.js - keeps <title> and meta description inside search-engine display limits.
// The root layout appends " | Theatricalz" (14 characters) to every title, so the visible part must be <= 46.
const TITLE_MAX = 46;
const DESC_MIN = 120;
const DESC_MAX = 158;
const DANGLING = /\s+(with|for|and|or|of|to|the|a|in|\+|&|-|–|—|\(|\/)$/i;

function cutAtWord(text, max) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max + 1);
  const cut = slice.slice(0, slice.lastIndexOf(' ') > 0 ? slice.lastIndexOf(' ') : max).trim();
  return cut;
}

export function fitTitle(text, max = TITLE_MAX) {
  let t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  t = cutAtWord(t, max);
  while (DANGLING.test(t)) t = t.replace(DANGLING, '');
  return t.replace(/[\s,;:(\-–—+/]+$/, '');
}

// Trim to DESC_MAX on a word boundary (ending with a full stop when it cuts), pad short text with `extra`.
export function fitDescription(text, extra = '') {
  let d = String(text || '').replace(/\s+/g, ' ').trim();
  if (d.length < DESC_MIN && extra) {
    const sep = /[.!?]$/.test(d) ? ' ' : '. ';
    const padded = `${d}${d ? sep : ''}${extra}`.trim();
    if (padded.length <= DESC_MAX) d = padded;
  }
  if (d.length <= DESC_MAX) return d;
  let cut = cutAtWord(d, DESC_MAX - 1);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (lastStop >= DESC_MIN - 20) return cut.slice(0, lastStop + 1);
  while (DANGLING.test(cut)) cut = cut.replace(DANGLING, '');
  return `${cut.replace(/[\s,;:(\-–—+/]+$/, '')}…`;
}
