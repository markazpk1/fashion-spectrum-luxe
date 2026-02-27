import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, MapPin, Heart, CreditCard, Bell, Settings, LogOut,
  ChevronRight, Edit2, Camera, Shield, Gift, Clock, Star, Truck, 
  Check, X, Plus, Trash2, Eye, EyeOff, Mail, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type TabKey = "profile" | "orders" | "addresses" | "wishlist" | "payments" | "notifications" | "security" | "settings";

const sidebarItems: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "My Profile", icon: User },
  { key: "orders", label: "My Orders", icon: Package },
  { key: "addresses", label: "Address Book", icon: MapPin },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "payments", label: "Payment Methods", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "settings", label: "Settings", icon: Settings },
];

// Mock data
const mockOrders = [
  { id: "FS-20240101", date: "Jan 15, 2025", status: "Delivered", total: 12500, items: 3, image: "/placeholder.svg" },
  { id: "FS-20240098", date: "Jan 8, 2025", status: "In Transit", total: 8900, items: 2, image: "/placeholder.svg" },
  { id: "FS-20240085", date: "Dec 28, 2024", status: "Processing", total: 15200, items: 1, image: "/placeholder.svg" },
  { id: "FS-20240070", date: "Dec 15, 2024", status: "Delivered", total: 6500, items: 4, image: "/placeholder.svg" },
  { id: "FS-20240055", date: "Nov 30, 2024", status: "Cancelled", total: 3200, items: 1, image: "/placeholder.svg" },
];

const mockAddresses = [
  { id: 1, label: "Home", name: "Ahmed Khan", street: "123 Fashion Street, Block A", city: "Karachi", state: "Sindh", zip: "75500", phone: "+92 300 1234567", isDefault: true },
  { id: 2, label: "Office", name: "Ahmed Khan", street: "456 Business Avenue, Suite 12", city: "Lahore", state: "Punjab", zip: "54000", phone: "+92 321 7654321", isDefault: false },
];

const mockPayments = [
  { id: 1, type: "Visa", last4: "4242", expiry: "12/26", isDefault: true },
  { id: 2, type: "Mastercard", last4: "8888", expiry: "06/25", isDefault: false },
];

const mockNotifications = [
  { id: 1, title: "Order Shipped!", message: "Your order FS-20240098 has been shipped and is on its way.", time: "2 hours ago", read: false, type: "order" },
  { id: 2, title: "Flash Sale!", message: "Up to 50% off on premium kaftans. Limited time only!", time: "1 day ago", read: false, type: "promo" },
  { id: 3, title: "Review Request", message: "How was your recent purchase? Leave a review and earn points.", time: "3 days ago", read: true, type: "review" },
  { id: 4, title: "Price Drop Alert", message: "An item in your wishlist just went on sale!", time: "5 days ago", read: true, type: "promo" },
];

const statusColor: Record<string, string> = {
  "Delivered": "bg-green-100 text-green-700",
  "In Transit": "bg-blue-100 text-blue-700",
  "Processing": "bg-amber-100 text-amber-700",
  "Cancelled": "bg-red-100 text-red-700",
};

