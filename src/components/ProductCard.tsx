import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 ${
              product.badge === "Sale"
                ? "bg-sale text-primary-foreground"
                : product.badge === "Sold out"
                ? "bg-charcoal text-primary-foreground"
                : "bg-background text-foreground"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur-sm p-2 hover:bg-primary hover:text-primary-foreground"
          aria-label="Add to wishlist"
        >
          <Heart size={16} />
        </button>

        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <button className="w-full bg-charcoal/90 backdrop-blur-sm text-primary-foreground font-body text-xs tracking-[0.2em] uppercase py-3 hover:bg-primary transition-colors duration-300">
            Quick Add
          </button>
        </div>
      </div>

      <div className="pt-4 space-y-1">
        <h3 className="font-body text-xs tracking-[0.1em] uppercase text-foreground group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-body text-sm font-medium text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <>
              <span className="font-body text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className="font-body text-xs text-sale font-medium">
                Save {discount}%
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
