import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";

import { LayoutShell } from "@/components/layout/layout-shell";
import { AppProviders } from "@/providers";
import { getSiteSettings } from "@/lib/content/settings-service";
import { buildPageMetadata } from "@/lib/seo";

import "./globals.css";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const metadata = buildPageMetadata({
    title: settings.websiteName,
    description: settings.description,
    path: "/",
    image: settings.logoUrl,
  });

  return {
    ...metadata,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : metadata.icons,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={cn("h-full antialiased font-sans", dmSans.variable, playfair.variable)}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders settings={settings}>
          <LayoutShell settings={settings}>{children}</LayoutShell>
        </AppProviders>
      </body>
    </html>
  );
}
