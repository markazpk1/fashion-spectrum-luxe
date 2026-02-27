import CatalogPage from "@/components/CatalogPage";
import { bestSellers } from "@/lib/products";
import aboutBrand from "@/assets/about-brand.jpg";
import { useCatalogPageContent } from "@/hooks/usePageContent";

const BestSellers = () => {
  const cmsContent = useCatalogPageContent("best-sellers");
  return (
    <CatalogPage
      title="Best Sellers"
      subtitle="Our most loved pieces"
      products={bestSellers}
      bannerImage={aboutBrand}
      cmsContent={cmsContent}
    />
  );
};

export default BestSellers;
