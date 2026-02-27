import CatalogPage from "@/components/CatalogPage";
import { newArrivals } from "@/lib/products";
import { useCatalogPageContent } from "@/hooks/usePageContent";

const NewArrivals = () => {
  const cmsContent = useCatalogPageContent("new-arrivals");
  return (
    <CatalogPage
      title="New Arrivals"
      subtitle="The latest additions to our collection"
      products={newArrivals}
      cmsContent={cmsContent}
    />
  );
};

export default NewArrivals;
