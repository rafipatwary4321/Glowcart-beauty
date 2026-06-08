import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";

type StorefrontLayoutProps = {
  children: React.ReactNode;
};

/**
 * Global storefront shell: announcement bar, navbar, page content, footer.
 */
export function StorefrontLayout({ children }: StorefrontLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
