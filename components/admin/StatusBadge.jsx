// components/admin/StatusBadge.jsx - Status badge pill for orders and enquiries
export default function StatusBadge({ status, type = 'order' }) {
  const norm = (status || 'pending').toLowerCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let label = status;

  if (type === 'order') {
    switch (norm) {
      case 'pending':
        colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        label = 'Pending Payment';
        break;
      case 'details-sent':
        colorClasses = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        label = 'Details Sent';
        break;
      case 'payment-received':
        colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        label = 'Payment Confirmed';
        break;
      case 'dispatched':
        colorClasses = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
        label = 'Dispatched Express';
        break;
      case 'cancelled':
        colorClasses = 'bg-red-500/10 text-red-400 border-red-500/30';
        label = 'Cancelled';
        break;
      default:
        label = status;
    }
  } else {
    // Enquiry
    switch (norm) {
      case 'new':
        colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        label = 'New Enquiry';
        break;
      case 'replied':
        colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        label = 'Replied';
        break;
      case 'archived':
        colorClasses = 'bg-slate-800 text-slate-400 border-slate-700';
        label = 'Archived';
        break;
      default:
        label = status;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
    >
      {label}
    </span>
  );
}
