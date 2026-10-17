import { SITE } from '@/config/site';

export const metadata = {
  title: 'Compare Pro Cinema & Audio Gear',
  description: 'Compare pro cinema cameras, lenses, audio and lighting side by side at Theatricalz. Specs and AUD prices incl. GST on genuine Australian stock.',
  alternates: { canonical: `https://${SITE.domain}/compare/` },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) {
  return children;
}
