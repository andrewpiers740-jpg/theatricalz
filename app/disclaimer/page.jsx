import Link from 'next/link';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { SITE, CONTACT, COMPLIANCE } from '@/config/site';
import { DISCLAIMERS } from '@/lib/disclaimers';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Product Disclaimer',
  description:
    'Important notices for prop money, radio and wireless gear, drones, cameras, bladed tools and lithium batteries sold by Theatricalz, plus our general disclaimer.',
  alternates: {
    canonical: `https://${SITE.domain}/disclaimer/`,
  },
};

export default function DisclaimerPage() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Product Disclaimer',
      url: `https://${SITE.domain}/disclaimer/`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
        { '@type': 'ListItem', position: 2, name: 'Disclaimer', item: `https://${SITE.domain}/disclaimer/` },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={schema} />
      <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-medium">Disclaimer</span>
        </nav>

        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Important Notices</div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Product Disclaimer</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Some products we sell are regulated or need extra care. Products with a notice on their product page are listed below. Nothing here limits your rights under the Australian Consumer Law.
          </p>
        </div>

        <nav aria-label="Disclaimer sections" className="flex flex-wrap gap-2 text-xs">
          {Object.entries(DISCLAIMERS).map(([k, d]) => (
            <a key={k} href={`#${k}`} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/60 hover:text-white transition">
              {d.title}
            </a>
          ))}
          <a href="#general" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/60 hover:text-white transition">
            General
          </a>
        </nav>

        {Object.entries(DISCLAIMERS).map(([k, d]) => (
          <section key={k} id={k} className="scroll-mt-28 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white uppercase tracking-tight">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{d.title}</span>
            </h2>
            {d.body.map((para, i) => (
              <p key={i} className="text-sm text-slate-300 leading-relaxed">{para}</p>
            ))}
          </section>
        ))}

        <section id="general" className="scroll-mt-28 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">General Disclaimer</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{COMPLIANCE.disclaimer}</p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Product images, descriptions and specifications are provided for guidance and are based on information from manufacturers and suppliers. Specifications, included accessories and packaging can change without notice, so please contact us if a detail is important to your purchase.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Questions about a product or a notice on this page? <Link href="/contact/" className="text-amber-400 underline">Contact our team</Link> or call {CONTACT.phoneDisplay}.
          </p>
        </section>
      </div>
    </>
  );
}
