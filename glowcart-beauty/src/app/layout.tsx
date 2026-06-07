import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";

import { LayoutShell } from "@/components/layout/layout-shell";
import { AppProviders } from "@/providers";
import { siteConfig } from "@/constants/site-config";

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

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased font-sans", dmSans.variable, playfair.variable)}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>
          <LayoutShell>{children}</LayoutShell>
        </AppProviders>
      </body>
    </html>
  );
}
