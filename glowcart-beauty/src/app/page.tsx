import type { Metadata } from "next";

import { HomepageSections } from "@/components/home";
import { getSiteSettings } from "@/lib/content/settings-service";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildPageMetadata({
    title: settings.websiteName,
    description: settings.description || settings.tagline,
    path: "/",
    image: settings.logoUrl,
  });
}

export default function HomePage() {
  return <HomepageSections />;
}
