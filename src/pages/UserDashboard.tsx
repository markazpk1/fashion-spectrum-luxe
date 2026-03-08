import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, MapPin, Heart, CreditCard, Bell, Settings, LogOut,
  ChevronRight, Edit2, Camera, Shield, Gift, Clock, Star, Truck, 
  Check, X, Plus, Trash2, Eye, EyeOff, Mail, Phone, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type TabKey = "profile" | "orders" | "addresses" | "wishlist" | "payments" | "notifications" | "security" | "settings";

const CardBrandIcon = ({ type, size = 24 }: { type: string; size?: number }) => {
  if (type === "Visa") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="6" fill="#1A1F71" />
        <path d="M20.3 30.5l2.5-15h3l-2.5 15h-3zm12.5-15l-2.8 10.3-1.2-6-.4-2c-.2-.5-.7-.7-1.2-.7h-4.5l-.1.4c1.2.3 2.5.8 3.3 1.3l2.8 10.7h3.1l4.7-14h-3.7zm-16.6 0l-3.6 10.2-.4-2c-.7-2.3-2.8-4.8-5.2-6l2.7 12.8h3.2l4.8-15h-3.5zm-7.3 0H4l-.1.3c3.8 1 6.3 3.3 7.3 6.1l-1-5.3c-.2-.7-.7-1-1.3-1.1z" fill="#FFFFFF" />
      </svg>
    );
  }
  if (type === "Mastercard") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="6" fill="#252525" />
        <circle cx="20" cy="24" r="10" fill="#EB001B" />
        <circle cx="28" cy="24" r="10" fill="#F79E1B" />
        <path d="M24 16.7a10 10 0 0 1 0 14.6 10 10 0 0 1 0-14.6z" fill="#FF5F00" />
      </svg>
    );
  }
  if (type === "Amex") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="6" fill="#2E77BC" />
        <text x="24" y="27" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" fill="#FFFFFF">AMEX</text>
      </svg>
    );
  }
  if (type === "Discover") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="6" fill="#FF6600" />
        <circle cx="28" cy="24" r="8" fill="#FFFFFF" />
        <text x="16" y="27" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="7" fill="#FFFFFF">D</text>
      </svg>
    );
  }
  if (type === "Diners") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="6" fill="#0079BE" />
        <circle cx="24" cy="24" r="9" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="18" y1="24" x2="30" y2="24" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="24" y1="18" x2="24" y2="30" stroke="#FFFFFF" strokeWidth="2" />
      </svg>
    );
  }
  if (type === "JCB") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="6" fill="#0B7B3E" />
        <text x="24" y="27" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="12" fill="#FFFFFF">JCB</text>
      </svg>
    );
  }
  if (type === "UnionPay") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="6" fill="#E21836" />
        <rect x="16" y="14" width="16" height="20" rx="2" fill="#00447C" />
        <text x="24" y="27" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="6" fill="#FFFFFF">UP</text>
      </svg>
    );
  }
  return <CreditCard size={size} className="text-muted-foreground" />;
};

