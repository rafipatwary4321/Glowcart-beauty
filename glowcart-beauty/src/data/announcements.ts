import type { Announcement } from "@/types";

export const announcements: Announcement[] = [
  {
    id: "1",
    message: "Free shipping on orders over ৳2,000",
    href: "/shop",
    linkLabel: "Shop now",
  },
  {
    id: "2",
    message: "New arrivals: Spring Glow Collection is here",
    href: "/shop?sort=newest",
    linkLabel: "Explore",
  },
  {
    id: "3",
    message: "Get 10% off your first order — use code GLOW10",
    href: "/shop",
    linkLabel: "Claim offer",
  },
];
