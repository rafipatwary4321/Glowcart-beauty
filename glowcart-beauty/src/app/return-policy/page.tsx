import type { Metadata } from "next";

import { ContentPage } from "@/components/content/content-page";
import { getSiteSettings } from "@/lib/content/settings-service";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Return Policy",
    description: "GlowCart Beauty return and refund policy.",
    path: "/return-policy",
  });
}

export default async function ReturnPolicyPage() {
  const settings = await getSiteSettings();
  return (
    <ContentPage
      eyebrow="Support"
      title="Return Policy"
      subtitle="Easy returns for eligible beauty products."
      html={settings.returnPolicy}
    />
  );
}
