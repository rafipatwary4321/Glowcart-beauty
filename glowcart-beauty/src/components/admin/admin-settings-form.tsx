"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminWebsiteSettings } from "@/data/admin";

export function AdminSettingsForm() {
  const [values, setValues] = useState(adminWebsiteSettings);

  function updateField<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success("Settings saved locally. Backend persistence coming soon.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Website identity and branding.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="websiteName">Website name</Label>
            <Input
              id="websiteName"
              value={values.websiteName}
              onChange={(e) => updateField("websiteName", e.target.value)}
              className="h-10 rounded-lg"
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={values.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
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
          <CardTitle>Delivery & Policies</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="deliveryCharge">Delivery charge (৳)</Label>
            <Input
              id="deliveryCharge"
              type="number"
              value={values.deliveryCharge}
              onChange={(e) => updateField("deliveryCharge", Number(e.target.value))}
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="freeDeliveryThreshold">Free delivery threshold (৳)</Label>
            <Input
              id="freeDeliveryThreshold"
              type="number"
              value={values.freeDeliveryThreshold}
              onChange={(e) => updateField("freeDeliveryThreshold", Number(e.target.value))}
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="privacyPolicy">Privacy policy</Label>
            <Textarea
              id="privacyPolicy"
              value={values.privacyPolicy}
              onChange={(e) => updateField("privacyPolicy", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="terms">Terms and conditions</Label>
            <Textarea
              id="terms"
              value={values.termsAndConditions}
              onChange={(e) => updateField("termsAndConditions", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="rounded-full">
        Save Settings
      </Button>
    </form>
  );
}
