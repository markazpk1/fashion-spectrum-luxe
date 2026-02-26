import CatalogPage from "@/components/CatalogPage";
import { bestSellers } from "@/lib/products";
import aboutBrand from "@/assets/about-brand.jpg";

const BestSellers = () => (
  <CatalogPage
    title="Best Sellers"
    subtitle="Our most loved pieces"
    products={bestSellers}
    bannerImage={aboutBrand}
  />
);

export default BestSellers;
