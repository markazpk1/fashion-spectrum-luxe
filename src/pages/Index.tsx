import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import CollectionBanner from "@/components/CollectionBanner";
import AboutBrand from "@/components/AboutBrand";
import Footer from "@/components/Footer";
import { newArrivals, saleProducts } from "@/lib/products";
import { useHomePageContent, isSectionEnabled } from "@/hooks/usePageContent";

const Index = () => {
  const content = useHomePageContent();
  const isEnabled = (id: string) => isSectionEnabled(content.sections, id);

  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      {isEnabled("announcement") && (
        <AnnouncementBar content={content.announcement} />
      )}
      <Navbar />
      {isEnabled("hero") && (
        <HeroSection content={content.hero} slides={content.heroSlides} />
      )}

      {isEnabled("newArrivals") && (
        <ProductSection
          id="new-arrivals"
          title="New Arrivals"
          products={newArrivals}
          viewAllLink="/new-arrivals"
        />
      )}

      {isEnabled("collectionBanner") && (
        <CollectionBanner content={content.collectionBanner} image={content.collectionImage} />
      )}

      {isEnabled("saleBanner") && (
        <ProductSection
          id="sale"
          title="Summer Sale"
          products={saleProducts}
          viewAllLink="/sale"
        />
      )}


      {isEnabled("about") && (
        <AboutBrand content={content.about} image={content.aboutImage} />
      )}
      {isEnabled("footer") && (
        <Footer content={content.footer} />
      )}
    </div>
  );
};

export default Index;
