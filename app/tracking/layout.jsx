import { SITE } from '@/config/site';

export const metadata = {
  title: 'Track Your Order',
  description: 'Track your Theatricalz order from our Melbourne dispatch desk. Enter your order reference to check the status of your gear.',
  alternates: { canonical: `https://${SITE.domain}/tracking/` },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) {
  return children;
}
