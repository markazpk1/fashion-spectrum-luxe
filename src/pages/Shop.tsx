import CatalogPage from "@/components/CatalogPage";
import { getAllProducts } from "@/lib/productUtils";
import collectionBanner from "@/assets/collection-banner.jpg";

const Shop = () => (
  <CatalogPage
    title="Shop All"
    subtitle="Explore our complete collection of luxury resort wear"
    products={getAllProducts()}
    bannerImage={collectionBanner}
  />
);

export default Shop;
