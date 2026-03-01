import { useState, useRef } from "react";
import { Heart, Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import SearchOverlay from "./SearchOverlay";

const whereToBuyLinks = [
  { label: "Ambia collections", url: "https://www.ambia.com.au/" },
  { label: "Pizzaz boutique", url: "https://pizazzboutique.com.au/" },
];

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Safari Collection", to: "/safari-collection" },
  { label: "Paradise Collection", to: "/paradise-collection" },
  { label: "Where to Buy", to: "/shop" },
  { label: "Contact Us", to: "/contact-us" },
  { label: "Our Story", to: "/our-story" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [whereToBuyOpen, setWhereToBuyOpen] = useState(false);
  const [mobileWhereToBuyOpen, setMobileWhereToBuyOpen] = useState(false);
  const whereToBuyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { openCart, totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const location = useLocation();

  const handleWhereToBuyEnter = () => {
    if (whereToBuyTimeout.current) clearTimeout(whereToBuyTimeout.current);
    setWhereToBuyOpen(true);
  };
  const handleWhereToBuyLeave = () => {
    whereToBuyTimeout.current = setTimeout(() => setWhereToBuyOpen(false), 200);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.08)]">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center px-6 xl:px-10 py-3">
          {/* Logo */}
          <Link to="/" className="font-heading text-xl xl:text-2xl font-semibold tracking-wider text-primary uppercase shrink-0">
            FashionSpectrum
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-4 xl:gap-7 ml-6 xl:ml-10">
            {navLinks.map((link) =>
              link.label === "Where to Buy" ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={handleWhereToBuyEnter}
                  onMouseLeave={handleWhereToBuyLeave}
                >
                  <span
                    className={`font-body text-xs xl:text-sm tracking-[0.1em] xl:tracking-[0.15em] uppercase transition-colors duration-300 hover:text-primary cursor-pointer whitespace-nowrap ${
                      location.pathname === link.to
                        ? "text-primary font-medium"
                        : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </span>
                  <AnimatePresence>
                    {whereToBuyOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 min-w-[200px] bg-foreground rounded-md shadow-lg py-3 z-50"
                      >
                        {whereToBuyLinks.map((item) => (
                          <a
                            key={item.label}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-5 py-2 text-sm font-body text-background hover:text-primary-foreground/80 transition-colors"
                          >
                            {item.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`font-body text-xs xl:text-sm tracking-[0.1em] xl:tracking-[0.15em] uppercase transition-colors duration-300 hover:text-primary whitespace-nowrap ${
                    location.pathname === link.to
                      ? "text-primary font-medium"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              to="/account"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Account"
            >
              <User size={20} />
            </Link>
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

        {/* Mobile / Tablet Layout */}
        <div className="flex lg:hidden items-center justify-between px-4 sm:px-6 py-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground hover:text-primary transition-colors z-10"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="font-heading text-lg sm:text-xl font-semibold tracking-wider text-primary uppercase absolute left-1/2 -translate-x-1/2">
            FashionSpectrum
          </Link>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              onClick={openCart}
              className="relative text-foreground hover:text-primary transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
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
                {navLinks.map((link) =>
                  link.label === "Where to Buy" ? (
                    <div key={link.label}>
                      <button
                        onClick={() => setMobileWhereToBuyOpen(!mobileWhereToBuyOpen)}
                        className="font-body text-sm tracking-[0.15em] uppercase text-foreground w-full text-left"
                      >
                        {link.label}
                      </button>
                      <AnimatePresence>
                        {mobileWhereToBuyOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4 mt-2 flex flex-col gap-2"
                          >
                            {whereToBuyLinks.map((item) => (
                              <a
                                key={item.label}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMobileOpen(false)}
                                className="font-body text-sm tracking-[0.1em] text-muted-foreground hover:text-primary transition-colors"
                              >
                                {item.label}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`font-body text-sm tracking-[0.15em] uppercase ${
                        location.pathname === link.to
                          ? "text-primary font-medium"
                          : "text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
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
