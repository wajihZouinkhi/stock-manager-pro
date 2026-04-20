"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoriesApi, Category } from "@/lib/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const empty: Partial<Category> = { name: "", description: "", color: "#6366f1" };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Category>>(empty);

  const load = async () => {
    setLoading(true);
    try { setItems(await categoriesApi.getAll()); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing.id) await categoriesApi.update(editing.id, editing);
      else await categoriesApi.create(editing);
      toast.success("Enregistré");
      setOpen(false); setEditing(empty); load();
    } catch (e: any) { toast.error(e.message); }
  };

  const remove = async (c: Category) => {
    if (!confirm(`Supprimer "${c.name}" ?`)) return;
    try { await categoriesApi.delete(c.id); toast.success("Supprimé"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Topbar title="Catégories" subtitle="Organisez vos produits" />
        <div className="p-6 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditing(empty); setOpen(true); }}>
              <Plus size={16} className="mr-1" /> Nouvelle catégorie
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Chargement...</div>
          ) : items.length === 0 ? (
            <Card><CardContent className="pt-6 text-center text-muted-foreground py-12">Aucune catégorie</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((c) => (
                <Card key={c.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: c.color }}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c._count?.products ?? 0} produit(s)</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}><Pencil size={14} /></Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(c)}><Trash2 size={14} /></Button>
                      </div>
                    </div>
                    {c.description && <p className="text-sm text-muted-foreground mt-3">{c.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing.id ? "Modifier" : "Nouvelle"} catégorie</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nom</label>
              <Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Input value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Couleur</label>
              <Input type="color" value={editing.color ?? "#6366f1"} onChange={(e) => setEditing({ ...editing, color: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
