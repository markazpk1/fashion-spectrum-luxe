import { useState, useMemo } from "react";
import {
  Bell, Search, Filter, ShoppingCart, Users, Package, AlertTriangle,
  Trash2, Check, CheckCheck, ChevronDown, X, BellOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { playNotificationSound } from "@/lib/notificationSound";
import { useToast } from "@/hooks/use-toast";

type NotificationType = "order" | "customer" | "inventory" | "alert";
type NotificationStatus = "all" | "unread" | "read";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
  type: NotificationType;
}

const allNotifications: Notification[] = [
  { id: "1", title: "Payment Failed", message: "Order #1039 payment was declined. Customer: Chidi Eze. Amount: ₦120,000", time: "2 min ago", date: "2026-02-27", read: false, type: "alert" },
  { id: "2", title: "New Order #1042", message: "Sarah Johnson placed an order for ₦85,000. Items: Royal Blue Agbada, Gold Kaftan", time: "5 min ago", date: "2026-02-27", read: false, type: "order" },
  { id: "3", title: "Low Stock Alert", message: "Royal Blue Agbada is running low — only 3 units remaining in stock", time: "15 min ago", date: "2026-02-27", read: false, type: "inventory" },
  { id: "4", title: "New Customer", message: "Amara Obi just created an account and signed up for the newsletter", time: "1 hour ago", date: "2026-02-27", read: false, type: "customer" },
  { id: "5", title: "Refund Requested", message: "Customer Bola Adeyemi requested a refund for Order #1035 — Reason: Wrong size", time: "2 hours ago", date: "2026-02-27", read: true, type: "alert" },
  { id: "6", title: "Order Shipped", message: "Order #1038 has been shipped via DHL Express. Tracking: NG12345678", time: "3 hours ago", date: "2026-02-27", read: true, type: "order" },
  { id: "7", title: "New Order #1041", message: "Fatima Hassan placed an order for ₦45,000. Items: Embroidered Cap", time: "4 hours ago", date: "2026-02-27", read: true, type: "order" },
  { id: "8", title: "Out of Stock", message: "Traditional Wedding Agbada is now out of stock — 5 customers waitlisted", time: "5 hours ago", date: "2026-02-27", read: true, type: "inventory" },
  { id: "9", title: "New Customer", message: "Ngozi Okafor created an account from Instagram referral", time: "6 hours ago", date: "2026-02-27", read: true, type: "customer" },
  { id: "10", title: "Order Delivered", message: "Order #1035 was delivered successfully. Customer confirmed receipt", time: "8 hours ago", date: "2026-02-26", read: true, type: "order" },
  { id: "11", title: "Payment Failed", message: "Order #1033 payment failed — Card expired. Customer: Tunde Bakare", time: "10 hours ago", date: "2026-02-26", read: true, type: "alert" },
  { id: "12", title: "Bulk Order Inquiry", message: "Corporate client requested quote for 50 units of Senator wear", time: "12 hours ago", date: "2026-02-26", read: true, type: "customer" },
  { id: "13", title: "New Order #1040", message: "Kemi Afolabi placed an order for ₦200,000. Items: Luxury Lace Set", time: "14 hours ago", date: "2026-02-26", read: true, type: "order" },
  { id: "14", title: "Inventory Restocked", message: "Classic White Agbada restocked — 25 units added to inventory", time: "1 day ago", date: "2026-02-26", read: true, type: "inventory" },
  { id: "15", title: "Suspicious Activity", message: "Multiple failed login attempts detected from IP 192.168.1.45", time: "1 day ago", date: "2026-02-26", read: true, type: "alert" },
  { id: "16", title: "New Order #1039", message: "Emeka Nwosu placed an order for ₦65,000. Items: Casual Kaftan Set", time: "2 days ago", date: "2026-02-25", read: true, type: "order" },
  { id: "17", title: "Customer Feedback", message: "5-star review received from Aisha Mohammed for Gold Embroidered Agbada", time: "2 days ago", date: "2026-02-25", read: true, type: "customer" },
  { id: "18", title: "Low Stock Alert", message: "Silver Threaded Kaftan running low — only 2 units remaining", time: "3 days ago", date: "2026-02-24", read: true, type: "inventory" },
];

