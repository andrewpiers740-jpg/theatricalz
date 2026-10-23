import Link from 'next/link';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { SITE, CONTACT } from '@/config/site';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Our privacy policy explains how customer information is collected, stored, and protected in compliance with the Privacy Act 1988 (Cth) and GDPR principles.',
  alternates: {
    canonical: `https://${SITE.domain}/privacy/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function PrivacyPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-white">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Privacy Policy</span>
      </nav>

      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Privacy Act 1988 (Cth) & GDPR Compliant
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          How Theatricalz collects, utilizes, and safeguards your personal and business transaction data.
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Information We Collect</h2>
        <p>
          We only collect personal information strictly required to process your equipment orders, deliver tax invoices, coordinate StarTrack express consignments, and provide technical warranty support. This includes your name, company/ABN, delivery street address, phone number, email address, and order transaction history.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">No Third-Party Data Selling</h2>
        <p>
          Theatricalz never sells, rents, or monetizes customer records to external marketing networks or data brokers. Information is shared strictly with essential operational partners: courier logistics networks (StarTrack / Australia Post) for delivery completion and payment rails for transaction settlement.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">Data Security & Storage</h2>
        <p>
          All electronic communications, checkout submissions, and payment instructions are transmitted across 256-bit TLS encrypted SSL connections. Our internal database records are safeguarded with strict role-based access control and passcode authentication.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">Your Rights & Contacting Us</h2>
        <p>
          You have the right to request access to the personal data we hold about you, request corrections, or request deletion of your marketing contact details. Enquiries should be directed to our Privacy Officer at <a href={`mailto:${CONTACT.email}`} className="text-amber-400 underline">sales&#64;theatricalz.com.au</a>.
        </p>
      </div>
    </div>
  );
}
