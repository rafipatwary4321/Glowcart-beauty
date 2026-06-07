import type { Metadata } from "next";

import { ContentPage } from "@/components/content/content-page";
import { getSiteSettings } from "@/lib/content/settings-service";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Privacy Policy",
    description: "How GlowCart Beauty collects, uses, and protects your personal information.",
    path: "/privacy-policy",
  });
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  return (
    <ContentPage
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="Your privacy matters to us."
      html={settings.privacyPolicy}
    />
  );
}
