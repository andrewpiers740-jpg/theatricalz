import Link from 'next/link';
import { DollarSign, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { SITE, CONTACT } from '@/config/site';

export const metadata = {
  title: 'Sales Policy & Australian GST',
  description:
    'Australian sales policy, 10% GST breakdown on all tax invoices, payment rail verification, and corporate purchase order guidelines.',
  alternates: {
    canonical: `https://${SITE.domain}/sales-policy/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function SalesPolicyPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-white">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium">Sales Policy</span>
      </nav>

      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
          GST & Commercial Billing
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Sales & Tax Invoice Policy
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Transparent Australian pricing, Goods and Services Tax (GST) compliance, and commercial procurement terms.
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Pricing Display: AUD Including 10% Australian GST</h2>
        <p>
          All prices displayed across the Theatricalz storefront, product cards, category indexes, and quotation documents are quoted in Australian Dollars (AUD) and are inclusive of the mandatory 10% Australian Goods and Services Tax (GST), unless explicitly labeled otherwise for commercial tax export calculations.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">Compliant Australian Tax Invoices</h2>
        <p>
          A formal Australian Tax Invoice displaying our registered business details (ABN: {SITE.abn}, ACN: {SITE.acn}, THEATRICALZ PTY LTD) is automatically generated and emailed to your nominated contact address immediately upon order confirmation. Every invoice itemizes the net amount, the 10% GST component, and the final total for straightforward business BAS reconciliation.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">Cryptocurrency 10% Discount Settlement</h2>
        <p>
          For customers paying via cryptocurrency rails (Bitcoin / BTC, Tether / USDT, Ethereum / ETH, BNB, or Solana / SOL), our checkout applies an instant 10% discount to your order subtotal. Tax invoices reflect both the standard retail list price and the applied promotional crypto settlement deduction.
        </p>

        <h2 className="text-xl font-bold text-white uppercase tracking-tight pt-4">Corporate & Educational Purchase Orders</h2>
        <p>
          We accommodate formal Purchase Orders (PO) from verified Australian universities, state schools, broadcasters, and registered production agencies. Contact our commercial desk at <a href={`mailto:${CONTACT.email}`} className="text-amber-400 underline">sales&#64;theatricalz.com.au</a> with your requisition documentation to establish 30-day corporate trading terms.
        </p>
      </div>
    </div>
  );
}