const CardFlipPreview = ({ name, number, expiry, cvv, type, isCvvFocused }: {
  name: string; number: string; expiry: string; cvv: string; type: string; isCvvFocused: boolean;
}) => {
  const displayNumber = number || "•••• •••• •••• ••••";
  const displayName = name || "YOUR NAME";
  const displayExpiry = expiry || "MM/YY";

  const brandGradients: Record<string, string> = {
    Visa: "from-[#1A1F71] to-[#2B3990]",
    Mastercard: "from-[#1A1A2E] to-[#16213E]",
    Amex: "from-[#2E77BC] to-[#1B4F72]",
    Discover: "from-[#FF6600] to-[#CC5200]",
    Diners: "from-[#0079BE] to-[#005A8C]",
    JCB: "from-[#0B7B3E] to-[#085C2E]",
    UnionPay: "from-[#E21836] to-[#B5132B]",
    Card: "from-[#374151] to-[#1F2937]",
  };

  const gradient = brandGradients[type] || brandGradients.Card;

  return (
    <div className="my-4" style={{ perspective: "1000px" }}>
      <motion.div
        animate={{ rotateY: isCvvFocused ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full aspect-[1.586/1] max-w-[320px] mx-auto"
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} p-5 flex flex-col justify-between text-white shadow-lg`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-7 rounded bg-yellow-300/80" />
            <CardBrandIcon type={type} size={32} />
          </div>
          <p className="font-mono text-base sm:text-lg tracking-[0.2em] mt-auto">{displayNumber}</p>
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-[9px] uppercase tracking-wider opacity-70">Card Holder</p>
              <p className="font-body text-xs sm:text-sm uppercase tracking-wider truncate max-w-[180px]">{displayName}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wider opacity-70">Expires</p>
              <p className="font-body text-xs sm:text-sm tracking-wider">{displayExpiry}</p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} flex flex-col justify-center shadow-lg`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="w-full h-10 bg-black/40 mt-6" />
          <div className="px-5 mt-4">
            <p className="text-[9px] text-white/70 uppercase tracking-wider text-right mb-1">CVV</p>
            <div className="bg-white/20 rounded px-3 py-2 text-right">
              <p className="font-mono text-white text-sm tracking-[0.3em]">{cvv || "•••"}</p>
            </div>
          </div>
          <div className="flex justify-end px-5 mt-auto mb-5">
            <CardBrandIcon type={type} size={28} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

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

// Mock order item details
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product5 from "@/assets/product-5.jpg";
import product7 from "@/assets/product-7.jpg";
import product9 from "@/assets/product-9.jpg";
import product11 from "@/assets/product-11.jpg";

interface OrderItem {
  name: string;
  image: string;
  size: string;
  qty: number;
  price: number;
  color?: string;
}

interface UserOrder {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
  orderItems: OrderItem[];
}

// Mock data
const mockOrders: UserOrder[] = [
  { id: "FS-20240101", date: "Jan 15, 2025", status: "Delivered", total: 12500, items: 3, orderItems: [
    { name: "Emerald Empress Medium Kaftan", image: product1, size: "M", qty: 1, price: 4500, color: "Emerald" },
    { name: "Aegean Nights Co-Ord Set", image: product2, size: "L", qty: 1, price: 5200, color: "Navy" },
    { name: "Royal Heritage Kaftan", image: product3, size: "S", qty: 1, price: 2600, color: "Gold" },
  ]},
  { id: "FS-20240098", date: "Jan 8, 2025", status: "In Transit", total: 8900, items: 2, orderItems: [
    { name: "Sunset Bloom Kaftan", image: product5, size: "XL", qty: 1, price: 4900, color: "Rose" },
    { name: "Pearl Essence Tunic", image: product7, size: "M", qty: 1, price: 3800, color: "Ivory" },
  ]},
  { id: "FS-20240085", date: "Dec 28, 2024", status: "Processing", total: 15200, items: 1, orderItems: [
    { name: "Diamond Luxe Bridal Kaftan", image: product9, size: "L", qty: 1, price: 15000, color: "White" },
  ]},
  { id: "FS-20240070", date: "Dec 15, 2024", status: "Delivered", total: 6500, items: 4, orderItems: [
    { name: "Classic Noir Abaya", image: product11, size: "M", qty: 2, price: 1800, color: "Black" },
    { name: "Sapphire Wave Kaftan", image: product1, size: "S", qty: 1, price: 1500, color: "Blue" },
    { name: "Crimson Royale Set", image: product3, size: "L", qty: 1, price: 1200, color: "Red" },
  ]},
  { id: "FS-20240055", date: "Nov 30, 2024", status: "Cancelled", total: 3200, items: 1, orderItems: [
    { name: "Moonlight Silk Kaftan", image: product5, size: "XS", qty: 1, price: 3000, color: "Silver" },
  ]},
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

const OrdersTab = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const [orders, setOrders] = useState(mockOrders);

  const statuses = ["All", "Delivered", "In Transit", "Processing", "Cancelled"];
  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchSearch = !searchQuery || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.orderItems.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const getProgress = (status: string) => {
    if (status === "Processing") return 25;
    if (status === "In Transit") return 65;
    if (status === "Delivered") return 100;
    return 0;
  };

  const handleCancel = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Cancelled" } : o));
    setSelectedOrder(null);
    toast({ title: `Order ${id} has been cancelled` });
  };

  const handleDownloadInvoice = (order: typeof mockOrders[0]) => {
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pw = doc.internal.pageSize.getWidth();

      // Header bar
      doc.setFillColor(139, 69, 19);
      doc.rect(0, 0, pw, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("FASHION SPECTRUM", 20, 22);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Premium Kaftans & Fashion", 20, 30);

      // Invoice title & order info
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 20, 58);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Invoice #: ${order.id}`, pw - 20, 52, { align: "right" });
      doc.text(`Date: ${order.date}`, pw - 20, 58, { align: "right" });
      doc.text(`Status: ${order.status}`, pw - 20, 64, { align: "right" });

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 72, pw - 20, 72);

      // Bill to
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 20, 82);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text("Ahmed Khan", 20, 89);
      doc.text("ahmed.khan@example.com", 20, 95);
      doc.text("Karachi, Sindh, Pakistan", 20, 101);

      // Table header
      const ty = 115;
      doc.setFillColor(245, 245, 245);
      doc.rect(20, ty, pw - 40, 10, "F");
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Product", 25, ty + 7);
      doc.text("Size", 105, ty + 7);
      doc.text("Qty", 125, ty + 7);
      doc.text("Price", pw - 25, ty + 7, { align: "right" });

      // Product line items
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      let currentY = ty + 18;
      order.orderItems.forEach((item) => {
        doc.setFontSize(9);
        doc.text(item.name, 25, currentY);
        doc.text(item.size, 105, currentY);
        doc.text(`${item.qty}`, 125, currentY);
        doc.text(`Rs ${item.price.toLocaleString()}`, pw - 25, currentY, { align: "right" });
        if (item.color) {
          doc.setFontSize(7);
          doc.setTextColor(120, 120, 120);
          doc.text(`Color: ${item.color}`, 25, currentY + 5);
          doc.setTextColor(50, 50, 50);
          currentY += 12;
        } else {
          currentY += 8;
        }
      });

      // Shipping row
      doc.setFontSize(9);
      doc.text("Shipping", 25, currentY);
      doc.text("Rs 200", pw - 25, currentY, { align: "right" });
      currentY += 8;

      // Divider
      doc.line(20, currentY, pw - 20, currentY);
      currentY += 10;

      // Total
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Total:", 105, currentY);
      doc.text(`Rs ${order.total.toLocaleString()}`, pw - 25, currentY, { align: "right" });

      // Footer
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text("Thank you for shopping with Fashion Spectrum!", pw / 2, 270, { align: "center" });
      doc.text("www.fashionspectrum.com | support@fashionspectrum.com", pw / 2, 276, { align: "center" });

      doc.save(`invoice-${order.id}.pdf`);
      toast({ title: "Invoice PDF downloaded" });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-foreground">My Orders</h2>
        <p className="text-sm text-muted-foreground font-body">{orders.length} orders</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by order ID or product name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9 h-10 bg-card border-border font-body"
        />
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full font-body text-xs whitespace-nowrap transition-all ${
              statusFilter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s} {s !== "All" && `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-heading text-xl text-muted-foreground">No orders found</p>
          <p className="text-sm text-muted-foreground font-body mt-1">No orders match this filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
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
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSelectedOrder(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-50 bg-background border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-xl font-semibold text-foreground">Order {selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs px-3 py-1.5 rounded-full font-body font-medium ${statusColor[selectedOrder.status]}`}>
                {selectedOrder.status}
              </span>
              <p className="font-body text-xs text-muted-foreground">{selectedOrder.date}</p>
            </div>

            {/* Tracking Progress */}
            {selectedOrder.status !== "Cancelled" && (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  {["Confirmed", "Processing", "Shipped", "Delivered"].map((step, i) => {
                    const progress = getProgress(selectedOrder.status);
                    const stepProgress = (i + 1) * 25;
                    const isActive = progress >= stepProgress;
                    return (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          {isActive ? <Check size={12} /> : i + 1}
                        </div>
                        <span className="text-[10px] font-body text-muted-foreground mt-1 text-center">{step}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgress(selectedOrder.status)}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            )}

            <Separator className="my-4" />

            {/* Order Items Breakdown */}
            <div className="space-y-3">
              <h4 className="font-body text-sm font-medium text-foreground">Order Items</h4>
              {selectedOrder.orderItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 p-2 rounded-lg bg-secondary/30">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-foreground truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.color && <span className="font-body text-[11px] text-muted-foreground">{item.color}</span>}
                      <span className="font-body text-[11px] text-muted-foreground">· Size: {item.size}</span>
                      <span className="font-body text-[11px] text-muted-foreground">· Qty: {item.qty}</span>
                    </div>
                    <p className="font-body text-sm font-semibold text-foreground mt-1">₨ {item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Price Summary */}
            <div className="space-y-2">
              {[
                ["Subtotal", `₨ ${(selectedOrder.total - 200).toLocaleString()}`],
                ["Shipping", "₨ 200"],
                ["Total", `₨ ${selectedOrder.total.toLocaleString()}`],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between">
                  <span className="font-body text-sm text-muted-foreground">{label}</span>
                  <span className={`font-body text-sm ${label === "Total" ? "font-semibold text-foreground" : "text-foreground"}`}>{value}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {selectedOrder.status === "In Transit" && (
                <Button variant="outline" className="w-full font-body text-xs tracking-wider uppercase" onClick={() => { toast({ title: "Tracking page coming soon!" }); }}>
                  <Truck size={14} className="mr-2" /> Track Order
                </Button>
              )}
              <Button variant="outline" className="w-full font-body text-xs tracking-wider uppercase" onClick={() => handleDownloadInvoice(selectedOrder)}>
                <Package size={14} className="mr-2" /> Download Invoice
              </Button>
              {selectedOrder.status === "Delivered" && (
                <Button className="w-full font-body text-xs tracking-wider uppercase" onClick={() => { toast({ title: "Items added to cart for reorder!" }); setSelectedOrder(null); }}>
                  <Star size={14} className="mr-2" /> Reorder
                </Button>
              )}
              {(selectedOrder.status === "Processing") && (
                <Button variant="outline" className="w-full font-body text-xs tracking-wider uppercase text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => handleCancel(selectedOrder.id)}>
                  <X size={14} className="mr-2" /> Cancel Order
                </Button>
              )}
              {selectedOrder.status === "Delivered" && (
                <Button variant="outline" className="w-full font-body text-xs tracking-wider uppercase" onClick={() => { toast({ title: "Return request submitted!" }); }}>
                  <Clock size={14} className="mr-2" /> Request Return
                </Button>
              )}
            </div>

            <Button variant="ghost" className="w-full mt-3 font-body text-xs tracking-wider uppercase" onClick={() => setSelectedOrder(null)}>Close</Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const AddressesTab = () => {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const emptyForm = { label: "", name: "", street: "", city: "", state: "", zip: "", phone: "" };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (addr: typeof mockAddresses[0]) => {
    setForm({ label: addr.label, name: addr.name, street: addr.street, city: addr.city, state: addr.state, zip: addr.zip, phone: addr.phone });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.label.trim() || !form.name.trim() || !form.street.trim() || !form.city.trim() || !form.phone.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (editingId !== null) {
      setAddresses(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
      toast({ title: "Address updated successfully!" });
    } else {
      const newAddr = { id: Date.now(), ...form, isDefault: addresses.length === 0 };
      setAddresses(prev => [...prev, newAddr]);
      toast({ title: "Address added successfully!" });
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Address removed" });
  };

  const setDefault = (id: number) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    toast({ title: "Default address updated" });
  };

  const updateField = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-foreground">Address Book</h2>
        <Button size="sm" className="font-body text-xs tracking-wider uppercase" onClick={openAdd}>
          <Plus size={14} className="mr-1" /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-heading text-xl text-muted-foreground">No addresses saved</p>
          <p className="text-sm text-muted-foreground font-body mt-1">Add a delivery address to get started</p>
          <Button className="mt-6 font-body text-xs tracking-wider uppercase" onClick={openAdd}>Add Address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => (
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
              <div className="flex gap-2 mt-4 flex-wrap">
                <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => openEdit(addr)}>
                  <Edit2 size={12} className="mr-1" /> Edit
                </Button>
                {!addr.isDefault && (
                  <>
                    <Button variant="outline" size="sm" className="font-body text-xs text-primary" onClick={() => setDefault(addr.id)}>
                      <Check size={12} className="mr-1" /> Set as Default
                    </Button>
                    <Button variant="ghost" size="sm" className="font-body text-xs text-destructive" onClick={() => setDeleteConfirm(addr.id)}>
                      <Trash2 size={12} className="mr-1" /> Remove
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Address Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-50 bg-background border border-border rounded-xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {editingId !== null ? "Edit Address" : "Add New Address"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-body text-xs uppercase text-muted-foreground">Label *</Label>
                <div className="flex gap-2">
                  {["Home", "Office", "Other"].map(l => (
                    <button
                      key={l}
                      onClick={() => updateField("label", l)}
                      className={`px-3 py-1.5 rounded-full font-body text-xs transition-all ${
                        form.label === l ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                {!["Home", "Office", "Other"].includes(form.label) && (
                  <Input placeholder="Custom label" value={form.label} onChange={e => updateField("label", e.target.value)} className="h-10 bg-card border-border font-body mt-2" />
                )}
              </div>
              {[
                { key: "name", label: "Full Name *", placeholder: "Recipient name" },
                { key: "street", label: "Street Address *", placeholder: "Street, apartment, suite" },
                { key: "city", label: "City *", placeholder: "City" },
                { key: "state", label: "State / Province", placeholder: "State" },
                { key: "zip", label: "ZIP / Postal Code", placeholder: "Postal code" },
                { key: "phone", label: "Phone Number *", placeholder: "+92 xxx xxxxxxx" },
              ].map(f => (
                <div key={f.key} className="space-y-1.5">
                  <Label className="font-body text-xs uppercase text-muted-foreground">{f.label}</Label>
                  <Input
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => updateField(f.key, e.target.value)}
                    className="h-10 bg-card border-border font-body"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 font-body text-xs tracking-wider uppercase" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button className="flex-1 font-body text-xs tracking-wider uppercase" onClick={handleSave}>
                {editingId !== null ? "Save Changes" : "Add Address"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-50 bg-background border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 p-6"
          >
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Remove Address</h3>
            <p className="font-body text-sm text-muted-foreground mb-5">Are you sure you want to remove this address? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 font-body text-xs tracking-wider uppercase" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1 font-body text-xs tracking-wider uppercase" onClick={() => handleDelete(deleteConfirm)}>Remove</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

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

const PaymentsTab = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState<null | { id: number; name: string; number: string; expiry: string; cvv: string; type: string }>(null);
  const [cards, setCards] = useState(mockPayments);
  const [newCard, setNewCard] = useState({ name: "", number: "", expiry: "", cvv: "", type: "Visa" });

  const formatCardNumber = (val: string) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const detectCardType = (num: string) => {
    const clean = num.replace(/\s/g, "");
    if (clean.startsWith("4")) return "Visa";
    if (clean.startsWith("5") || clean.startsWith("2")) return "Mastercard";
    if (clean.startsWith("34") || clean.startsWith("37")) return "Amex";
    if (clean.startsWith("6011") || clean.startsWith("65") || clean.startsWith("644")) return "Discover";
    if (clean.startsWith("36") || clean.startsWith("38") || clean.startsWith("300")) return "Diners";
    if (clean.startsWith("35")) return "JCB";
    if (clean.startsWith("62")) return "UnionPay";
    return "Card";
  };

  const handleAddCard = () => {
    const clean = newCard.number.replace(/\s/g, "");
    if (clean.length < 16 || newCard.expiry.length < 5 || newCard.cvv.length < 3 || !newCard.name.trim()) {
      toast({ title: "Please fill all card details correctly", variant: "destructive" });
      return;
    }
    const card = {
      id: Date.now(),
      type: detectCardType(newCard.number),
      last4: clean.slice(-4),
      expiry: newCard.expiry,
      isDefault: cards.length === 0,
    };
    setCards([...cards, card]);
    setNewCard({ name: "", number: "", expiry: "", cvv: "", type: "Visa" });
    setShowAddCard(false);
    toast({ title: "Card added successfully!" });
  };

  const handleEditCard = (card: typeof cards[0]) => {
    setEditingCard({
      id: card.id,
      name: "",
      number: `•••• •••• •••• ${card.last4}`,
      expiry: card.expiry,
      cvv: "",
      type: card.type,
    });
  };

  const handleSaveEdit = () => {
    if (!editingCard) return;
    const expiry = editingCard.expiry;
    if (expiry.length < 5) {
      toast({ title: "Please enter a valid expiry date", variant: "destructive" });
      return;
    }
    setCards(cards.map(c => c.id === editingCard.id ? {
      ...c,
      expiry: editingCard.expiry,
      type: editingCard.number.includes("••••") ? c.type : detectCardType(editingCard.number),
      last4: editingCard.number.includes("••••") ? c.last4 : editingCard.number.replace(/\s/g, "").slice(-4),
    } : c));
    setEditingCard(null);
    toast({ title: "Card updated successfully!" });
  };

  const CardFormDialog = ({ title, cardState, setCardState, onSave, onClose, saveLabel }: {
    title: string;
    cardState: { name: string; number: string; expiry: string; cvv: string; type: string };
    setCardState: (updater: (prev: typeof cardState) => typeof cardState) => void;
    onSave: () => void;
    onClose: () => void;
    saveLabel: string;
  }) => {
    const [cvvFocused, setCvvFocused] = useState(false);
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-50 bg-background border border-border rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Animated Card Flip Preview */}
        <CardFlipPreview
          name={cardState.name}
          number={cardState.number}
          expiry={cardState.expiry}
          cvv={cardState.cvv}
          type={detectCardType(cardState.number)}
          isCvvFocused={cvvFocused}
        />

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">Cardholder Name</Label>
            <Input
              placeholder="Name on card"
              value={cardState.name}
              onChange={e => setCardState(c => ({ ...c, name: e.target.value }))}
              className="h-10 bg-card border-border font-body"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-xs uppercase text-muted-foreground">Card Number</Label>
            <div className="relative">
              <Input
                placeholder="0000 0000 0000 0000"
                value={cardState.number}
                onChange={e => {
                  const formatted = formatCardNumber(e.target.value);
                  setCardState(c => ({ ...c, number: formatted, type: detectCardType(formatted) }));
                }}
                className="h-10 bg-card border-border font-body pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <CardBrandIcon type={detectCardType(cardState.number)} size={20} />
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-body text-xs uppercase text-muted-foreground">Expiry Date</Label>
              <Input
                placeholder="MM/YY"
                value={cardState.expiry}
                onChange={e => setCardState(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                className="h-10 bg-card border-border font-body"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-xs uppercase text-muted-foreground">CVV</Label>
              <Input
                placeholder="•••"
                value={cardState.cvv}
                onChange={e => setCardState(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                onFocus={() => setCvvFocused(true)}
                onBlur={() => setCvvFocused(false)}
                className="h-10 bg-card border-border font-body"
                type="password"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 font-body text-xs tracking-wider uppercase" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 font-body text-xs tracking-wider uppercase" onClick={onSave}>
            {saveLabel}
          </Button>
        </div>
      </motion.div>
    </div>
  );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-foreground">Payment Methods</h2>
        <Button size="sm" className="font-body text-xs tracking-wider uppercase" onClick={() => setShowAddCard(true)}>
          <Plus size={14} className="mr-1" /> Add Card
        </Button>
      </div>

      {/* Add Card Dialog */}
      {showAddCard && (
        <CardFormDialog
          title="Add New Card"
          cardState={newCard}
          setCardState={(updater) => setNewCard(updater)}
          onSave={handleAddCard}
          onClose={() => setShowAddCard(false)}
          saveLabel="Add Card"
        />
      )}

      {/* Edit Card Dialog */}
      {editingCard && (
        <CardFormDialog
          title="Edit Card"
          cardState={editingCard}
          setCardState={(updater) => setEditingCard(prev => prev ? { ...prev, ...updater(prev) } : prev)}
          onSave={handleSaveEdit}
          onClose={() => setEditingCard(null)}
          saveLabel="Save Changes"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(card => (
          <div key={card.id} className={`bg-card border rounded-lg p-5 relative ${card.isDefault ? "border-primary" : "border-border"}`}>
            {card.isDefault && (
              <Badge className="absolute top-3 right-3 bg-primary/10 text-primary border-0 font-body text-[10px]">Default</Badge>
            )}
            <div className="flex items-center gap-3 mb-3">
              <CardBrandIcon type={card.type} size={28} />
              <div>
                <p className="font-body text-sm font-medium text-foreground">{card.type} •••• {card.last4}</p>
                <p className="font-body text-xs text-muted-foreground">Expires {card.expiry}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => handleEditCard(card)}><Edit2 size={12} className="mr-1" /> Edit</Button>
              {!card.isDefault && (
                <>
                  <Button variant="outline" size="sm" className="font-body text-xs text-primary" onClick={() => {
                    setCards(cards.map(c => ({ ...c, isDefault: c.id === card.id })));
                    toast({ title: `${card.type} •••• ${card.last4} set as default` });
                  }}>
                    <Check size={12} className="mr-1" /> Set as Default
                  </Button>
                  <Button variant="ghost" size="sm" className="font-body text-xs text-destructive" onClick={() => setCards(cards.filter(c => c.id !== card.id))}>
                    <Trash2 size={12} className="mr-1" /> Remove
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState(mockNotifications.map(n => ({ ...n })));
  const [typeFilter, setTypeFilter] = useState("all");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    if (readFilter === "unread" && n.read) return false;
    if (readFilter === "read" && !n.read) return false;
    return true;
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({ title: "All notifications marked as read" });
  };

  const toggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Notification deleted" });
  };

  const clearAll = () => {
    setNotifications([]);
    toast({ title: "All notifications cleared" });
  };

  const typeFilters = [
    { key: "all", label: "All" },
    { key: "order", label: "Orders" },
    { key: "promo", label: "Promotions" },
    { key: "review", label: "Reviews" },
  ];

  const typeStyles: Record<string, string> = {
    order: "bg-blue-500/10 text-blue-600",
    promo: "bg-amber-500/10 text-amber-600",
    review: "bg-green-500/10 text-green-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="font-body text-xs">{unreadCount} unread</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="font-body text-xs text-primary" onClick={markAllRead}>
              <Check size={14} className="mr-1" /> Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" className="font-body text-xs text-destructive hover:text-destructive" onClick={clearAll}>
              <Trash2 size={14} className="mr-1" /> Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Type filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {typeFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-body transition-colors ${
                typeFilter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Read filter */}
        <div className="flex items-center gap-1.5 sm:ml-auto">
          {(["all", "unread", "read"] as const).map(f => (
            <button
              key={f}
              onClick={() => setReadFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-body capitalize transition-colors ${
                readFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <Bell size={32} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-body text-sm text-muted-foreground">No notifications</p>
              <p className="font-body text-xs text-muted-foreground/70 mt-1">
                {notifications.length > 0 ? "Try adjusting your filters" : "You're all caught up!"}
              </p>
            </motion.div>
          ) : (
            filtered.map(n => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                className={`bg-card border border-border rounded-lg p-4 flex gap-3 group cursor-pointer transition-colors hover:bg-secondary/30 ${!n.read ? "border-l-2 border-l-primary" : ""}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${typeStyles[n.type] || "bg-muted text-muted-foreground"}`}>
                  {n.type === "order" ? <Truck size={16} /> : n.type === "promo" ? <Gift size={16} /> : <Star size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-body text-sm ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                    <span className="text-[10px] text-muted-foreground font-body flex-shrink-0 ml-2">{n.time}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{n.message}</p>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleRead(n.id); }}
                      className="text-[11px] font-body text-primary hover:underline"
                    >
                      {n.read ? "Mark unread" : "Mark read"}
                    </button>
                    <span className="text-muted-foreground/30">·</span>
                    {deleteConfirm === n.id ? (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                          className="text-[11px] font-body text-destructive hover:underline"
                        >
                          Confirm delete
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                          className="text-[11px] font-body text-muted-foreground hover:underline"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(n.id); }}
                        className="text-[11px] font-body text-destructive/70 hover:text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

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
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-body text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

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
              <button
                onClick={async () => { await signOut(); navigate("/"); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-body text-sm text-destructive hover:bg-destructive/5 transition-colors text-left"
              >
                <LogOut size={18} />
                Sign Out
              </button>
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
    </div>
  );
};

export default UserDashboard;
