import { SITE } from '@/config/site';

export const metadata = {
  title: 'Contact Our Melbourne Gear Desk',
  description: 'Contact Theatricalz in Melbourne for pro cinema, photo and audio gear advice, quotes and order help by phone, WhatsApp or email. Real crew, fast replies.',
  alternates: { canonical: `https://${SITE.domain}/contact/` },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) {
  return children;
}
