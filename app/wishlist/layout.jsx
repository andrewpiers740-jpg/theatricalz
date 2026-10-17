import { SITE } from '@/config/site';

export const metadata = {
  title: 'Your Wishlist',
  description: 'Your saved Theatricalz gear wishlist of pro cinema, photo, video and audio equipment, priced in AUD including GST.',
  alternates: { canonical: `https://${SITE.domain}/wishlist/` },
  robots: { index: false, follow: true },
};

export default function Layout({ children }) {
  return children;
}
