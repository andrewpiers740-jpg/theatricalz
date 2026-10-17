import { SITE } from '@/config/site';

export const metadata = {
  title: 'Camera & Audio Gear Financing',
  description: 'Explore financing options for pro cinema cameras, lenses, lighting and audio gear at Theatricalz. AUD pricing incl. GST with genuine Australian stock.',
  alternates: { canonical: `https://${SITE.domain}/financing/` },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) {
  return children;
}
