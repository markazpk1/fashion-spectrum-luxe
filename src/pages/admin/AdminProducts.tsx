import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Edit2, Trash2, Eye, MoreVertical,
  X, Upload, Package, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { newArrivals, Product } from "@/lib/products";

interface AdminProduct extends Product {
  stock: number;
  status: "Active" | "Draft" | "Archived";
  sku: string;
}

const initialProducts: AdminProduct[] = newArrivals.map((p, i) => ({
  ...p,
  stock: Math.floor(Math.random() * 100) + 5,
  status: i % 5 === 0 ? "Draft" : "Active",
  sku: `FS-${String(i + 1).padStart(4, "0")}`,
}));

const categories = ["All", "Kaftans", "Dresses", "Co-Ords", "Tops", "Bottoms", "Capes", "Blazers", "Swimwear", "Jumpsuits"];

const AdminProducts = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<{ name: string; price: string; originalPrice: string; category: string; stock: string; sku: string; status: "Active" | "Draft" | "Archived" }>({ name: "", price: "", originalPrice: "", category: "Kaftans", stock: "", sku: "", status: "Active" });

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: "", price: "", originalPrice: "", category: "Kaftans", stock: "", sku: "", status: "Active" });
    setShowModal(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      category: p.category,
      stock: String(p.stock),
      sku: p.sku,
      status: p.status,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    if (editProduct) {
      setProducts(products.map(p => p.id === editProduct.id ? {
        ...p, name: form.name, price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        category: form.category, stock: Number(form.stock), sku: form.sku, status: form.status,
      } : p));
      toast({ title: "Product updated!" });
    } else {
      const newP: AdminProduct = {
        id: `new-${Date.now()}`, name: form.name, price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        image: "/placeholder.svg", category: form.category, stock: Number(form.stock),
        sku: form.sku || `FS-${String(products.length + 1).padStart(4, "0")}`, status: form.status,
      };
      setProducts([newP, ...products]);
      toast({ title: "Product added!" });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({ title: "Product deleted" });
  };

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      Active: "bg-green-100 text-green-700",
      Draft: "bg-amber-100 text-amber-700",
      Archived: "bg-muted text-muted-foreground",
    };
    return colors[s] || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Products</h1>
          <p className="font-body text-sm text-muted-foreground">{products.length} products in catalog</p>
        </div>
        <Button className="font-body text-xs tracking-wider uppercase" onClick={openAdd}>
          <Plus size={14} className="mr-1" /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-card border-border font-body" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-lg font-body text-xs whitespace-nowrap transition-all ${
                category === c ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">SKU</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Stock</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-secondary" />
                      <div>
                        <p className="font-body text-sm font-medium text-foreground truncate max-w-[200px]">{p.name}</p>
                        <p className="font-body text-xs text-muted-foreground">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-muted-foreground hidden sm:table-cell">{p.sku}</td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm font-medium text-foreground">₨ {p.price.toLocaleString()}</p>
                    {p.originalPrice && <p className="font-body text-xs text-muted-foreground line-through">₨ {p.originalPrice.toLocaleString()}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`font-body text-sm ${p.stock < 10 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                      {p.stock} {p.stock < 10 && "⚠️"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-body font-medium ${statusBadge(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-body text-sm text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-50 bg-background border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-xl font-semibold text-foreground">{editProduct ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-body text-xs uppercase text-muted-foreground">Product Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="h-10 bg-card border-border font-body" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Price (₨) *</Label>
                  <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="h-10 bg-card border-border font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Compare Price</Label>
                  <Input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} className="h-10 bg-card border-border font-body" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Category</Label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full h-10 rounded-md border border-border bg-card px-3 font-body text-sm text-foreground">
                    {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Stock *</Label>
                  <Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="h-10 bg-card border-border font-body" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">SKU</Label>
                  <Input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="h-10 bg-card border-border font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Status</Label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as "Active" | "Draft" | "Archived" }))} className="w-full h-10 rounded-md border border-border bg-card px-3 font-body text-sm text-foreground">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="font-body text-sm text-muted-foreground">Drag & drop images or click to upload</p>
                <p className="font-body text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 font-body text-xs tracking-wider uppercase" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1 font-body text-xs tracking-wider uppercase" onClick={handleSave}>{editProduct ? "Update" : "Add"} Product</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