const ProfileTab = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    phone: "+92 300 1234567",
    dob: "1995-06-15",
    gender: "Male",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-foreground">My Profile</h2>
        <Button variant="outline" size="sm" onClick={() => { setEditing(!editing); if (editing) toast({ title: "Profile updated!" }); }}>
          <Edit2 size={14} className="mr-1" /> {editing ? "Save" : "Edit"}
        </Button>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading text-2xl font-semibold">
            AK
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Camera size={14} />
          </button>
        </div>
        <div>
          <h3 className="font-heading text-xl font-semibold text-foreground">{profile.name}</h3>
          <p className="text-sm text-muted-foreground font-body">Member since January 2024</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={14} className="text-accent fill-accent" />
            <span className="text-xs font-body text-muted-foreground">Gold Member · 2,450 Points</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: "24", icon: Package },
          { label: "Wishlist", value: "8", icon: Heart },
          { label: "Reward Points", value: "2,450", icon: Gift },
          { label: "Reviews Given", value: "12", icon: Star },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 text-center">
            <s.icon size={20} className="mx-auto text-primary mb-2" />
            <p className="font-heading text-xl font-semibold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground font-body">{s.label}</p>
          </div>
        ))}
      </div>

      <Separator />

      {/* Profile Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Full Name", key: "name", icon: User },
          { label: "Email Address", key: "email", icon: Mail },
          { label: "Phone Number", key: "phone", icon: Phone },
          { label: "Date of Birth", key: "dob", icon: Clock },
        ].map(f => (
          <div key={f.key} className="space-y-1.5">
            <Label className="font-body text-xs tracking-wide uppercase text-muted-foreground flex items-center gap-1.5">
              <f.icon size={12} /> {f.label}
            </Label>
            {editing ? (
              <Input
                value={profile[f.key as keyof typeof profile]}
                onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                className="h-10 bg-card border-border font-body"
              />
            ) : (
              <p className="font-body text-sm text-foreground py-2">{profile[f.key as keyof typeof profile]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const OrdersTab = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-2xl font-semibold text-foreground">My Orders</h2>
      <p className="text-sm text-muted-foreground font-body">{mockOrders.length} orders</p>
    </div>

    <div className="space-y-3">
      {mockOrders.map(order => (
        <div key={order.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-md bg-secondary flex items-center justify-center">
                <Package size={24} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">{order.id}</p>
                <p className="text-xs text-muted-foreground font-body">{order.date} · {order.items} items</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-body font-medium ${statusColor[order.status]}`}>
                {order.status}
              </span>
              <p className="font-body text-sm font-semibold text-foreground">₨ {order.total.toLocaleString()}</p>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </div>
          {order.status === "In Transit" && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-primary" />
                <span className="text-xs font-body text-muted-foreground">Estimated delivery: Jan 12, 2025</span>
              </div>
              <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-2/3 transition-all" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const AddressesTab = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-2xl font-semibold text-foreground">Address Book</h2>
      <Button size="sm" className="font-body text-xs tracking-wider uppercase">
        <Plus size={14} className="mr-1" /> Add Address
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockAddresses.map(addr => (
        <div key={addr.id} className={`bg-card border rounded-lg p-5 relative ${addr.isDefault ? "border-primary" : "border-border"}`}>
          {addr.isDefault && (
            <Badge className="absolute top-3 right-3 bg-primary/10 text-primary border-0 font-body text-[10px]">Default</Badge>
          )}
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-primary" />
            <span className="font-body text-sm font-medium text-foreground">{addr.label}</span>
          </div>
          <p className="font-body text-sm text-foreground">{addr.name}</p>
          <p className="font-body text-sm text-muted-foreground">{addr.street}</p>
          <p className="font-body text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
          <p className="font-body text-sm text-muted-foreground mt-1">{addr.phone}</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="font-body text-xs"><Edit2 size={12} className="mr-1" /> Edit</Button>
            {!addr.isDefault && <Button variant="ghost" size="sm" className="font-body text-xs text-destructive"><Trash2 size={12} className="mr-1" /> Remove</Button>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const WishlistTab = () => {
  const { items, removeItem } = useWishlist();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-foreground">Wishlist</h2>
        <p className="text-sm text-muted-foreground font-body">{items.length} items</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-heading text-xl text-muted-foreground">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground font-body mt-1">Save items you love for later</p>
          <Link to="/shop">
            <Button className="mt-6 font-body text-xs tracking-wider uppercase">Browse Shop</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-secondary" />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="font-body text-sm text-primary font-semibold mt-1">₨ {item.price.toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="font-body text-[10px] tracking-wider uppercase h-8">Add to Cart</Button>
                  <Button variant="ghost" size="sm" className="text-destructive h-8" onClick={() => removeItem(item.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PaymentsTab = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-2xl font-semibold text-foreground">Payment Methods</h2>
      <Button size="sm" className="font-body text-xs tracking-wider uppercase">
        <Plus size={14} className="mr-1" /> Add Card
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockPayments.map(card => (
        <div key={card.id} className={`bg-card border rounded-lg p-5 relative ${card.isDefault ? "border-primary" : "border-border"}`}>
          {card.isDefault && (
            <Badge className="absolute top-3 right-3 bg-primary/10 text-primary border-0 font-body text-[10px]">Default</Badge>
          )}
          <div className="flex items-center gap-3 mb-3">
            <CreditCard size={24} className="text-primary" />
            <div>
              <p className="font-body text-sm font-medium text-foreground">{card.type} •••• {card.last4}</p>
              <p className="font-body text-xs text-muted-foreground">Expires {card.expiry}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="font-body text-xs"><Edit2 size={12} className="mr-1" /> Edit</Button>
            {!card.isDefault && <Button variant="ghost" size="sm" className="font-body text-xs text-destructive"><Trash2 size={12} className="mr-1" /> Remove</Button>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const NotificationsTab = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-2xl font-semibold text-foreground">Notifications</h2>
      <Button variant="ghost" size="sm" className="font-body text-xs text-primary">Mark all read</Button>
    </div>

    <div className="space-y-2">
      {mockNotifications.map(n => (
        <div key={n.id} className={`bg-card border border-border rounded-lg p-4 flex gap-3 ${!n.read ? "border-l-2 border-l-primary" : ""}`}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === "order" ? "bg-blue-50 text-blue-600" : n.type === "promo" ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
            {n.type === "order" ? <Truck size={16} /> : n.type === "promo" ? <Gift size={16} /> : <Star size={16} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={`font-body text-sm ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
              <span className="text-[10px] text-muted-foreground font-body flex-shrink-0 ml-2">{n.time}</span>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-0.5">{n.message}</p>
          </div>
          {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
        </div>
      ))}
    </div>
  </div>
);

const SecurityTab = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-semibold text-foreground">Security</h2>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h3 className="font-body text-sm font-medium text-foreground">Change Password</h3>
        <div className="space-y-3 max-w-md">
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">Current Password</Label>
            <div className="relative">
              <Input type={showOld ? "text" : "password"} placeholder="••••••••" className="h-10 bg-card border-border font-body pr-10" />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">New Password</Label>
            <div className="relative">
              <Input type={showNew ? "text" : "password"} placeholder="••••••••" className="h-10 bg-card border-border font-body pr-10" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">Confirm New Password</Label>
            <Input type="password" placeholder="••••••••" className="h-10 bg-card border-border font-body" />
          </div>
          <Button className="font-body text-xs tracking-wider uppercase" onClick={() => toast({ title: "Password updated!" })}>
            Update Password
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h3 className="font-body text-sm font-medium text-foreground">Two-Factor Authentication</h3>
        <p className="font-body text-xs text-muted-foreground">Add an extra layer of security to your account</p>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-foreground">Enable 2FA</span>
          <Switch />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 space-y-3">
        <h3 className="font-body text-sm font-medium text-foreground">Login Activity</h3>
        {[
          { device: "Chrome on Windows", location: "Karachi, PK", time: "Active now", active: true },
          { device: "Safari on iPhone", location: "Lahore, PK", time: "2 days ago", active: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div>
              <p className="font-body text-sm text-foreground">{s.device}</p>
              <p className="font-body text-xs text-muted-foreground">{s.location} · {s.time}</p>
            </div>
            {s.active ? (
              <Badge variant="outline" className="text-green-600 border-green-200 font-body text-[10px]">Active</Badge>
            ) : (
              <Button variant="ghost" size="sm" className="font-body text-xs text-destructive">Revoke</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsTab = () => (
  <div className="space-y-6">
    <h2 className="font-heading text-2xl font-semibold text-foreground">Settings</h2>

    <div className="bg-card border border-border rounded-lg p-5 space-y-5">
      <h3 className="font-body text-sm font-medium text-foreground">Notification Preferences</h3>
      {[
        { label: "Order Updates", desc: "Get notified about your order status" },
        { label: "Promotions & Sales", desc: "Receive deals and discount notifications" },
        { label: "New Arrivals", desc: "Be the first to know about new products" },
        { label: "Price Drop Alerts", desc: "Alerts when wishlist items go on sale" },
      ].map(s => (
        <div key={s.label} className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-foreground">{s.label}</p>
            <p className="font-body text-xs text-muted-foreground">{s.desc}</p>
          </div>
          <Switch defaultChecked />
        </div>
      ))}
    </div>

    <div className="bg-card border border-border rounded-lg p-5 space-y-5">
      <h3 className="font-body text-sm font-medium text-foreground">Communication</h3>
      {[
        { label: "Email Notifications", desc: "Receive updates via email" },
        { label: "SMS Notifications", desc: "Receive updates via SMS" },
        { label: "WhatsApp Updates", desc: "Receive updates on WhatsApp" },
      ].map(s => (
        <div key={s.label} className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-foreground">{s.label}</p>
            <p className="font-body text-xs text-muted-foreground">{s.desc}</p>
          </div>
          <Switch defaultChecked={s.label === "Email Notifications"} />
        </div>
      ))}
    </div>

    <div className="bg-card border border-border rounded-lg p-5 space-y-4">
      <h3 className="font-body text-sm font-medium text-foreground">Account Actions</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="font-body text-xs tracking-wider uppercase">
          Download My Data
        </Button>
        <Button variant="outline" className="font-body text-xs tracking-wider uppercase text-destructive border-destructive/30 hover:bg-destructive/5">
          Deactivate Account
        </Button>
      </div>
    </div>
  </div>
);

const tabComponents: Record<TabKey, React.FC> = {
  profile: ProfileTab,
  orders: OrdersTab,
  addresses: AddressesTab,
  wishlist: WishlistTab,
  payments: PaymentsTab,
  notifications: NotificationsTab,
  security: SecurityTab,
  settings: SettingsTab,
};

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-mobile-nav">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground">My Account</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Manage your profile, orders, and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Mobile: horizontal scroll tabs */}
            <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {sidebarItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap font-body text-xs tracking-wide transition-colors ${
                    activeTab === item.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Desktop: vertical sidebar */}
            <nav className="hidden lg:block bg-card border border-border rounded-lg p-2 sticky top-24">
              {sidebarItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-body text-sm transition-colors text-left ${
                    activeTab === item.key
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
              <Separator className="my-2" />
              <Link to="/">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-body text-sm text-destructive hover:bg-destructive/5 transition-colors text-left">
                  <LogOut size={18} />
                  Sign Out
                </button>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
