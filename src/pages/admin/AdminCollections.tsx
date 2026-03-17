import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Layers, Image as ImageIcon, Eye, EyeOff, GripVertical, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  products: number;
  status: "published" | "draft" | "scheduled";
  featured: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

const initialCollections: Collection[] = [
  { id: 1, name: "Summer Essentials", slug: "summer-essentials", description: "Light and breezy pieces perfect for warm weather.", image: "", products: 18, status: "published", featured: true, createdAt: "2026-01-15" },
  { id: 2, name: "Evening Glamour", slug: "evening-glamour", description: "Stunning evening wear for special occasions.", image: "", products: 12, status: "published", featured: false, createdAt: "2026-01-20" },
  { id: 3, name: "Bohemian Rhapsody", slug: "bohemian-rhapsody", description: "Free-spirited styles with artistic flair.", image: "", products: 8, status: "draft", featured: false, createdAt: "2026-02-01" },
  { id: 4, name: "Resort Wear 2026", slug: "resort-wear-2026", description: "Vacation-ready looks for your next getaway.", image: "", products: 0, status: "scheduled", featured: false, startDate: "2026-04-01", endDate: "2026-09-30", createdAt: "2026-02-20" },
];

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  status: "draft" as Collection["status"],
  featured: false,
  startDate: "",
  endDate: "",
};

const AdminCollections = () => {
  const [collections, setCollections] = useState(initialCollections);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c: Collection) => {
    setEditId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      status: c.status,
      featured: c.featured,
      startDate: c.startDate || "",
      endDate: c.endDate || "",
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: "Collection name is required", variant: "destructive" });
      return;
    }
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (editId) {
      setCollections(prev =>
        prev.map(c =>
          c.id === editId
            ? { ...c, name: form.name, slug, description: form.description, image: form.image, status: form.status, featured: form.featured, startDate: form.startDate || undefined, endDate: form.endDate || undefined }
            : c
        )
      );
      toast({ title: "Collection updated!" });
    } else {
      setCollections(prev => [
        ...prev,
        {
          id: Date.now(),
          name: form.name,
          slug,
          description: form.description,
          image: form.image,
          products: 0,
          status: form.status,
          featured: form.featured,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      toast({ title: "Collection created!" });
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Collection deleted" });
  };

  const toggleFeatured = (id: number) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, featured: !c.featured } : c));
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "published": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "draft": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "scheduled": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "";
    }
  };

  const filtered = collections.filter(c => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Collections</h1>
          <p className="font-body text-sm text-muted-foreground">{collections.length} collections total</p>
        </div>
        <Button className="font-body text-xs tracking-wider uppercase" onClick={openAdd}>
          <Plus size={14} className="mr-1" /> Create Collection
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search collections..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-10 bg-card border-border font-body sm:max-w-xs"
        />
        <div className="flex gap-2">
          {["all", "published", "draft", "scheduled"].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg font-body text-xs uppercase tracking-wider transition-colors ${
                filterStatus === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Collections Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Layers size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-body text-muted-foreground">No collections found</p>
          <Button variant="outline" className="mt-4 font-body text-xs tracking-wider uppercase" onClick={openAdd}>
            Create your first collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map(c => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image placeholder */}
                <div className="h-36 bg-secondary/50 flex items-center justify-center relative">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={32} className="text-muted-foreground/30" />
                  )}
                  {c.featured && (
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                  <Badge className={`absolute top-2 right-2 text-[10px] border ${statusColor(c.status)}`}>
                    {c.status}
                  </Badge>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{c.name}</h3>
                    <p className="font-body text-xs text-muted-foreground line-clamp-2 mt-1">{c.description}</p>
                  </div>

                  <div className="flex items-center gap-4 font-body text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Package size={12} /> {c.products} products</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {c.createdAt}</span>
                  </div>

                  {c.startDate && (
                    <p className="font-body text-[11px] text-muted-foreground">
                      Scheduled: {c.startDate} → {c.endDate || "∞"}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleFeatured(c.id)}
                        className={`p-1.5 rounded-md transition-colors ${c.featured ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground hover:text-foreground"}`}
                        title={c.featured ? "Remove from featured" : "Set as featured"}
                      >
                        {c.featured ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteConfirm(c.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">/{c.slug}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/60" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-50 bg-background border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {editId ? "Edit Collection" : "Create Collection"}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Name *</Label>
                  <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }))}
                    className="h-10 bg-card border-border font-body"
                    placeholder="e.g. Spring Collection 2026"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Slug</Label>
                  <Input
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="h-10 bg-card border-border font-body"
                    placeholder="auto-generated-from-name"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="bg-card border-border font-body min-h-[80px]"
                    placeholder="Describe this collection..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Cover Image URL</Label>
                  <Input
                    value={form.image}
                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    className="h-10 bg-card border-border font-body"
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs uppercase text-muted-foreground">Status</Label>
                    <Select value={form.status} onValueChange={(v: any) => setForm(f => ({ ...f, status: v }))}>
                      <SelectTrigger className="h-10 bg-card border-border font-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-body text-xs uppercase text-muted-foreground">Featured</Label>
                    <div className="flex items-center gap-2 h-10">
                      <Switch
                        checked={form.featured}
                        onCheckedChange={v => setForm(f => ({ ...f, featured: v }))}
                      />
                      <span className="font-body text-sm text-muted-foreground">{form.featured ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>

                {form.status === "scheduled" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-body text-xs uppercase text-muted-foreground">Start Date</Label>
                      <Input
                        type="date"
                        value={form.startDate}
                        onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                        className="h-10 bg-card border-border font-body"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-body text-xs uppercase text-muted-foreground">End Date</Label>
                      <Input
                        type="date"
                        value={form.endDate}
                        onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                        className="h-10 bg-card border-border font-body"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1 font-body text-xs tracking-wider uppercase" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 font-body text-xs tracking-wider uppercase" onClick={handleSave}>
                  {editId ? "Update" : "Create"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-50 bg-background border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 p-6"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Delete Collection?</h3>
              <p className="font-body text-sm text-muted-foreground mb-5">
                This action cannot be undone. Products in this collection will not be deleted.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 font-body text-xs tracking-wider uppercase" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1 font-body text-xs tracking-wider uppercase" onClick={() => handleDelete(deleteConfirm)}>
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCollections;
