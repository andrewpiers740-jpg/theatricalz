import Link from 'next/link';
import { RotateCcw, ShieldCheck, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { SITE, CONTACT } from '@/config/site';

export const metadata = {
  title: 'Returns & Warranty Policy',
  description:
    '30-day returns on eligible unopened items, Australian Consumer Law protections and local manufacturer warranty support for camera, audio, lighting and music gear.',
  alternates: {
    canonical: `https://${SITE.domain}/returns/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function ReturnsPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-white">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Returns & Warranty</span>
      </nav>

      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Australian Consumer Law Protection
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Returns & Manufacturer Warranty Policy
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Confidence in every piece of equipment. Read our 30-day return policy and warranty repair commitments.
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">30-Day Return Policy for Eligible Gear</h2>
        <p>
          We provide a 30-day change-of-mind return window for all eligible products. Products that are not eligible for return will be noted. To qualify, brand-new, factory-sealed equipment must remain unopened in its original manufacturer packaging with all serial number labels, inspection seals, plastic wrapping, and included accessories intact.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">Australian Consumer Law (ACL) Guarantees</h2>
        <p>
          Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the goods repaired or replaced if the goods fail to be of acceptable quality and the failure does not amount to a major failure.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">Dead-On-Arrival (DOA) & Transit Damage</h2>
        <p>
          If your item arrives with external courier damage or exhibits an out-of-the-box hardware defect within 7 days of delivery, contact our Melbourne dispatch desk immediately. We will arrange priority express courier pickup at our expense and issue an immediate replacement unit from our Melbourne warehouse.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">How to Initiate a Return or Warranty Claim</h2>
        <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
          <li>Email our returns desk at <a href={`mailto:${CONTACT.email}`} className="text-amber-400 underline">sales&#64;theatricalz.com.au</a> or message our WhatsApp desk at <strong>+61 489 989 442</strong> with your order reference (e.g. TH-XXXXXX).</li>
          <li>Our technicians will verify your serial number and provide an authorized Return Merchandise Authorization (RMA) shipping label.</li>
          <li>Carefully re-pack the gear into its protective shipping outer carton and drop off at any StarTrack or Australia Post outlet.</li>
          <li>Upon inspection at 3 Kirks Lane, Melbourne, your refund or replacement will be processed within 2 business days.</li>
        </ol>
      </div>
    </div>
  );
}
