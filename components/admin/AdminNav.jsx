'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminPasscode } from './AdminPasscodeContext';
import { LayoutDashboard, ShoppingBag, MessageSquare, ExternalLink, LogOut } from 'lucide-react';
import { SITE } from '@/config/site';

export default function AdminNav() {
  const pathname = usePathname();
  const { signOut } = useAdminPasscode();

  const links = [
    { href: '/admin/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders/', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/enquiries/', label: 'Enquiries', icon: MessageSquare },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/admin/" className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-white font-bold text-lg tracking-tight">Theatricalz</span>
              <span className="text-xs bg-amber-500/10 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-500/30">
                Portal v11.1
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/admin/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-slate-800 transition"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-md hover:bg-red-950/40 border border-red-900/40 transition"
              title="Sign Out of Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="sm:hidden flex border-t border-slate-800/80 px-2 py-1 justify-around bg-slate-900/90">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/admin/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
