/** Shared props for homepage content sections */
export interface HomeSectionProps {
  className?: string;
}

/** Base props for card components that display entity data */
export interface EntityCardProps<T> {
  data: T;
  className?: string;
}

/** Section header configuration used across homepage blocks */
export interface SectionHeaderConfig {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
}

/** Promotional banner content */
export interface Promotion {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Newsletter signup block content */
export interface NewsletterContent {
  eyebrow: string;
  title: string;
  description: string;
  placeholder: string;
  buttonLabel: string;
  disclaimer: string;
}

/** Hero banner content */
export interface HeroContent {
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: Array<{ value: string; label: string }>;
  featured: {
    eyebrow: string;
    title: string;
    description: string;
  };
}
