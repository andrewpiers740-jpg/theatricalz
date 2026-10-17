import { SITE } from '@/config/site';

export const metadata = {
  title: 'Search Gear',
  description: 'Search the Theatricalz catalogue of pro cinema cameras, lenses, audio, lighting and support gear. AUD prices incl. GST on genuine Australian stock.',
  alternates: { canonical: `https://${SITE.domain}/search/` },
  robots: { index: false, follow: true },
};

export default function Layout({ children }) {
  return children;
}
