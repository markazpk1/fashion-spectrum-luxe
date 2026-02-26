import { useState } from "react";
import { Heart, Search, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { label: "Shop", href: "/#new-arrivals" },
  { label: "Collections", href: "/#collections" },
  { label: "New Arrivals", href: "/#new-arrivals" },
  { label: "Sale", href: "/#sale" },
  { label: "Best Sellers", href: "/#best-sellers" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, totalItems } = useCart();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className="font-heading text-2xl md:text-3xl font-semibold tracking-wider text-primary uppercase">
          FashionSpectrum
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={isHome ? link.href.replace("/", "") : link.href}
              className={`font-body text-sm tracking-[0.15em] uppercase transition-colors duration-300 hover:text-primary ${
                link.label === "Sale" ? "text-sale font-medium" : "text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-foreground hover:text-primary transition-colors" aria-label="Search">
            <Search size={20} />
          </button>
          <button className="hidden sm:block text-foreground hover:text-primary transition-colors" aria-label="Wishlist">
            <Heart size={20} />
          </button>
          <button
            onClick={openCart}
            className="relative text-foreground hover:text-primary transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            <motion.span
              key={totalItems}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body"
            >
              {totalItems}
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="flex flex-col py-4 px-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={isHome ? link.href.replace("/", "") : link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body text-sm tracking-[0.15em] uppercase ${
                    link.label === "Sale" ? "text-sale font-medium" : "text-foreground"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
