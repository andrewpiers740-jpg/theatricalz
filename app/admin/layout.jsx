import { AdminPasscodeProvider } from '@/components/admin/AdminPasscodeContext';
import PasscodeGate from '@/components/admin/PasscodeGate';
import AdminNav from '@/components/admin/AdminNav';

export const metadata = {
  title: 'Reply Portal & Dispatch Hub — Theatricalz Admin',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AdminLayout({ children }) {
  return (
    <AdminPasscodeProvider>
      <PasscodeGate>
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
          <AdminNav />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </PasscodeGate>
    </AdminPasscodeProvider>
  );
}
