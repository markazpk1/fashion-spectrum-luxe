import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-primary-foreground">
      {/* Newsletter */}
      <div className="border-b border-primary-foreground/10 py-12 px-6 md:px-16">
        <div className="max-w-md mx-auto text-center">
          <h3 className="font-heading text-2xl md:text-3xl mb-3">Join the FashionSpectrum World</h3>
          <p className="font-body text-xs text-primary-foreground/60 tracking-wide mb-6">
            Subscribe for exclusive access to new collections, special offers & more.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent border border-primary-foreground/20 px-4 py-3 font-body text-xs tracking-wider text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-gold"
            />
            <button className="bg-primary text-primary-foreground px-6 py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 px-6 md:px-16 max-w-6xl mx-auto">
        <div>
          <h4 className="font-body text-xs tracking-[0.2em] uppercase mb-4 text-primary-foreground/80">Shop</h4>
          <ul className="space-y-2">
            {["Kaftans", "Dresses", "Co-Ord Sets", "Tops & Tunics", "Accessories"].map((item) => (
              <li key={item}>
                <a href="#" className="font-body text-xs text-primary-foreground/50 hover:text-gold transition-colors duration-300">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-[0.2em] uppercase mb-4 text-primary-foreground/80">Know Us</h4>
          <ul className="space-y-2">
            {["About Us", "Contact", "Sizing Guide", "Boutique Locations"].map((item) => (
              <li key={item}>
                <a href="#" className="font-body text-xs text-primary-foreground/50 hover:text-gold transition-colors duration-300">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-[0.2em] uppercase mb-4 text-primary-foreground/80">Policies</h4>
          <ul className="space-y-2">
            {["Privacy Policy", "Shipping", "Returns", "Terms & Conditions"].map((item) => (
              <li key={item}>
                <a href="#" className="font-body text-xs text-primary-foreground/50 hover:text-gold transition-colors duration-300">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-[0.2em] uppercase mb-4 text-primary-foreground/80">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="text-primary-foreground/50 hover:text-gold transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-primary-foreground/50 hover:text-gold transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-primary-foreground/50 hover:text-gold transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-primary-foreground/10 py-6 px-6 text-center">
        <p className="font-body text-[10px] text-primary-foreground/40 tracking-wider">
          © 2026 FashionSpectrum. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
