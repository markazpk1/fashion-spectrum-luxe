import { useState } from "react";
import { Heart, Search, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import SearchOverlay from "./SearchOverlay";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Sale", to: "/sale" },
  { label: "Best Sellers", to: "/best-sellers" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { openCart, totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.08)]">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <Link to="/" className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-wider text-primary uppercase lg:flex-none absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            FashionSpectrum
          </Link>

           <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`font-body text-sm tracking-[0.15em] uppercase transition-colors duration-300 hover:text-primary ${
                  location.pathname === link.to
                    ? "text-primary font-medium"
                    : link.label === "Sale"
                    ? "text-sale font-medium"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              to="/wishlist"
              className="relative text-foreground hover:text-primary transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-sale text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
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
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`font-body text-sm tracking-[0.15em] uppercase ${
                      link.label === "Sale" ? "text-sale font-medium" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-sm tracking-[0.15em] uppercase text-foreground"
                >
                  Wishlist ({wishlistCount})
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
