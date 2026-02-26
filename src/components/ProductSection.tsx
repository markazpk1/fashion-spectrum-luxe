import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

interface ProductSectionProps {
  title: string;
  products: Product[];
  id?: string;
  viewAllLabel?: string;
}

const ProductSection = ({ title, products, id, viewAllLabel = "View All" }: ProductSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section id={id} className="py-16 md:py-24 px-6 md:px-16">
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-heading text-3xl md:text-5xl font-light text-foreground">
          {title}
        </h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="border border-border p-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="border border-border p-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4"
      >
        {products.map((product, i) => (
          <div key={product.id} className="flex-shrink-0 w-[260px] md:w-[300px]">
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <a
          href="#"
          className="inline-block font-body text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 text-foreground hover:text-primary hover:border-primary transition-colors duration-300"
        >
          {viewAllLabel}
        </a>
      </div>
    </section>
  );
};

export default ProductSection;
