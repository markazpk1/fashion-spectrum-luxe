import CatalogPage from "@/components/CatalogPage";
import { saleProducts } from "@/lib/products";
import { useCatalogPageContent } from "@/hooks/usePageContent";

const Sale = () => {
  const cmsContent = useCatalogPageContent("sale");
  return (
    <CatalogPage
      title="Summer Sale"
      subtitle="Limited time offers on select styles"
      products={saleProducts}
      cmsContent={cmsContent}
    />
  );
};

export default Sale;
