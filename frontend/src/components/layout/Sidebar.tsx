'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tag, ArrowRightLeft, Settings, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/products', label: 'Produits', icon: Package },
  { href: '/categories', label: 'Catégories', icon: Tag },
  { href: '/movements', label: 'Mouvements', icon: ArrowRightLeft },
  { href: '/settings', label: 'Paramètres', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="width: 240px; border-right: 1px solid var(--border); height: 100vh; display: flex; flex-direction: column; padding: 1.5rem 1rem; gap: 0.5rem; background: var(--sidebar-bg)">
      <div className="flex items-center gap-3 px-3 py-4 mb-2">
        <div className="text-2xl rounded-xl bg-primary text-white w10 h10 flex items-center justify-center shadow-md">
          <Store size={20} />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight">Stock</p>
          <p className="text-xs text-muted-foreground">Manager Pro</p>
        </div>
      </div>
      {navItems.map(item => {
        const IsActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              IsActive ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
