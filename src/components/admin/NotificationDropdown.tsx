import { useState } from "react";
import { Bell, Package, ShoppingCart, Users, AlertTriangle, Check, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "order" | "customer" | "inventory" | "alert";
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Order #1042",
    message: "Sarah Johnson placed an order for ₦85,000",
    time: "2 min ago",
    read: false,
    type: "order",
  },
  {
    id: "2",
    title: "Low Stock Alert",
    message: "Royal Blue Agbada is running low (3 left)",
    time: "15 min ago",
    read: false,
    type: "inventory",
  },
  {
    id: "3",
    title: "New Customer",
    message: "Amara Obi just created an account",
    time: "1 hour ago",
    read: false,
    type: "customer",
  },
  {
    id: "4",
    title: "Payment Failed",
    message: "Order #1039 payment was declined",
    time: "3 hours ago",
    read: true,
    type: "alert",
  },
  {
    id: "5",
    title: "Order Delivered",
    message: "Order #1035 was delivered successfully",
    time: "5 hours ago",
    read: true,
    type: "order",
  },
];

const typeIcons = {
  order: ShoppingCart,
  customer: Users,
  inventory: Package,
  alert: AlertTriangle,
};

const typeColors = {
  order: "text-primary bg-primary/10",
  customer: "text-emerald-600 bg-emerald-500/10",
  inventory: "text-amber-600 bg-amber-500/10",
  alert: "text-destructive bg-destructive/10",
};

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-body">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-heading text-sm font-semibold text-foreground">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-body text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center">
              <Bell size={24} className="mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm font-body text-muted-foreground">
                No notifications
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = typeIcons[notification.type];
              return (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-secondary/50 group",
                    !notification.read && "bg-primary/[0.03]"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      typeColors[notification.type]
                    )}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "text-sm font-body truncate",
                          !notification.read
                            ? "font-semibold text-foreground"
                            : "text-foreground"
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs font-body text-muted-foreground truncate mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-[10px] font-body text-muted-foreground/70 mt-1">
                      {notification.time}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full font-body text-xs text-muted-foreground">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
