import { FileText, Edit2, Eye, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const pages = [
  { name: "Home", path: "/", status: "Published", updated: "Feb 27, 2025" },
  { name: "Shop", path: "/shop", status: "Published", updated: "Feb 25, 2025" },
  { name: "Collections", path: "/collections", status: "Published", updated: "Feb 20, 2025" },
  { name: "New Arrivals", path: "/new-arrivals", status: "Published", updated: "Feb 22, 2025" },
  { name: "Sale", path: "/sale", status: "Published", updated: "Feb 18, 2025" },
  { name: "Best Sellers", path: "/best-sellers", status: "Published", updated: "Feb 15, 2025" },
  { name: "About", path: "/about", status: "Draft", updated: "Feb 10, 2025" },
  { name: "Contact", path: "/contact", status: "Draft", updated: "Feb 8, 2025" },
];

const AdminPages = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Pages</h1>
      <p className="font-body text-sm text-muted-foreground">Manage storefront pages</p>
    </div>

    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Page</th>
            <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Path</th>
            <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Status</th>
            <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Updated</th>
            <th className="text-right px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(p => (
            <tr key={p.name} className="border-b border-border hover:bg-secondary/20">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><FileText size={14} className="text-primary" /></div>
                  <span className="font-body text-sm font-medium text-foreground">{p.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 font-body text-sm text-muted-foreground hidden sm:table-cell">{p.path}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-body font-medium ${p.status === "Published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
              </td>
              <td className="px-4 py-3 font-body text-sm text-muted-foreground hidden md:table-cell">{p.updated}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                  <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminPages;
