import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, Eye, X, Package, Truck, Clock, CheckCircle,
  XCircle, ChevronDown, Download, MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: string;
  payment: string;
  date: string;
  address: string;
}

const mockOrders: Order[] = [
  { id: "FS-20250227", customer: "Sara Ahmed", email: "sara@email.com", items: 3, total: 1298, status: "Processing", payment: "Credit Card", date: "Feb 27, 2025", address: "Karachi, Sindh" },
  { id: "FS-20250226", customer: "Fatima Noor", email: "fatima@email.com", items: 1, total: 799, status: "Shipped", payment: "COD", date: "Feb 26, 2025", address: "Lahore, Punjab" },
  { id: "FS-20250225", customer: "Ali Raza", email: "ali@email.com", items: 4, total: 2150, status: "Delivered", payment: "Credit Card", date: "Feb 25, 2025", address: "Islamabad, ICT" },
  { id: "FS-20250224", customer: "Zainab Khan", email: "zainab@email.com", items: 2, total: 449, status: "Processing", payment: "Bank Transfer", date: "Feb 24, 2025", address: "Rawalpindi, Punjab" },
  { id: "FS-20250223", customer: "Hassan Malik", email: "hassan@email.com", items: 5, total: 1899, status: "Shipped", payment: "Credit Card", date: "Feb 23, 2025", address: "Faisalabad, Punjab" },
  { id: "FS-20250222", customer: "Ayesha Siddiqui", email: "ayesha@email.com", items: 1, total: 499, status: "Cancelled", payment: "Credit Card", date: "Feb 22, 2025", address: "Multan, Punjab" },
  { id: "FS-20250221", customer: "Usman Tariq", email: "usman@email.com", items: 2, total: 998, status: "Delivered", payment: "COD", date: "Feb 21, 2025", address: "Peshawar, KPK" },
  { id: "FS-20250220", customer: "Mariam Akhtar", email: "mariam@email.com", items: 3, total: 1650, status: "Refunded", payment: "Credit Card", date: "Feb 20, 2025", address: "Quetta, Balochistan" },
];

const statuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

const statusColor: Record<string, string> = {
  Processing: "bg-amber-100 text-amber-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  Refunded: "bg-purple-100 text-purple-700",
};

const statusIcon: Record<string, React.ElementType> = {
  Processing: Clock,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: XCircle,
  Refunded: XCircle,
};

const AdminOrders = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === filtered.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filtered.map(o => o.id)));
    }
  };

  const exportCSV = (rows: Order[]) => {
    const headers = ["Order ID", "Customer", "Email", "Items", "Total", "Status", "Payment", "Date", "Address"];
    const csv = [
      headers.join(","),
      ...rows.map(o => [o.id, o.customer, o.email, o.items, o.total, o.status, o.payment, o.date, `"${o.address}"`].join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `${rows.length} orders exported to CSV` });
  };

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    toast({ title: `Order ${id} marked as ${newStatus}` });
  };

  const bulkUpdateStatus = (newStatus: string) => {
    setOrders(orders.map(o => selectedRows.has(o.id) ? { ...o, status: newStatus } : o));
    toast({ title: `${selectedRows.size} orders marked as ${newStatus}` });
    setSelectedRows(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Orders</h1>
          <p className="font-body text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
        <div className="flex gap-2">
          {selectedRows.size > 0 && (
            <>
              <Button variant="outline" className="font-body text-xs tracking-wider uppercase" onClick={() => exportCSV(filtered.filter(o => selectedRows.has(o.id)))}>
                <Download size={14} className="mr-1" /> Export ({selectedRows.size})
              </Button>
              <select
                onChange={e => { if (e.target.value) { bulkUpdateStatus(e.target.value); e.target.value = ""; } }}
                defaultValue=""
                className="h-9 px-3 rounded-md border border-border bg-card font-body text-xs tracking-wider uppercase text-foreground cursor-pointer"
              >
                <option value="" disabled>Bulk Status...</option>
                {["Processing", "Shipped", "Delivered", "Cancelled", "Refunded"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </>
          )}
          <Button variant="outline" className="font-body text-xs tracking-wider uppercase" onClick={() => exportCSV(filtered)}>
            <Download size={14} className="mr-1" /> Export All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statuses.filter(s => s !== "All").concat(["Refunded"]).filter((v, i, a) => a.indexOf(v) === i).map(s => {
          const count = orders.filter(o => o.status === s).length;
          const Icon = statusIcon[s] || Package;
          return (
            <div key={s} className="bg-card border border-border rounded-lg p-3 text-center cursor-pointer hover:shadow-sm transition-shadow" onClick={() => setStatusFilter(s)}>
              <Icon size={18} className="mx-auto text-muted-foreground mb-1" />
              <p className="font-heading text-xl font-semibold text-foreground">{count}</p>
              <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{s}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by order ID or customer..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-card border-border font-body" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg font-body text-xs whitespace-nowrap transition-all ${
                statusFilter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground w-10">
                  <input type="checkbox" checked={selectedRows.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-border accent-primary" />
                </th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Order</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Customer</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Total</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Payment</th>
                <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 w-10">
                    <input type="checkbox" checked={selectedRows.has(o.id)} onChange={() => toggleRow(o.id)} className="rounded border-border accent-primary" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm font-medium text-foreground">{o.id}</p>
                    <p className="font-body text-xs text-muted-foreground sm:hidden">{o.customer}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="font-body text-sm text-foreground">{o.customer}</p>
                    <p className="font-body text-xs text-muted-foreground">{o.email}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-muted-foreground hidden md:table-cell">{o.date}</td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm font-medium text-foreground">₨ {o.total.toLocaleString()}</p>
                    <p className="font-body text-xs text-muted-foreground">{o.items} items</p>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-muted-foreground hidden md:table-cell">{o.payment}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-body font-medium border-0 cursor-pointer ${statusColor[o.status]}`}
                    >
                      {statuses.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button onClick={() => setSelectedOrder(o)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSelectedOrder(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-50 bg-background border border-border rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-semibold text-foreground">Order {selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[
                ["Customer", selectedOrder.customer],
                ["Email", selectedOrder.email],
                ["Date", selectedOrder.date],
                ["Items", `${selectedOrder.items} items`],
                ["Total", `₨ ${selectedOrder.total.toLocaleString()}`],
                ["Payment", selectedOrder.payment],
                ["Address", selectedOrder.address],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="font-body text-sm text-muted-foreground">{label}</span>
                  <span className="font-body text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-muted-foreground">Status</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-body font-medium ${statusColor[selectedOrder.status]}`}>{selectedOrder.status}</span>
              </div>
            </div>
            <Button className="w-full mt-5 font-body text-xs tracking-wider uppercase" onClick={() => setSelectedOrder(null)}>Close</Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
