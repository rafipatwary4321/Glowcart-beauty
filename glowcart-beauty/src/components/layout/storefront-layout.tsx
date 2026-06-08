import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { PublicSiteSettings } from "@/lib/content/settings-service";

type StorefrontLayoutProps = {
  children: React.ReactNode;
  settings: PublicSiteSettings;
};

/**
 * Global storefront shell: announcement bar, navbar, page content, footer.
 */
export function StorefrontLayout({ children, settings }: StorefrontLayoutProps) {
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
