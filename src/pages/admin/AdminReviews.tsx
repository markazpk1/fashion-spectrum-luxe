import { useState } from "react";
import { Star, Check, Trash2, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: number;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

const mockReviews: Review[] = [
  { id: 1, customer: "Sara Ahmed", product: "Champagne Sequin Evening Gown", rating: 5, comment: "Absolutely stunning! The quality is exceptional and it fits perfectly.", date: "Feb 25, 2025", status: "Approved" },
  { id: 2, customer: "Fatima Noor", product: "Emerald Velvet Blazer", rating: 4, comment: "Beautiful blazer, great material. Shipping was a bit slow.", date: "Feb 24, 2025", status: "Approved" },
  { id: 3, customer: "Ali Raza", product: "Black Paisley Long Cape", rating: 5, comment: "My wife loved it! Will definitely buy more.", date: "Feb 23, 2025", status: "Pending" },
  { id: 4, customer: "Zainab Khan", product: "Ruby Gala Beaded Maxi Dress", rating: 3, comment: "Dress is nice but the beading was slightly different from the photo.", date: "Feb 22, 2025", status: "Pending" },
  { id: 5, customer: "Hassan Malik", product: "Tropical Tigress Kimono", rating: 5, comment: "Perfect gift for my sister. She absolutely adores it!", date: "Feb 21, 2025", status: "Approved" },
  { id: 6, customer: "Ayesha Siddiqui", product: "Coral Bloom Kaftan Dress", rating: 2, comment: "Size was too small even though I ordered my usual size.", date: "Feb 20, 2025", status: "Rejected" },
];

const AdminReviews = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? reviews : reviews.filter(r => r.status === filter);

  const updateStatus = (id: number, status: Review["status"]) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
    toast({ title: `Review ${status.toLowerCase()}` });
  };

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  const statusColor: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Reviews</h1>
        <p className="font-body text-sm text-muted-foreground">{reviews.length} reviews · Avg {avgRating} ★</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: reviews.length, icon: MessageSquare },
          { label: "Pending", value: reviews.filter(r => r.status === "Pending").length, icon: Eye },
          { label: "Approved", value: reviews.filter(r => r.status === "Approved").length, icon: Check },
          { label: "Avg Rating", value: avgRating, icon: Star },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 text-center">
            <s.icon size={18} className="mx-auto text-primary mb-2" />
            <p className="font-heading text-xl font-semibold text-foreground">{s.value}</p>
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["All", "Pending", "Approved", "Rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg font-body text-xs transition-all ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading text-xs font-semibold">
                    {r.customer.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{r.customer}</p>
                    <p className="font-body text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <p className="font-body text-xs text-primary font-medium mt-2">{r.product}</p>
                <div className="flex items-center gap-0.5 my-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < r.rating ? "text-accent fill-accent" : "text-muted-foreground/30"} />
                  ))}
                </div>
                <p className="font-body text-sm text-foreground">{r.comment}</p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-body font-medium flex-shrink-0 ${statusColor[r.status]}`}>{r.status}</span>
            </div>
            {r.status === "Pending" && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button size="sm" className="font-body text-xs" onClick={() => updateStatus(r.id, "Approved")}>
                  <Check size={12} className="mr-1" /> Approve
                </Button>
                <Button variant="outline" size="sm" className="font-body text-xs text-destructive" onClick={() => updateStatus(r.id, "Rejected")}>
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
