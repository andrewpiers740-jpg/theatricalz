import { SITE } from '@/config/site';

export const metadata = {
  title: 'Cart & Checkout',
  description: 'Review your Theatricalz cart and check out securely. AUD prices include GST on genuine Australian stock with official local warranties.',
  alternates: { canonical: `https://${SITE.domain}/cart/` },
  robots: { index: false, follow: true },
};

export default function Layout({ children }) {
  return children;
}
