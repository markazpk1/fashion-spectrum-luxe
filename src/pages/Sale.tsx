import CatalogPage from "@/components/CatalogPage";
import { saleProducts } from "@/lib/products";

const Sale = () => (
  <CatalogPage
    title="Summer Sale"
    subtitle="Limited time offers on select styles"
    products={saleProducts}
  />
);

export default Sale;
