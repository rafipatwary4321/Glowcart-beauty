import { BestSellers } from "@/components/home/best-sellers";
import { BrandStory } from "@/components/home/brand-story";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { HeroSection } from "@/components/home/hero-section";
import { NewArrivals } from "@/components/home/new-arrivals";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { PromoBanner } from "@/components/home/promo-banner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <BestSellers />
      <PromoBanner />
      <NewArrivals />
      <BrandStory />
      <NewsletterSection />
    </>
  );
}
