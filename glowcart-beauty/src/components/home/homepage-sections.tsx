import { Suspense } from "react";

import {
  BrandGridSkeleton,
  CategoryGridSkeleton,
  ProductGridSkeleton,
  SkinConcernGridSkeleton,
} from "@/components/home/skeletons";
import { getHeroContent, getPromoContent } from "@/services/homepage.service";

import { CategoriesSection } from "./categories-section";
import { HeroBanner } from "./hero-banner";
import { NewsletterSection } from "./newsletter-section";
import { PromotionalBannerSection } from "./promotional-banner-section";
import { SkinConcernsSection } from "./skin-concerns-section";
import { TopBrandsSection } from "./top-brands-section";
import { TrendingProductsSection } from "./trending-products-section";

/**
 * Composes all homepage content sections in display order.
 * Layout chrome (announcement bar, navbar, footer) lives in StorefrontLayout.
 */
export async function HomepageSections() {
  const [heroContent, promoContent] = await Promise.all([getHeroContent(), getPromoContent()]);

  return (
    <>
      <HeroBanner content={heroContent} />

      <Suspense fallback={<CategoriesSectionFallback />}>
        <CategoriesSection />
      </Suspense>

      <Suspense fallback={<TopBrandsSectionFallback />}>
        <TopBrandsSection />
      </Suspense>

      <Suspense fallback={<TrendingProductsSectionFallback />}>
        <TrendingProductsSection />
      </Suspense>

      <Suspense fallback={<SkinConcernsSectionFallback />}>
        <SkinConcernsSection />
      </Suspense>

      <PromotionalBannerSection promotion={promoContent} />
      <NewsletterSection />
    </>
  );
}

function CategoriesSectionFallback() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryGridSkeleton />
      </div>
    </section>
  );
}

function TopBrandsSectionFallback() {
  return (
    <section className="border-y border-border/40 bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <BrandGridSkeleton />
      </div>
    </section>
  );
}

function TrendingProductsSectionFallback() {
  return (
    <section className="bg-beige-50/60 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductGridSkeleton />
      </div>
    </section>
  );
}

function SkinConcernsSectionFallback() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SkinConcernGridSkeleton />
      </div>
    </section>
  );
}
