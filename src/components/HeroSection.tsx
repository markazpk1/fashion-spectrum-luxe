import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[85vh] md:h-screen overflow-hidden">
      <img
        src={heroBanner}
        alt="FashionSpectrum luxury resort wear collection"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-transparent" />
      
      <div className="relative h-full flex items-end pb-16 md:pb-24 px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="max-w-lg"
        >
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-light text-primary-foreground leading-tight mb-4">
            Luxurious
            <br />
            <span className="font-semibold italic">Resort Wear</span>
          </h1>
          <p className="font-body text-sm md:text-base text-primary-foreground/80 tracking-wide mb-8 max-w-sm">
            Discover our latest collection of handcrafted kaftans, dresses & resort wear designed for the modern woman.
          </p>
          <a
            href="#new-arrivals"
            className="inline-block font-body text-xs tracking-[0.2em] uppercase bg-primary-foreground text-charcoal px-8 py-4 hover:bg-gold hover:text-primary-foreground transition-all duration-500"
          >
            Shop Collection
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
