"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { productsApi, Product, StockMovement } from "@/lib/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { ArrowUp, ArrowDown, Settings2 } from "lucide-react";

export default function MovementsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rows, setRows] = useState<(StockMovement & { productName: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const ps = await productsApi.getAll();
        setProducts(ps);
        const all = await Promise.all(ps.map(async (p) => {
          try { return (await productsApi.getMovements(p.id)).map((m) => ({ ...m, productName: p.name })); }
          catch { return []; }
        }));
        const merged = all.flat().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 200);
        setRows(merged);
      } catch (e: any) { toast.error(e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  const typeBadge = (t: string) => {
    if (t === "IN") return <Badge className="bg-green-500/15 text-green-600"><ArrowUp size={12} className="mr-1" />Entrée</Badge>;
    if (t === "OUT") return <Badge className="bg-red-500/15 text-red-600"><ArrowDown size={12} className="mr-1" />Sortie</Badge>;
    return <Badge className="bg-blue-500/15 text-blue-600"><Settings2 size={12} className="mr-1" />Ajustement</Badge>;
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Topbar title="Mouvements" subtitle={`${rows.length} mouvements récents`} />
        <div className="p-6">
          <Card>
            <CardHeader><CardTitle>Historique</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Chargement...</div>
              ) : rows.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">Aucun mouvement</div>
              ) : (
                <Table>
                  <THead>
                    <TR><TH>Date</TH><TH>Type</TH><TH>Produit</TH><TH className="text-right">Quantité</TH><TH>Motif</TH></TR>
                  </THead>
                  <TBody>
                    {rows.map((m) => (
                      <TR key={m.id}>
                        <TD className="text-sm text-muted-foreground">{formatDate(m.createdAt)}</TD>
                        <TD>{typeBadge(m.type)}</TD>
                        <TD className="font-medium">{m.productName}</TD>
                        <TD className="text-right font-mono">{m.quantity}</TD>
                        <TD className="text-sm text-muted-foreground">{m.reason || "—"}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
