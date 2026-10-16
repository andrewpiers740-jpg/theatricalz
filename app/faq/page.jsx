import Link from 'next/link';
import { HelpCircle, ChevronRight, ArrowRight, ShieldCheck, Truck, Coins, CreditCard } from 'lucide-react';
import { FAQ, SITE, CONTACT } from '@/config/site';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Frequently Asked Questions & Support — Theatricalz',
  description:
    'Common questions regarding genuine Australian warranties, StarTrack delivery timeframes, 10% crypto discount, PayID, and Pay in 4 equipment financing.',
  alternates: {
    canonical: `https://${SITE.domain}/faq/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function FAQPage() {
  const faqSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `https://${SITE.domain}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Help & FAQ',
          item: `https://${SITE.domain}/faq/`,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={faqSchema} />

      <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-medium">Frequently Asked Questions</span>
        </nav>

        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Support & Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Everything you need to know about our Australian stock authenticity, insured express dispatch, Pay in 4 equipment financing, and 10% cryptocurrency discounts.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQ.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition"
            >
              <h2 className="text-base sm:text-lg font-bold text-white flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{item.question}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 pl-8 leading-relaxed font-sans">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-lg font-bold text-white">Need Further Technical Clarification?</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Our Melbourne cinema gear desk is ready to answer specific technical compatibility questions regarding lens mounts, wireless frequencies, and studio installations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact/"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
            >
              Contact Gear Desk
            </Link>
            <a
              href={`tel:${CONTACT.phone}`}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition border border-slate-700"
            >
              Call {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
