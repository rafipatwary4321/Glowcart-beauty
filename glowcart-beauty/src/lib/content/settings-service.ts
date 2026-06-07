import { siteConfig } from "@/constants/site-config";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models";

export type PublicSiteSettings = {
  websiteName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  faviconUrl?: string;
  footerText: string;
  socialInstagram: string;
  socialFacebook: string;
  socialPinterest: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  aboutContent: string;
  contactContent: string;
  privacyPolicy: string;
  termsAndConditions: string;
  returnPolicy: string;
};

const defaultSettings: PublicSiteSettings = {
  websiteName: siteConfig.name,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  footerText: `${siteConfig.name} — premium cosmetics for every skin story.`,
  socialInstagram: siteConfig.social.instagram,
  socialFacebook: siteConfig.social.facebook,
  socialPinterest: siteConfig.social.pinterest,
  contactPhone: siteConfig.contact.phone,
  contactEmail: siteConfig.contact.email,
  contactAddress: siteConfig.contact.address,
  deliveryCharge: 80,
  freeDeliveryThreshold: 2000,
  aboutContent: defaultAboutContent(),
  contactContent: defaultContactContent(),
  privacyPolicy: defaultPrivacyPolicy(),
  termsAndConditions: defaultTermsContent(),
  returnPolicy: defaultReturnPolicy(),
};

function defaultAboutContent() {
  return `<p>GlowCart Beauty curates premium skincare, makeup, and fragrance for luminous confidence. We believe beauty should feel personal, clean, and effortless.</p>
<p>From dermatologist-loved serums to everyday glow essentials, every product is selected for quality, performance, and the stories our customers share.</p>`;
}

function defaultContactContent() {
  return `<p>We would love to hear from you. Reach our beauty concierge team for product advice, order help, or partnership inquiries.</p>`;
}

function defaultPrivacyPolicy() {
  return `<p>We respect your privacy. GlowCart Beauty collects only the information needed to process orders, improve your experience, and communicate with you about products and offers you may enjoy.</p>
<p>We never sell personal data to third parties. Payment details are processed securely through trusted payment partners.</p>`;
}

function defaultTermsContent() {
  return `<p>By using GlowCart Beauty, you agree to our terms of service. All products are subject to availability. Prices and promotions may change without notice.</p>`;
}

function defaultReturnPolicy() {
  return `<p>We accept returns on unopened, unused products within 7 days of delivery. Contact support with your order number to start a return.</p>
<p>Opened skincare and makeup items cannot be returned for hygiene reasons unless damaged or defective on arrival.</p>`;
}

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({ key: "default" });
    if (!settings) return defaultSettings;

    return {
      websiteName: settings.websiteName || defaultSettings.websiteName,
      tagline: settings.tagline || defaultSettings.tagline,
      description: settings.description || defaultSettings.description,
      logoUrl: settings.logoUrl || undefined,
      faviconUrl: settings.faviconUrl || undefined,
      footerText: settings.footerText || defaultSettings.footerText,
      socialInstagram: settings.socialInstagram || defaultSettings.socialInstagram,
      socialFacebook: settings.socialFacebook || defaultSettings.socialFacebook,
      socialPinterest: settings.socialPinterest || defaultSettings.socialPinterest,
      contactPhone: settings.contactPhone || defaultSettings.contactPhone,
      contactEmail: settings.contactEmail || defaultSettings.contactEmail,
      contactAddress: settings.contactAddress || defaultSettings.contactAddress,
      deliveryCharge: settings.deliveryCharge ?? defaultSettings.deliveryCharge,
      freeDeliveryThreshold: settings.freeDeliveryThreshold ?? defaultSettings.freeDeliveryThreshold,
      aboutContent: settings.aboutContent || defaultSettings.aboutContent,
      contactContent: settings.contactContent || defaultSettings.contactContent,
      privacyPolicy: settings.privacyPolicy || defaultSettings.privacyPolicy,
      termsAndConditions: settings.termsAndConditions || defaultSettings.termsAndConditions,
      returnPolicy: settings.returnPolicy || defaultSettings.returnPolicy,
    };
  } catch {
    return defaultSettings;
  }
}

export async function upsertSiteSettings(input: Partial<PublicSiteSettings>) {
  await connectDB();
  const settings = await SiteSettings.findOneAndUpdate(
    { key: "default" },
    { $set: input },
    { upsert: true, new: true, runValidators: true }
  );
  return settings;
}
