"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, ArrowRightLeft, Settings, Store, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/products", label: "Produits", icon: Package },
  { href: "/categories", label: "Catégories", icon: Tag },
  { href: "/movements", label: "Mouvements", icon: ArrowRightLeft },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 border-r border-border h-screen flex flex-col p-4 gap-1 bg-sidebar-bg">
      <div className="flex items-center gap-3 px-3 py-4 mb-2">
        <div className="rounded-xl bg-primary text-white w-10 h-10 flex items-center justify-center shadow-md">
          <Store size={20} />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight">Stock</p>
          <p className="text-xs text-muted-foreground">Manager Pro</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="border-t border-border pt-3 mt-2">
          <div className="px-3 py-2">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <p className="text-[10px] uppercase tracking-wider text-primary mt-1">{user.role}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground w-full"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      )}
    </aside>
  );
}
