import Link from 'next/link';
import PageSchema from '@/components/PageSchema';
import { ChevronRight } from 'lucide-react';
import { SITE, CONTACT } from '@/config/site';

export const metadata = {
  title: 'Terms & Conditions',
  description:
    'Theatricalz terms of service: website usage, orders and payment, equipment availability, returns, and your consumer rights under Australian law.',
  alternates: {
    canonical: `https://${SITE.domain}/terms/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function TermsPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-white">
      <PageSchema type="WebPage" path="/terms/" name="Terms & Conditions" description="Terms of service for shopping at Theatricalz." />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Terms & Conditions</span>
      </nav>

      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Governing Law: Victoria, Australia
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Terms & Conditions of Service
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Please review the terms governing orders, equipment warranties, and digital interactions with THEATRICALZ PTY LTD.
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">1. Agreement to Terms</h2>
        <p>
          By accessing this website, placing orders via our online checkout, or submitting purchase instructions through our verified WhatsApp sales desk, you agree to be bound by these Terms and Conditions and our associated Delivery and Returns Policies. These terms are governed by the laws of the State of Victoria, Australia.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">2. Stock Availability & Order Confirmation</h2>
        <p>
          All orders are subject to acceptance and real-time inventory validation at our Melbourne warehouse. An automated order receipt acknowledges receipt of your request; a legally binding sales contract is formed upon issuance of our payment instructions or shipment dispatch confirmation. In the rare event an item is unexpectedly backordered by an Australian distributor, we will contact you immediately with an alternative delivery window or full refund.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">3. Payment Terms & Settlement Rails</h2>
        <p>
          Title to all equipment remains with THEATRICALZ PTY LTD until full payment has cleared in our bank account or has been confirmed on the relevant blockchain ledger (in the case of cryptocurrency transactions). Orders placed via PayID must cite the allocated order reference (e.g. TH-XXXXXX) for immediate automatic reconciliation.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">4. Limitation of Liability</h2>
        <p>
          Except where prohibited by the Australian Consumer Law, Theatricalz will not be liable for any indirect, incidental, or consequential damages resulting from production shoot delays, equipment downtime, or freight carrier delays. Production companies are advised to book and test critical gear well ahead of call sheet dates.
        </p>
      </div>
    </div>
  );
}
