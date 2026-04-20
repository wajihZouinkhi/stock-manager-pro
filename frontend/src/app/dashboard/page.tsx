"use client";
import { useEffect, useState } from "react";
import { dashboardApi, DashboardStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Package, AlertTriangle, TrendingUp, Tag, ArrowUp, ArrowDown } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats().then((d) => { setStats(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b border-primary" />
      </div>
    </div>
  );

  const statCards = [
    { title: "Total produits", value: stats?.totalProducts ?? 0, icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Stock faible", value: stats?.lowStockCount ?? 0, icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-50" },
    { title: "Valeur totale", value: formatPrice(stats?.totalValue ?? 0), icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    { title: "Catégories", value: stats?.totalCategories ?? 0, icon: Tag, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Topbar title="Tableau de bord" subtitle="Vue d'ensemble de votre stock" />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{card.title}</p>
                        <p className="text-2xl font-bold mt-1">{card.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${card.bg}`}>
                        <Icon size={20} className={card.color} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {(stats?.weeklyMovements?.length ?? 0) > 0 && (
            <Card>
              <CardHeader><CardTitle>Mouvements 7 derniers jours</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={stats?.weeklyMovements ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="in" stroke="#22c55e" fill="#22c55e20" strokeWidth={2} name="Entrées" />
                    <Area type="monotone" dataKey="out" stroke="#ef4444" fill="#ef444420" strokeWidth={2} name="Sorties" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {(() => {
            const low = stats?.lowStockProducts ?? [];
            if (!low.length) return null;
            return (
              <Card>
                <CardHeader><CardTitle>Stock faible — Attention</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {low.map((p) => (
                      <li key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm font-medium">{p.name}</span>
                        <Badge variant="warning">{p.quantity} restants</Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
