import { CONTACT } from '@/config/site';

// Email address shown or linked in public HTML. The "@" is written as &#64; inside the markup so the address
// never appears as plain text in the page source (basic protection against address harvesting). Browsers
// decode the entity, so visitors see and click a normal address.
export function encodeAt(value) {
  return String(value).replace(/@/g, '&#64;');
}

export default function EmailLink({ className = '', subject = '' }) {
  const addr = encodeAt(CONTACT.email);
  const href = `mailto:${addr}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  const html = `<a href="${href}" class="${className}">${addr}</a>`;
  return <span className="contents" dangerouslySetInnerHTML={{ __html: html }} />;
}
