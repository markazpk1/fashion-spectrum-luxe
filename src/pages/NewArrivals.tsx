import CatalogPage from "@/components/CatalogPage";
import { newArrivals } from "@/lib/products";

const NewArrivals = () => (
  <CatalogPage
    title="New Arrivals"
    subtitle="The latest additions to our collection"
    products={newArrivals}
  />
);

export default NewArrivals;
