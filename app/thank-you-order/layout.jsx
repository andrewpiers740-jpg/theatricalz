import { SITE } from '@/config/site';

export const metadata = {
  title: 'Order Received',
  description: 'Thank you for your Theatricalz order. Watch your inbox for a follow-up email with payment details from our Melbourne team.',
  alternates: { canonical: `https://${SITE.domain}/thank-you-order/` },
  robots: { index: false, follow: true },
};

export default function Layout({ children }) {
  return children;
}
