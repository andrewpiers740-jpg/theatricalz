import './globals.css';
import { SITE, BRAND, CONTACT } from '@/config/site';
import { CartProvider } from '@/lib/cartContext';
import AnnouncementBar from '@/components/AnnouncementBar';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ChatHub from '@/components/ChatHub';

export const metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: BRAND.description,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — Australia's Premier Pro Cinema, Photo & Audio Supply`,
    description: BRAND.description,
    url: `https://${SITE.domain}/`,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: `${SITE.name} Pro Cinema & Broadcast Gear Melbourne`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Pro Cinema, Photo & Audio Supply`,
    description: BRAND.description,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=630&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
    'google-site-verification': SITE.gscVerification,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.locale} className="scroll-smooth bg-slate-950 text-slate-100">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/js/webmcp.js" defer></script>
      </head>
      <body className="min-h-screen flex flex-col bg-slate-950 antialiased selection:bg-amber-500 selection:text-slate-950">
        <CartProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg shadow-lg"
          >
            Skip to main content
          </a>

          <AnnouncementBar />
          <Nav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ChatHub />
        </CartProvider>
      </body>
    </html>
  );
}
