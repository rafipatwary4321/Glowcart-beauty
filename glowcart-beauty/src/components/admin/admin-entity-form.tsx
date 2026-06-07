"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type AdminEntityFormProps = {
  entity: "category" | "brand" | "banner";
};

const titles = {
  category: "Add Category",
  brand: "Add Brand",
  banner: "Add Banner",
} as const;

export function AdminEntityForm({ entity }: AdminEntityFormProps) {
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>{titles[entity]}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          {saved ? (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:col-span-2">
              Saved in placeholder mode.
            </div>
          ) : null}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Name / Title</Label>
            <Input id="name" className="h-10 rounded-lg" />
          </div>
          {entity !== "banner" ? (
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" className="h-10 rounded-lg" />
            </div>
          ) : null}
          {entity === "banner" ? (
            <div className="space-y-2">
              <Label htmlFor="type">Banner type</Label>
              <Select id="type" defaultValue="promo">
                <option value="hero">Hero</option>
                <option value="promo">Promo</option>
                <option value="announcement">Announcement</option>
              </Select>
            </div>
          ) : null}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">
              {entity === "brand" ? "Tagline" : "Description"}
            </Label>
            <Textarea id="description" />
          </div>
          <div className="flex items-center justify-between gap-3 sm:col-span-2">
            <Label htmlFor="active">Active</Label>
            <Switch defaultChecked />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="rounded-full">
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
