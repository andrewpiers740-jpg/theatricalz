import { SITE } from '@/config/site';

export const metadata = {
  title: 'Camera & Audio Gear Financing',
  description: 'Split eligible camera, audio, lighting and music gear purchases into 4 interest-free payments at Theatricalz. AUD pricing incl. GST, genuine Australian stock.',
  alternates: { canonical: `https://${SITE.domain}/financing/` },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) {
  return children;
}
