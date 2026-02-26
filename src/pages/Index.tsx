import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import CollectionBanner from "@/components/CollectionBanner";
import AboutBrand from "@/components/AboutBrand";
import Footer from "@/components/Footer";
import { newArrivals, saleProducts, bestSellers } from "@/lib/products";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      <AnnouncementBar />
      <Navbar />
      <HeroSection />

      <ProductSection
        id="new-arrivals"
        title="New Arrivals"
        products={newArrivals}
        viewAllLink="/new-arrivals"
      />

      <CollectionBanner />

      <ProductSection
        id="sale"
        title="Summer Sale"
        products={saleProducts}
        viewAllLink="/sale"
      />

      <section id="best-sellers">
        <ProductSection
          title="Best Sellers"
          products={bestSellers}
          viewAllLink="/best-sellers"
        />
      </section>

      <AboutBrand />
      <Footer />
    </div>
  );
};

export default Index;
