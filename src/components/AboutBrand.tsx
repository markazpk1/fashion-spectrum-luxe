import { motion } from "framer-motion";
import aboutImg from "@/assets/about-brand.jpg";

const AboutBrand = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-16">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden"
        >
          <img
            src={aboutImg}
            alt="About FashionSpectrum brand"
            className="w-full h-[500px] md:h-[600px] object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-light text-foreground">
            About The Brand
          </h2>
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            FashionSpectrum is the zenith of luxury resort wear, crafted for the modern woman who embraces elegance in every moment. Our collections blend cultural artistry with contemporary design, creating pieces that transcend seasons and boundaries.
          </p>
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            Each garment is meticulously designed with premium fabrics and intricate embellishments, ensuring that every piece tells a story of sophistication, comfort, and timeless beauty. From sun-drenched beaches to glamorous evening events, FashionSpectrum dresses you in confidence.
          </p>
          <a
            href="#"
            className="inline-block font-body text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 text-foreground hover:text-primary hover:border-primary transition-colors duration-300 mt-4"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutBrand;
