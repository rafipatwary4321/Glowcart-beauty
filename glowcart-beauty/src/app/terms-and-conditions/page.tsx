import type { Metadata } from "next";

import { ContentPage } from "@/components/content/content-page";
import { getSiteSettings } from "@/lib/content/settings-service";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Terms and Conditions",
    description: "Terms and conditions for shopping at GlowCart Beauty.",
    path: "/terms-and-conditions",
  });
}

export default async function TermsPage() {
  const settings = await getSiteSettings();
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms and Conditions"
      subtitle="Please read these terms before using our store."
      html={settings.termsAndConditions}
    />
  );
}
