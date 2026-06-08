import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import type { PublicSiteSettings } from "@/lib/content/settings-service";

type SiteHeaderProps = {
  settings: PublicSiteSettings;
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  return (
    <div className="sticky top-0 z-50">
      <AnnouncementBar />
      <Navbar settings={settings} />
    </div>
  );
}
