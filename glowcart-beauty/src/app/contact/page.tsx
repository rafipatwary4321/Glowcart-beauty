import type { Metadata } from "next";

import { ContentPage } from "@/components/content/content-page";
import { getSiteSettings } from "@/lib/content/settings-service";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildPageMetadata({
    title: "Contact Us",
    description: `Contact ${settings.websiteName} for product advice, orders, and support.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <ContentPage
      eyebrow="Get in Touch"
      title="Contact GlowCart Beauty"
      subtitle="Our beauty concierge team is here to help."
      html={`${settings.contactContent}
        <div class="mt-8 grid gap-4 rounded-2xl border border-border/60 bg-muted/20 p-6 not-prose">
          <p><strong>Email:</strong> ${settings.contactEmail}</p>
          <p><strong>Phone:</strong> ${settings.contactPhone}</p>
          <p><strong>Address:</strong> ${settings.contactAddress}</p>
        </div>`}
    />
  );
}
