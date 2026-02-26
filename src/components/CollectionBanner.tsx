import { motion } from "framer-motion";
import collectionBanner from "@/assets/collection-banner.jpg";

const CollectionBanner = () => {
  return (
    <section id="collections" className="relative h-[50vh] md:h-[70vh] overflow-hidden">
      <img
        src={collectionBanner}
        alt="FashionSpectrum golden collection"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/30" />
      
      <div className="relative h-full flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/80 mb-4">
            Latest Collection
          </p>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-light text-primary-foreground mb-6 italic">
            Golden Lady
          </h2>
          <a
            href="#"
            className="inline-block font-body text-xs tracking-[0.2em] uppercase border border-primary-foreground text-primary-foreground px-8 py-3 hover:bg-primary-foreground hover:text-charcoal transition-all duration-500"
          >
            Explore Collection
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CollectionBanner;
