import CatalogPage from "@/components/CatalogPage";
import { getAllProducts } from "@/lib/productUtils";
import heroBanner from "@/assets/hero-banner.jpg";

const Collections = () => (
  <CatalogPage
    title="Collections"
    subtitle="Curated collections for every occasion"
    products={getAllProducts()}
    bannerImage={heroBanner}
  />
);

export default Collections;
