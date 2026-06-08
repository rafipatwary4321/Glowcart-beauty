"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { FormField } from "@/components/admin/form-field";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { AdminLoadingState } from "@/components/admin/admin-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminWebsiteSettings } from "@/data/admin";
import { fetchAdminSettings, updateAdminSettings } from "@/lib/admin/services";
import { notifyMutationResult } from "@/lib/admin/toast";
import type { AdminWebsiteSettings } from "@/types/admin";

const defaultValues: AdminWebsiteSettings = {
  ...adminWebsiteSettings,
  description: "",
  contactAddress: "",
  aboutContent: "",
  contactContent: "",
  returnPolicy: "",
};

export function AdminSettingsForm() {
  const [values, setValues] = useState<AdminWebsiteSettings>(defaultValues);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchAdminSettings();
        setValues((current) => ({
          ...current,
          websiteName: String(data.websiteName ?? current.websiteName),
          tagline: String(data.tagline ?? current.tagline),
          description: String(data.description ?? current.description ?? ""),
          logoUrl: data.logoUrl ? String(data.logoUrl) : current.logoUrl,
          faviconUrl: data.faviconUrl ? String(data.faviconUrl) : current.faviconUrl,
          footerText: String(data.footerText ?? current.footerText),
          socialInstagram: String(data.socialInstagram ?? current.socialInstagram),
          socialFacebook: String(data.socialFacebook ?? current.socialFacebook),
          socialPinterest: String(data.socialPinterest ?? current.socialPinterest),
          contactPhone: String(data.contactPhone ?? current.contactPhone),
          contactEmail: String(data.contactEmail ?? current.contactEmail),
          contactAddress: String(data.contactAddress ?? current.contactAddress ?? ""),
          deliveryCharge: Number(data.deliveryCharge ?? current.deliveryCharge),
          freeDeliveryThreshold: Number(data.freeDeliveryThreshold ?? current.freeDeliveryThreshold),
          aboutContent: String(data.aboutContent ?? current.aboutContent ?? ""),
          contactContent: String(data.contactContent ?? current.contactContent ?? ""),
          privacyPolicy: String(data.privacyPolicy ?? current.privacyPolicy),
          termsAndConditions: String(data.termsAndConditions ?? current.termsAndConditions),
          returnPolicy: String(data.returnPolicy ?? current.returnPolicy ?? ""),
        }));
      } catch {
        toast.message("Using default settings — could not load from server.");
      } finally {
        setLoading(false);
      }
    }

    void loadSettings();
  }, []);

  function updateField<K extends keyof AdminWebsiteSettings>(key: K, value: AdminWebsiteSettings[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validateSettings(input: AdminWebsiteSettings) {
    const errors: Record<string, string> = {};

    if (!input.websiteName.trim()) {
      errors.websiteName = "Website name is required.";
    }

    if (!input.contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contactEmail)) {
      errors.contactEmail = "Enter a valid contact email.";
    }

    if (input.deliveryCharge < 0) {
      errors.deliveryCharge = "Delivery charge cannot be negative.";
    }

    if (input.freeDeliveryThreshold < 0) {
      errors.freeDeliveryThreshold = "Free delivery threshold cannot be negative.";
    }

    return errors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateSettings(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);

    const result = await updateAdminSettings({
      websiteName: values.websiteName,
      tagline: values.tagline,
      description: values.description,
      logoUrl: values.logoUrl,
      faviconUrl: values.faviconUrl,
      footerText: values.footerText,
      socialInstagram: values.socialInstagram,
      socialFacebook: values.socialFacebook,
      socialPinterest: values.socialPinterest,
      contactPhone: values.contactPhone,
      contactEmail: values.contactEmail,
      contactAddress: values.contactAddress,
      deliveryCharge: values.deliveryCharge,
      freeDeliveryThreshold: values.freeDeliveryThreshold,
      aboutContent: values.aboutContent,
      contactContent: values.contactContent,
      privacyPolicy: values.privacyPolicy,
      termsAndConditions: values.termsAndConditions,
      returnPolicy: values.returnPolicy,
    });

    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage: "Settings saved.",
      error: result.error,
      message: result.message,
    });

    setSaving(false);
  }

  if (loading) {
    return <AdminLoadingState message="Loading settings..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Website identity and branding.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Website name" htmlFor="websiteName" error={fieldErrors.websiteName} className="sm:col-span-2">
            <Input
              id="websiteName"
              value={values.websiteName}
              onChange={(e) => updateField("websiteName", e.target.value)}
              className="h-10 rounded-lg"
            />
          </FormField>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={values.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Site description (SEO)</Label>
            <Textarea
              id="description"
              value={values.description ?? ""}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <ImageUploadField
              folder="settings"
              label="Website logo"
              description={`Fallback: ${values.logoPlaceholder}`}
              aspectClassName="aspect-[3/1]"
              value={values.logoUrl ? [values.logoUrl] : []}
              onChange={(urls) => updateField("logoUrl", urls[0])}
              fallbackGradient="from-rose-100 to-pink-50"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <ImageUploadField
              folder="settings"
              label="Favicon"
              description={`Fallback: ${values.faviconPlaceholder}`}
              aspectClassName="aspect-square max-w-[120px]"
              value={values.faviconUrl ? [values.faviconUrl] : []}
              onChange={(urls) => updateField("faviconUrl", urls[0])}
              fallbackGradient="from-beige-100 to-nude-100"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="footerText">Footer text</Label>
            <Textarea
              id="footerText"
              value={values.footerText}
              onChange={(e) => updateField("footerText", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Contact & Social</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input
              id="contactPhone"
              value={values.contactPhone}
              onChange={(e) => updateField("contactPhone", e.target.value)}
              className="h-10 rounded-lg"
            />
          </div>
          <FormField label="Contact email" htmlFor="contactEmail" error={fieldErrors.contactEmail}>
            <Input
              id="contactEmail"
              type="email"
              value={values.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
              className="h-10 rounded-lg"
            />
          </FormField>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="contactAddress">Contact address</Label>
            <Input
              id="contactAddress"
              value={values.contactAddress ?? ""}
              onChange={(e) => updateField("contactAddress", e.target.value)}
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              value={values.socialInstagram}
              onChange={(e) => updateField("socialInstagram", e.target.value)}
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              value={values.socialFacebook}
              onChange={(e) => updateField("socialFacebook", e.target.value)}
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="pinterest">Pinterest URL</Label>
            <Input
              id="pinterest"
              value={values.socialPinterest}
              onChange={(e) => updateField("socialPinterest", e.target.value)}
              className="h-10 rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Marketing Pages</CardTitle>
          <CardDescription>Edit About, Contact, and policy page content (HTML supported).</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="aboutContent">About page content</Label>
            <Textarea
              id="aboutContent"
              rows={5}
              value={values.aboutContent ?? ""}
              onChange={(e) => updateField("aboutContent", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactContent">Contact page content</Label>
            <Textarea
              id="contactContent"
              rows={4}
              value={values.contactContent ?? ""}
              onChange={(e) => updateField("contactContent", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Delivery & Policies</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Delivery charge (৳)" htmlFor="deliveryCharge" error={fieldErrors.deliveryCharge}>
            <Input
              id="deliveryCharge"
              type="number"
              min={0}
              value={values.deliveryCharge}
              onChange={(e) => updateField("deliveryCharge", Number(e.target.value))}
              className="h-10 rounded-lg"
            />
          </FormField>
          <FormField label="Free delivery threshold (৳)" htmlFor="freeDeliveryThreshold" error={fieldErrors.freeDeliveryThreshold}>
            <Input
              id="freeDeliveryThreshold"
              type="number"
              min={0}
              value={values.freeDeliveryThreshold}
              onChange={(e) => updateField("freeDeliveryThreshold", Number(e.target.value))}
              className="h-10 rounded-lg"
            />
          </FormField>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="privacyPolicy">Privacy policy</Label>
            <Textarea
              id="privacyPolicy"
              rows={5}
              value={values.privacyPolicy}
              onChange={(e) => updateField("privacyPolicy", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="terms">Terms and conditions</Label>
            <Textarea
              id="terms"
              rows={5}
              value={values.termsAndConditions}
              onChange={(e) => updateField("termsAndConditions", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="returnPolicy">Return policy</Label>
            <Textarea
              id="returnPolicy"
              rows={5}
              value={values.returnPolicy ?? ""}
              onChange={(e) => updateField("returnPolicy", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="rounded-full" disabled={saving}>
        {saving ? <Loader2 className="size-4 animate-spin" /> : "Save Settings"}
      </Button>
    </form>
  );
}
