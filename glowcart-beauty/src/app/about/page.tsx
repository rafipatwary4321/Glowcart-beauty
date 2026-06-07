import type { Metadata } from "next";

import { ContentPage } from "@/components/content/content-page";
import { getSiteSettings } from "@/lib/content/settings-service";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildPageMetadata({
    title: "About Us",
    description: `Learn about ${settings.websiteName} — ${settings.tagline}`,
    path: "/about",
  });
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <ContentPage
      eyebrow="Our Story"
      title={`About ${settings.websiteName}`}
      subtitle={settings.tagline}
      html={settings.aboutContent}
    />
  );
}
