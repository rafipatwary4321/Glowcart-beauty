export const siteConfig = {
  name: "GlowCart Beauty",
  tagline: "Radiance, refined.",
  description:
    "Premium cosmetics curated for every skin story. Discover skincare, makeup, and fragrances crafted for luminous confidence.",
  url: "https://glowcart-beauty.com",
  contact: {
    email: "hello@glowcart-beauty.com",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
  },
  social: {
    instagram: "https://instagram.com/glowcartbeauty",
    facebook: "https://facebook.com/glowcartbeauty",
    pinterest: "https://pinterest.com/glowcartbeauty",
  },
  navLinks: [
    { label: "Shop", href: "/shop" },
    { label: "Skincare", href: "/shop/skincare" },
    { label: "Makeup", href: "/shop/makeup" },
    { label: "Fragrances", href: "/shop/fragrances" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: {
    shop: [
      { label: "All Products", href: "/shop" },
      { label: "Skincare", href: "/shop/skincare" },
      { label: "Makeup", href: "/shop/makeup" },
      { label: "Fragrances", href: "/shop/fragrances" },
      { label: "Gift Sets", href: "/shop/gifts" },
    ],
    support: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "FAQ", href: "/faq" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about#story" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  paymentMethods: ["SSLCommerz", "bKash", "Visa", "Mastercard"],
} as const;
