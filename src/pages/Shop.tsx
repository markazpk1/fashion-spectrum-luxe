import CatalogPage from "@/components/CatalogPage";
import { getAllProducts } from "@/lib/productUtils";
import collectionBanner from "@/assets/collection-banner.jpg";
import { useCatalogPageContent } from "@/hooks/usePageContent";

const Shop = () => {
  const cmsContent = useCatalogPageContent("shop");
  return (
    <CatalogPage
      title="Shop All"
      subtitle="Explore our complete collection of luxury resort wear"
      products={getAllProducts()}
      bannerImage={collectionBanner}
      cmsContent={cmsContent}
    />
  );
};

export default Shop;
