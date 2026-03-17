import { useState } from "react";
import { Save, Globe, Mail, CreditCard, Truck, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: "Fashion Spectrum",
    storeEmail: "contact@fashionspectrum.com",
    storePhone: "+92 300 1234567",
    currency: "PKR",
    taxRate: "17",
    freeShippingMin: "300",
    shippingFee: "150",
    enableReviews: true,
    enableWishlist: true,
    enableCOD: true,
    maintenanceMode: false,
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
  });

  const update = (key: string, value: string | boolean) => setSettings(s => ({ ...s, [key]: value }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Settings</h1>
          <p className="font-body text-sm text-muted-foreground">Store configuration</p>
        </div>
        <Button className="font-body text-xs tracking-wider uppercase" onClick={() => toast({ title: "Settings saved!" })}>
          <Save size={14} className="mr-1" /> Save Changes
        </Button>
      </div>

      {/* General */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={18} className="text-primary" />
          <h3 className="font-heading text-lg font-semibold text-foreground">General</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">Store Name</Label>
            <Input value={settings.storeName} onChange={e => update("storeName", e.target.value)} className="h-10 bg-card border-border font-body" />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">Email</Label>
            <Input value={settings.storeEmail} onChange={e => update("storeEmail", e.target.value)} className="h-10 bg-card border-border font-body" />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">Phone</Label>
            <Input value={settings.storePhone} onChange={e => update("storePhone", e.target.value)} className="h-10 bg-card border-border font-body" />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">Currency</Label>
            <select value={settings.currency} onChange={e => update("currency", e.target.value)} className="w-full h-10 rounded-md border border-border bg-card px-3 font-body text-sm text-foreground">
              <option value="PKR">PKR (₨)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipping & Tax */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Truck size={18} className="text-primary" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Shipping & Tax</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">Tax Rate (%)</Label>
            <Input type="number" value={settings.taxRate} onChange={e => update("taxRate", e.target.value)} className="h-10 bg-card border-border font-body" />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">Free Shipping Min</Label>
            <Input type="number" value={settings.freeShippingMin} onChange={e => update("freeShippingMin", e.target.value)} className="h-10 bg-card border-border font-body" />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">Shipping Fee</Label>
            <Input type="number" value={settings.shippingFee} onChange={e => update("shippingFee", e.target.value)} className="h-10 bg-card border-border font-body" />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={18} className="text-primary" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Features</h3>
        </div>
        {[
          { key: "enableReviews", label: "Customer Reviews", desc: "Allow customers to leave product reviews" },
          { key: "enableWishlist", label: "Wishlist", desc: "Enable wishlist functionality" },
          { key: "enableCOD", label: "Cash on Delivery", desc: "Accept COD payments" },
          { key: "maintenanceMode", label: "Maintenance Mode", desc: "Put store in maintenance mode" },
        ].map(f => (
          <div key={f.key} className="flex items-center justify-between py-2">
            <div>
              <p className="font-body text-sm font-medium text-foreground">{f.label}</p>
              <p className="font-body text-xs text-muted-foreground">{f.desc}</p>
            </div>
            <Switch checked={settings[f.key as keyof typeof settings] as boolean} onCheckedChange={v => update(f.key, v)} />
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={18} className="text-primary" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Notifications</h3>
        </div>
        {[
          { key: "emailNotifications", label: "Email Notifications", desc: "Receive email for important updates" },
          { key: "orderNotifications", label: "Order Notifications", desc: "Get notified for new orders" },
          { key: "lowStockAlerts", label: "Low Stock Alerts", desc: "Alert when products are running low" },
        ].map(f => (
          <div key={f.key} className="flex items-center justify-between py-2">
            <div>
              <p className="font-body text-sm font-medium text-foreground">{f.label}</p>
              <p className="font-body text-xs text-muted-foreground">{f.desc}</p>
            </div>
            <Switch checked={settings[f.key as keyof typeof settings] as boolean} onCheckedChange={v => update(f.key, v)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSettings;
