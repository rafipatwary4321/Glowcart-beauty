import { Suspense } from "react";

import { CatalogSectionEmpty } from "@/components/catalog";
import {
  BrandGridSkeleton,
  CategoryGridSkeleton,
  ProductGridSkeleton,
  SkinConcernGridSkeleton,
} from "@/components/home/skeletons";
import { HomeSectionBoundary } from "@/components/home/home-section-boundary";
import { heroContent } from "@/data/hero";
import { featuredPromotion } from "@/data/promotions";
import { getHeroContent, getPromoContent } from "@/services/homepage.service";

import { CategoriesSection } from "./categories-section";
import { HeroBanner } from "./hero-banner";
import { NewsletterSection } from "./newsletter-section";
import { PromotionalBannerSection } from "./promotional-banner-section";
import { SkinConcernsSection } from "./skin-concerns-section";
import { TopBrandsSection } from "./top-brands-section";
import { TrendingProductsSection } from "./trending-products-section";

async function HeroSection() {
  try {
    const content = await getHeroContent();
    return <HeroBanner content={content} />;
  } catch {
    return <HeroBanner content={heroContent} />;
  }
}

async function PromoSection() {
  try {
    const promotion = await getPromoContent();
    return <PromotionalBannerSection promotion={promotion} />;
  } catch {
    return <PromotionalBannerSection promotion={featuredPromotion} />;
  }
}

/**
 * Composes all homepage content sections in display order.
 * Layout chrome (announcement bar, navbar, footer) lives in StorefrontLayout.
 */
export async function HomepageSections() {
  return (
    <>
      <HomeSectionBoundary fallback={<HeroBanner content={heroContent} />}>
        <Suspense fallback={<HeroSectionFallback />}>
          <HeroSection />
        </Suspense>
      </HomeSectionBoundary>

      <HomeSectionBoundary
        fallback={
          <CatalogSectionEmpty
            title="Unable to load categories"
            description="Please refresh the page to try again."
          />
        }
      >
        <Suspense fallback={<CategoriesSectionFallback />}>
          <CategoriesSection />
        </Suspense>
      </HomeSectionBoundary>

      <HomeSectionBoundary
        fallback={
          <CatalogSectionEmpty
            title="Unable to load brands"
            description="Please refresh the page to try again."
          />
        }
      >
        <Suspense fallback={<TopBrandsSectionFallback />}>
          <TopBrandsSection />
        </Suspense>
      </HomeSectionBoundary>

      <HomeSectionBoundary
        fallback={
          <CatalogSectionEmpty
            title="Unable to load trending products"
            description="Please refresh the page to try again."
          />
        }
      >
        <Suspense fallback={<TrendingProductsSectionFallback />}>
          <TrendingProductsSection />
        </Suspense>
      </HomeSectionBoundary>

      <HomeSectionBoundary
        fallback={
          <CatalogSectionEmpty
            title="Unable to load skin concerns"
            description="Please refresh the page to try again."
          />
        }
      >
        <Suspense fallback={<SkinConcernsSectionFallback />}>
          <SkinConcernsSection />
        </Suspense>
      </HomeSectionBoundary>

      <HomeSectionBoundary fallback={<PromotionalBannerSection promotion={featuredPromotion} />}>
        <Suspense fallback={<PromoSectionFallback />}>
          <PromoSection />
        </Suspense>
      </HomeSectionBoundary>

      <NewsletterSection />
    </>
  );
}

function HeroSectionFallback() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-beige-50 to-white py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded-full bg-muted" />
          <div className="h-12 max-w-lg rounded-lg bg-muted" />
          <div className="h-4 max-w-md rounded bg-muted" />
          <div className="flex gap-3">
            <div className="h-11 w-36 rounded-full bg-muted" />
            <div className="h-11 w-36 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PromoSectionFallback() {
  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-40 animate-pulse rounded-3xl bg-muted" />
      </div>
    </section>
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
