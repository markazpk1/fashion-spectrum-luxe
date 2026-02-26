import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/lib/products";
import { slugify } from "@/lib/productUtils";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, "M");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <Link to={`/product/${slugify(product.name)}`}>
        <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            loading="lazy"
          />
          
          {/* Shimmer overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {product.badge && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className={`absolute top-3 left-3 font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 ${
                product.badge === "Sale"
                  ? "bg-sale text-primary-foreground"
                  : product.badge === "Sold out"
                  ? "bg-charcoal text-primary-foreground"
                  : "bg-background text-foreground"
              }`}
            >
              {product.badge}
            </motion.span>
          )}

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="bg-background/90 backdrop-blur-sm p-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
              aria-label="Add to wishlist"
            >
              <Heart size={15} />
            </button>
            <Link
              to={`/product/${slugify(product.name)}`}
              className="bg-background/90 backdrop-blur-sm p-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
              aria-label="View product"
            >
              <Eye size={15} />
            </Link>
          </div>

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-charcoal/90 backdrop-blur-sm text-primary-foreground font-body text-xs tracking-[0.2em] uppercase py-3.5 hover:bg-primary transition-colors duration-300"
            >
              Quick Add — Size M
            </button>
          </div>
        </div>
      </Link>

      <Link to={`/product/${slugify(product.name)}`} className="block pt-4 space-y-1">
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
      </Link>
    </motion.div>
  );
};

export default ProductCard;
