import { SITE } from '@/config/site';

export const metadata = {
  title: 'Compare Pro Cinema & Audio Gear',
  description: 'Compare pro cinema cameras, lenses, audio and lighting side by side at Theatricalz. Specs and AUD prices incl. GST on genuine Australian stock.',
  alternates: { canonical: `https://${SITE.domain}/compare/` },
  robots: { index: false, follow: true }, // a thin tool page: kept out of search results
};

export default function Layout({ children }) {
  return children;
}
