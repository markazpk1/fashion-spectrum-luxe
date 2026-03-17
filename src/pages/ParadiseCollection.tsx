import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import JSZip from "jszip";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { paradiseProducts } from "@/lib/paradiseProducts";
import { SlidersHorizontal, ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Import the 16 new images directly for download
import paradise48 from "@/assets/paradise/paradise-48.jpg";
import paradise49 from "@/assets/paradise/paradise-49.jpg";
import paradise50 from "@/assets/paradise/paradise-50.jpg";
import paradise51 from "@/assets/paradise/paradise-51.jpg";
import paradise52 from "@/assets/paradise/paradise-52.jpg";
import paradise53 from "@/assets/paradise/paradise-53.jpg";
import paradise54 from "@/assets/paradise/paradise-54.jpg";
import paradise55 from "@/assets/paradise/paradise-55.jpg";
import paradise56 from "@/assets/paradise/paradise-56.jpg";
import paradise57 from "@/assets/paradise/paradise-57.jpg";
import paradise58 from "@/assets/paradise/paradise-58.jpg";
import paradise59 from "@/assets/paradise/paradise-59.jpg";
import paradise60 from "@/assets/paradise/paradise-60.jpg";
import paradise61 from "@/assets/paradise/paradise-61.jpg";
import paradise62 from "@/assets/paradise/paradise-62.jpg";
import paradise63 from "@/assets/paradise/paradise-63.jpg";

const newImages = [
  { src: paradise48, name: "Zahara-Pink-Tank-Top.jpg" },
  { src: paradise49, name: "Monet-Orange-Hi-Low-Dress.jpg" },
  { src: paradise50, name: "Monet-Orange-Wrap-Pant.jpg" },
  { src: paradise51, name: "Monet-Orange-Long-Box-Kaftan.jpg" },
  { src: paradise52, name: "Monet-Orange-Tunic-Dress.jpg" },
  { src: paradise53, name: "Monet-Orange-Gypsy-Top.jpg" },
  { src: paradise54, name: "Monet-Orange-Tank-Top.jpg" },
  { src: paradise55, name: "Monet-Orange-Short-Jacket.jpg" },
  { src: paradise56, name: "Monet-Orange-Shirt.jpg" },
  { src: paradise57, name: "Marigold-Aqua-Brown-Short-Kaftan.jpg" },
  { src: paradise58, name: "Marigold-Aqua-Brown-Long-Shirt-Dress.jpg" },
  { src: paradise59, name: "Garden-Delight-Long-Kaftan-Coral.jpg" },
  { src: paradise60, name: "Garden-Delight-Long-Kaftan-Aqua.jpg" },
  { src: paradise61, name: "Garden-Delight-Shirt.jpg" },
  { src: paradise62, name: "Tiger-Brown-Short-Kaftan.jpg" },
  { src: paradise63, name: "Tiger-Brown-Short-Frill-Dress.jpg" },
];

const sortOptions = [
  { label: "Sort by popularity", value: "popular" },
  { label: "Sort by latest", value: "latest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
];

const ParadiseCollection = () => {
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadAll = async () => {
    setDownloading(true);
    toast({ title: "Preparing ZIP", description: "Packaging 16 images..." });
    try {
      const zip = new JSZip();
      for (const img of newImages) {
        const response = await fetch(img.src);
        const blob = await response.blob();
        zip.file(img.name, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Paradise-Collection-New-16.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Done!", description: "ZIP file downloaded." });
    } catch {
      toast({ title: "Error", description: "Failed to create ZIP.", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(paradiseProducts.map((p) => p.category)));
    return ["All", ...cats.sort()];
  }, []);

  const filtered = useMemo(() => {
    let items = selectedCategory === "All"
      ? [...paradiseProducts]
      : paradiseProducts.filter((p) => p.category === selectedCategory);

    switch (sortBy) {
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
      case "latest":
        items.reverse();
        break;
      default:
        break;
    }
    return items;
  }, [sortBy, selectedCategory]);

  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      <AnnouncementBar content={{ text: "Explore the Paradise Collection!", enabled: true }} />
      <Navbar />

      {/* Header */}
      <div className="py-12 md:py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl md:text-5xl text-foreground"
        >
          Paradise Collection
        </motion.h1>
        <p className="font-body text-sm text-muted-foreground mt-3 tracking-wide">
          {filtered.length} Products
        </p>
        <Button
          onClick={handleDownloadAll}
          disabled={downloading}
          className="mt-4 gap-2"
          variant="outline"
        >
          <Download size={16} />
          {downloading ? "Downloading..." : "Download Latest 16 Images"}
        </Button>
      </div>

      {/* Toolbar */}
      <div className="container mx-auto px-4 sm:px-6 mb-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 font-body text-sm tracking-wide text-foreground hover:text-primary transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent font-body text-sm tracking-wide text-foreground pr-6 cursor-pointer focus:outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden py-4 flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-body text-xs tracking-wider border transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:border-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ParadiseCollection;