const typeConfig: Record<NotificationType, { icon: typeof Bell; label: string; color: string; badgeColor: string }> = {
  order: { icon: ShoppingCart, label: "Orders", color: "text-primary bg-primary/10", badgeColor: "bg-primary/10 text-primary border-primary/20" },
  customer: { icon: Users, label: "Customers", color: "text-emerald-600 bg-emerald-500/10", badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  inventory: { icon: Package, label: "Inventory", color: "text-amber-600 bg-amber-500/10", badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  alert: { icon: AlertTriangle, label: "Alerts", color: "text-destructive bg-destructive/10", badgeColor: "bg-destructive/10 text-destructive border-destructive/20" },
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(allNotifications);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<NotificationStatus>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Filtered notifications
  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (typeFilter !== "all" && n.type !== typeFilter) return false;
      if (statusFilter === "unread" && n.read) return false;
      if (statusFilter === "read" && !n.read) return false;
      if (search) {
        const q = search.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
      }
      return true;
    });
  }, [notifications, typeFilter, statusFilter, search]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    filtered.forEach((n) => {
      const label = n.date === "2026-02-27" ? "Today" : n.date === "2026-02-26" ? "Yesterday" : n.date;
      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    });
    return groups;
  }, [filtered]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const allSelected = filtered.length > 0 && filtered.every((n) => selectedIds.has(n.id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((n) => n.id)));
    }
  };

  const markSelectedRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (selectedIds.has(n.id) ? { ...n, read: true } : n))
    );
    toast({ title: `${selectedIds.size} notification(s) marked as read` });
    setSelectedIds(new Set());
  };

  const markSelectedUnread = () => {
    setNotifications((prev) =>
      prev.map((n) => (selectedIds.has(n.id) ? { ...n, read: false } : n))
    );
    toast({ title: `${selectedIds.size} notification(s) marked as unread` });
    setSelectedIds(new Set());
  };

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.has(n.id)));
    toast({ title: `${selectedIds.size} notification(s) deleted` });
    setSelectedIds(new Set());
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({ title: "All notifications marked as read" });
  };

  const clearAll = () => {
    setNotifications([]);
    setSelectedIds(new Set());
    toast({ title: "All notifications cleared" });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    selectedIds.delete(id);
    setSelectedIds(new Set(selectedIds));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell size={24} />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary font-body">
                {unreadCount} unread
              </Badge>
            )}
          </h1>
          <p className="text-sm font-body text-muted-foreground mt-1">
            Manage and review all system notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="font-body"
          >
            <CheckCheck size={14} className="mr-1.5" />
            Mark all read
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={notifications.length === 0}
                className="font-body text-destructive hover:text-destructive"
              >
                <Trash2 size={14} className="mr-1.5" />
                Clear all
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-heading">Clear all notifications?</AlertDialogTitle>
                <AlertDialogDescription className="font-body">
                  This will permanently remove all {notifications.length} notifications. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAll} className="font-body bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Clear all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.entries(typeConfig) as [NotificationType, typeof typeConfig[NotificationType]][]).map(([type, config]) => {
          const count = notifications.filter((n) => n.type === type).length;
          const unread = notifications.filter((n) => n.type === type && !n.read).length;
          const Icon = config.icon;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? "all" : type)}
              className={cn(
                "p-4 rounded-xl border transition-all text-left",
                typeFilter === type
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:bg-secondary/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.color)}>
                  <Icon size={16} />
                </div>
                {unread > 0 && (
                  <Badge variant="outline" className={cn("text-[10px] font-body", config.badgeColor)}>
                    {unread} new
                  </Badge>
                )}
              </div>
              <p className="text-sm font-body font-medium text-foreground">{config.label}</p>
              <p className="text-xs font-body text-muted-foreground">{count} total</p>
            </button>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 font-body bg-secondary/50 border-0"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as NotificationType | "all")}>
          <SelectTrigger className="w-full sm:w-40 font-body bg-secondary/50 border-0">
            <Filter size={14} className="mr-2 text-muted-foreground" />
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-body">All types</SelectItem>
            <SelectItem value="order" className="font-body">Orders</SelectItem>
            <SelectItem value="customer" className="font-body">Customers</SelectItem>
            <SelectItem value="inventory" className="font-body">Inventory</SelectItem>
            <SelectItem value="alert" className="font-body">Alerts</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as NotificationStatus)}>
          <SelectTrigger className="w-full sm:w-40 font-body bg-secondary/50 border-0">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-body">All status</SelectItem>
            <SelectItem value="unread" className="font-body">Unread</SelectItem>
            <SelectItem value="read" className="font-body">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <span className="text-sm font-body text-foreground font-medium">
            {selectedIds.size} selected
          </span>
          <Separator orientation="vertical" className="h-5" />
          <Button variant="ghost" size="sm" onClick={markSelectedRead} className="font-body text-xs">
            <Check size={12} className="mr-1" /> Mark read
          </Button>
          <Button variant="ghost" size="sm" onClick={markSelectedUnread} className="font-body text-xs">
            <BellOff size={12} className="mr-1" /> Mark unread
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="font-body text-xs text-destructive hover:text-destructive">
                <Trash2 size={12} className="mr-1" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-heading">Delete selected notifications?</AlertDialogTitle>
                <AlertDialogDescription className="font-body">
                  This will permanently remove {selectedIds.size} notification(s).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteSelected} className="font-body bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-muted-foreground hover:text-foreground">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Notification List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Select all header */}
        {filtered.length > 0 && (
          <>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-secondary/30 border-b border-border">
              <button
                onClick={toggleSelectAll}
                className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                  allSelected
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30 hover:border-primary"
                )}
              >
                {allSelected && <Check size={10} />}
              </button>
              <span className="text-xs font-body text-muted-foreground">
                {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
                {search && ` matching "${search}"`}
              </span>
            </div>
          </>
        )}

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Bell size={40} className="mx-auto text-muted-foreground/20 mb-3" />
            <p className="font-heading text-lg text-muted-foreground mb-1">No notifications found</p>
            <p className="text-sm font-body text-muted-foreground/70">
              {search || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "You're all caught up!"}
            </p>
            {(search || typeFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 font-body"
                onClick={() => { setSearch(""); setTypeFilter("all"); setStatusFilter("all"); }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className="px-4 py-2 bg-secondary/20 border-b border-border">
                <span className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                  {date}
                </span>
              </div>
              {items.map((notification) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;
                const isSelected = selectedIds.has(notification.id);
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3.5 border-b border-border last:border-0 transition-colors group",
                      !notification.read && "bg-primary/[0.02]",
                      isSelected && "bg-primary/[0.06]"
                    )}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(notification.id)}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors mt-1 flex-shrink-0",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/30 hover:border-primary"
                      )}
                    >
                      {isSelected && <Check size={10} />}
                    </button>

                    {/* Icon */}
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", config.color)}>
                      <Icon size={16} />
                    </div>

                    {/* Content */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={cn(
                          "text-sm font-body",
                          !notification.read ? "font-semibold text-foreground" : "text-foreground"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        )}
                        <Badge variant="outline" className={cn("text-[10px] font-body ml-auto hidden sm:inline-flex", config.badgeColor)}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm font-body text-muted-foreground leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs font-body text-muted-foreground/60 mt-1">
                        {notification.time}
                      </p>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1.5 rounded-md hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
