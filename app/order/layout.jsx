import { SITE } from '@/config/site';

export const metadata = {
  title: 'Order Payment',
  description: 'Theatricalz order payment pages. Use the link in your payment-details email to view and copy your order payment information.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }) {
  return children;
}
