import { useState } from "react";
import { Upload, Image as ImageIcon, Grid, List, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

const initialMedia = [
  { id: 1, src: product1, name: "product-1.jpg", size: "245 KB" },
  { id: 2, src: product2, name: "product-2.jpg", size: "312 KB" },
  { id: 3, src: product3, name: "product-3.jpg", size: "198 KB" },
  { id: 4, src: product4, name: "product-4.jpg", size: "287 KB" },
  { id: 5, src: product5, name: "product-5.jpg", size: "356 KB" },
  { id: 6, src: product6, name: "product-6.jpg", size: "224 KB" },
  { id: 7, src: product7, name: "product-7.jpg", size: "301 KB" },
  { id: 8, src: product8, name: "product-8.jpg", size: "267 KB" },
];

const AdminMedia = () => {
  const [media, setMedia] = useState(initialMedia);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Media Library</h1>
          <p className="font-body text-sm text-muted-foreground">{media.length} files</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-secondary rounded-lg p-0.5">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-card shadow-sm" : ""}`}><Grid size={14} /></button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-card shadow-sm" : ""}`}><List size={14} /></button>
          </div>
          <Button className="font-body text-xs tracking-wider uppercase"><Upload size={14} className="mr-1" /> Upload</Button>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card">
        <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
        <p className="font-body text-sm text-muted-foreground">Drag & drop files here or click to upload</p>
        <p className="font-body text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map(m => (
            <div key={m.id} className="group relative bg-card border border-border rounded-xl overflow-hidden">
              <img src={m.src} alt={m.name} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => { setMedia(media.filter(x => x.id !== m.id)); toast({ title: "Deleted" }); }} className="p-2 bg-card rounded-full"><Trash2 size={16} className="text-destructive" /></button>
              </div>
              <div className="p-2">
                <p className="font-body text-xs text-foreground truncate">{m.name}</p>
                <p className="font-body text-[10px] text-muted-foreground">{m.size}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <tbody>
              {media.map(m => (
                <tr key={m.id} className="border-b border-border hover:bg-secondary/20">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <img src={m.src} alt={m.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-body text-sm text-foreground">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 font-body text-sm text-muted-foreground">{m.size}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => { setMedia(media.filter(x => x.id !== m.id)); toast({ title: "Deleted" }); }} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
