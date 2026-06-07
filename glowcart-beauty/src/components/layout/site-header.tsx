import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50">
      <AnnouncementBar />
      <Navbar />
    </div>
  );
}
