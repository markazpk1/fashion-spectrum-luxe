import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative h-[85vh] md:h-screen overflow-hidden">
      <motion.img
        src={heroBanner}
        alt="FashionSpectrum luxury resort wear collection"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ y }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-transparent" />
      
      <motion.div
        className="relative h-full flex items-end pb-16 md:pb-24 px-6 md:px-16"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="max-w-lg"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-light text-primary-foreground leading-tight mb-4"
          >
            Luxurious
            <br />
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="font-semibold italic"
            >
              Resort Wear
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="font-body text-sm md:text-base text-primary-foreground/80 tracking-wide mb-8 max-w-sm"
          >
            Discover our latest collection of handcrafted kaftans, dresses & resort wear designed for the modern woman.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#new-arrivals"
            className="inline-block font-body text-xs tracking-[0.2em] uppercase bg-primary-foreground text-charcoal px-8 py-4 hover:bg-gold hover:text-primary-foreground transition-all duration-500"
          >
            Shop Collection
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
