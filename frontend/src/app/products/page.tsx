"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown } from "lucide-react";
import { productsApi, categoriesApi, Product, Category } from "@/lib/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";

type ProductForm = Partial<Product>;

const empty: ProductForm = { name: "", sku: "", price: 0, costPrice: 0, quantity: 0, minQuantity: 5, unit: "pcs", isActive: true };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductForm>(empty);
  const [stockOpen, setStockOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [stockForm, setStockForm] = useState({ type: "IN", quantity: 1, reason: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([productsApi.getAll({ search }), categoriesApi.getAll()]);
      setProducts(p); setCategories(c);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [search]);

  const save = async () => {
    try {
      if (editing.id) {
        await productsApi.update(editing.id, editing);
        toast.success("Produit mis à jour");
      } else {
        await productsApi.create(editing);
        toast.success("Produit créé");
      }
      setOpen(false); setEditing(empty); load();
    } catch (e: any) { toast.error(e.message); }
  };

  const remove = async (p: Product) => {
    if (!confirm(`Supprimer "${p.name}" ?`)) return;
    try { await productsApi.delete(p.id); toast.success("Supprimé"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  const adjustStock = async () => {
    if (!stockProduct) return;
    try {
      await productsApi.updateStock(stockProduct.id, stockForm);
      toast.success("Stock ajusté");
      setStockOpen(false); setStockProduct(null); load();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Topbar title="Produits" subtitle="Gérez votre catalogue" />
        <div className="p-6 space-y-4">
          <Card>
            <CardContent className="pt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Rechercher par nom ou SKU..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button onClick={() => { setEditing(empty); setOpen(true); }}>
                <Plus size={16} className="mr-1" /> Nouveau produit
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Chargement...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">Aucun produit</div>
              ) : (
                <Table>
                  <THead>
                    <TR>
                      <TH>Produit</TH><TH>SKU</TH><TH>Catégorie</TH>
                      <TH className="text-right">Prix</TH><TH className="text-right">Stock</TH>
                      <TH>Statut</TH><TH className="text-right">Actions</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {products.map((p) => {
                      const low = p.quantity <= p.minQuantity;
                      const out = p.quantity === 0;
                      return (
                        <TR key={p.id}>
                          <TD className="font-medium">{p.name}</TD>
                          <TD className="text-muted-foreground text-xs">{p.sku}</TD>
                          <TD>{p.category?.name ?? "—"}</TD>
                          <TD className="text-right">{formatPrice(p.price)}</TD>
                          <TD className="text-right">{p.quantity} {p.unit}</TD>
                          <TD>
                            {out ? <Badge variant="destructive">Rupture</Badge>
                             : low ? <Badge variant="warning">Stock faible</Badge>
                             : <Badge>En stock</Badge>}
                          </TD>
                          <TD className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" onClick={() => { setStockProduct(p); setStockForm({ type: "IN", quantity: 1, reason: "" }); setStockOpen(true); }} title="Entrée stock"><ArrowUp size={14} /></Button>
                              <Button size="icon" variant="ghost" onClick={() => { setStockProduct(p); setStockForm({ type: "OUT", quantity: 1, reason: "" }); setStockOpen(true); }} title="Sortie stock"><ArrowDown size={14} /></Button>
                              <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil size={14} /></Button>
                              <Button size="icon" variant="ghost" onClick={() => remove(p)}><Trash2 size={14} /></Button>
                            </div>
                          </TD>
                        </TR>
                      );
                    })}
                  </TBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing.id ? "Modifier" : "Nouveau"} produit</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Nom</label>
              <Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">SKU</label>
              <Input value={editing.sku ?? ""} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Catégorie</label>
              <select className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                value={editing.categoryId ?? ""} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value ? Number(e.target.value) : undefined })}>
                <option value="">—</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Prix vente</label>
              <Input type="number" step="0.01" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Prix coût</label>
              <Input type="number" step="0.01" value={editing.costPrice ?? 0} onChange={(e) => setEditing({ ...editing, costPrice: Number(e.target.value) })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Quantité</label>
              <Input type="number" value={editing.quantity ?? 0} onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Seuil alerte</label>
              <Input type="number" value={editing.minQuantity ?? 5} onChange={(e) => setEditing({ ...editing, minQuantity: Number(e.target.value) })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Unité</label>
              <Input value={editing.unit ?? "pcs"} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={stockOpen} onOpenChange={setStockOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajuster le stock — {stockProduct?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Type</label>
              <select className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                value={stockForm.type} onChange={(e) => setStockForm({ ...stockForm, type: e.target.value })}>
                <option value="IN">Entrée</option>
                <option value="OUT">Sortie</option>
                <option value="ADJUSTMENT">Ajustement</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Quantité</label>
              <Input type="number" min={1} value={stockForm.quantity} onChange={(e) => setStockForm({ ...stockForm, quantity: Number(e.target.value) })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Motif (optionnel)</label>
              <Input value={stockForm.reason} onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })} placeholder="Réception fournisseur, vente..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStockOpen(false)}>Annuler</Button>
            <Button onClick={adjustStock}>Valider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
