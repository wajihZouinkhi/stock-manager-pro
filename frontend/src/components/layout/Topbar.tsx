import { LucideIcon, Bell, Sun, Moon } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
