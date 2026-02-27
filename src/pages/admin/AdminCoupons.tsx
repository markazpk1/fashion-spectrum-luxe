import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, X, Copy, Percent, Tag, CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  uses: number;
  maxUses: number;
  expiry: string;
  active: boolean;
}

const initialCoupons: Coupon[] = [
  { id: 1, code: "WELCOME20", type: "percentage", value: 20, minOrder: 500, uses: 342, maxUses: 1000, expiry: "2025-06-30", active: true },
  { id: 2, code: "FLAT500", type: "fixed", value: 500, minOrder: 2000, uses: 156, maxUses: 500, expiry: "2025-04-15", active: true },
  { id: 3, code: "SUMMER25", type: "percentage", value: 25, minOrder: 1000, uses: 89, maxUses: 300, expiry: "2025-08-31", active: false },
  { id: 4, code: "VIP10", type: "percentage", value: 10, minOrder: 0, uses: 567, maxUses: 0, expiry: "2025-12-31", active: true },
];

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ code: "", type: "percentage" as "percentage" | "fixed", value: "", minOrder: "", maxUses: "", expiry: "" });

  const openAdd = () => { setEditCoupon(null); setForm({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiry: "" }); setShowModal(true); };
  const openEdit = (c: Coupon) => {
    setEditCoupon(c);
    setForm({ code: c.code, type: c.type, value: String(c.value), minOrder: String(c.minOrder), maxUses: String(c.maxUses), expiry: c.expiry });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.code || !form.value) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
    if (editCoupon) {
      setCoupons(coupons.map(c => c.id === editCoupon.id ? { ...c, code: form.code, type: form.type, value: Number(form.value), minOrder: Number(form.minOrder), maxUses: Number(form.maxUses), expiry: form.expiry } : c));
      toast({ title: "Coupon updated!" });
    } else {
      setCoupons([{ id: Date.now(), code: form.code.toUpperCase(), type: form.type, value: Number(form.value), minOrder: Number(form.minOrder), uses: 0, maxUses: Number(form.maxUses), expiry: form.expiry, active: true }, ...coupons]);
      toast({ title: "Coupon created!" });
    }
    setShowModal(false);
  };

  const toggleActive = (id: number) => setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Coupons & Discounts</h1>
          <p className="font-body text-sm text-muted-foreground">{coupons.length} coupons</p>
        </div>
        <Button className="font-body text-xs tracking-wider uppercase" onClick={openAdd}><Plus size={14} className="mr-1" /> Add Coupon</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map(c => (
          <div key={c.id} className={`bg-card border rounded-xl p-5 ${c.active ? "border-border" : "border-border opacity-60"}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {c.type === "percentage" ? <Percent size={18} className="text-primary" /> : <Tag size={18} className="text-primary" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-body text-sm font-bold text-foreground tracking-wider">{c.code}</p>
                    <button onClick={() => { navigator.clipboard.writeText(c.code); toast({ title: "Copied!" }); }}>
                      <Copy size={12} className="text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">
                    {c.type === "percentage" ? `${c.value}% off` : `₨ ${c.value} off`}
                    {c.minOrder > 0 && ` · Min ₨ ${c.minOrder.toLocaleString()}`}
                  </p>
                </div>
              </div>
              <Switch checked={c.active} onCheckedChange={() => toggleActive(c.id)} />
            </div>
            <div className="flex items-center justify-between text-xs font-body text-muted-foreground mb-3">
              <span>{c.uses} / {c.maxUses || "∞"} uses</span>
              <span>Expires: {c.expiry}</span>
            </div>
            {c.maxUses > 0 && (
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (c.uses / c.maxUses) * 100)}%` }} />
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => openEdit(c)}><Edit2 size={12} className="mr-1" /> Edit</Button>
              <Button variant="ghost" size="sm" className="font-body text-xs text-destructive" onClick={() => setCoupons(coupons.filter(x => x.id !== c.id))}><Trash2 size={12} className="mr-1" /> Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-50 bg-background border border-border rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-xl font-semibold text-foreground">{editCoupon ? "Edit" : "New"} Coupon</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-body text-xs uppercase text-muted-foreground">Code *</Label>
                <Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="h-10 bg-card border-border font-body uppercase tracking-wider" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Type</Label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "percentage" | "fixed" }))} className="w-full h-10 rounded-md border border-border bg-card px-3 font-body text-sm text-foreground">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Value *</Label>
                  <Input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className="h-10 bg-card border-border font-body" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Min Order (₨)</Label>
                  <Input type="number" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} className="h-10 bg-card border-border font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">Max Uses</Label>
                  <Input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="0 = unlimited" className="h-10 bg-card border-border font-body" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs uppercase text-muted-foreground">Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 justify-start text-left font-normal bg-card border-border font-body",
                        !form.expiry && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.expiry ? format(parse(form.expiry, "yyyy-MM-dd", new Date()), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.expiry ? parse(form.expiry, "yyyy-MM-dd", new Date()) : undefined}
                      onSelect={(date) => setForm(f => ({ ...f, expiry: date ? format(date, "yyyy-MM-dd") : "" }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 font-body text-xs tracking-wider uppercase" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1 font-body text-xs tracking-wider uppercase" onClick={handleSave}>{editCoupon ? "Update" : "Create"}</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
