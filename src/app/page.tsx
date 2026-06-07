import {
  FeaturedCategories,
  HeroSection,
  SkinConcerns,
  TopBrands,
  TrendingProducts,
} from "@/components/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <TopBrands />
      <TrendingProducts />
      <SkinConcerns />
    </>
  );
}
