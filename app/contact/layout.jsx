import { SITE } from '@/config/site';

export const metadata = {
  title: 'Contact Our Melbourne Team',
  description: 'Contact Theatricalz in Melbourne for gear advice, quotes and order help by phone, WhatsApp or email. Genuine Australian stock, local support.',
  alternates: { canonical: `https://${SITE.domain}/contact/` },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) {
  return children;
}
