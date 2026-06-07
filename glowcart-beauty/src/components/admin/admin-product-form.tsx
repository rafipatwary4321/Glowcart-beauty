"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PRODUCT_CATEGORIES } from "@/types/product";
import { adminBrands } from "@/data/admin";

type ProductFormState = {
  name: string;
  slug: string;
  sku: string;
  price: string;
  originalPrice: string;
  category: string;
  brand: string;
  stockCount: string;
  skinConcerns: string;
  badge: string;
  description: string;
  ingredients: string;
  howToUse: string;
  inStock: boolean;
  isActive: boolean;
};

type AdminProductFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<ProductFormState> & { imageGradient?: string };
};

const defaultValues: ProductFormState = {
  name: "",
  slug: "",
  sku: "",
  price: "",
  originalPrice: "",
  category: PRODUCT_CATEGORIES[0],
  brand: adminBrands[0]?.name ?? "",
  stockCount: "0",
  skinConcerns: "",
  badge: "",
  description: "",
  ingredients: "",
  howToUse: "",
  inStock: true,
  isActive: true,
};

export function AdminProductForm({ mode, initialValues }: AdminProductFormProps) {
  const [values, setValues] = useState<ProductFormState>({
    ...defaultValues,
    ...initialValues,
  });
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitted ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Product {mode === "create" ? "created" : "updated"} in placeholder mode. Backend
          connection coming soon.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Product name, slug, and identifiers.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Product name</Label>
                <Input
                  id="name"
                  value={values.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Velvet Rose Hydrating Serum"
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={values.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="velvet-rose-hydrating-serum"
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={values.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  placeholder="GC-P1"
                  className="h-10 rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price (৳)</Label>
                <Input
                  id="price"
                  type="number"
                  value={values.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original price (৳)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={values.originalPrice}
                  onChange={(e) => updateField("originalPrice", e.target.value)}
                  placeholder="Optional discount"
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockCount">Stock count</Label>
                <Input
                  id="stockCount"
                  type="number"
                  value={values.stockCount}
                  onChange={(e) => updateField("stockCount", e.target.value)}
                  className="h-10 rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={values.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Product description..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients</Label>
                <Textarea
                  id="ingredients"
                  value={values.ingredients}
                  onChange={(e) => updateField("ingredients", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="howToUse">How to use</Label>
                <Textarea
                  id="howToUse"
                  value={values.howToUse}
                  onChange={(e) => updateField("howToUse", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
              <CardDescription>Upload placeholder — Cloudinary integration later.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br ${initialValues?.imageGradient ?? "from-rose-100 to-pink-50"}`}
              >
                <div className="rounded-xl border border-dashed border-primary/30 bg-background/70 px-4 py-6 text-center">
                  <p className="text-sm font-medium text-foreground">Drop image here</p>
                  <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  <Button type="button" variant="outline" size="sm" className="mt-3 rounded-full" disabled>
                    Upload image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  value={values.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select
                  id="brand"
                  value={values.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                >
                  {adminBrands.map((brand) => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skinConcerns">Skin concerns</Label>
                <Input
                  id="skinConcerns"
                  value={values.skinConcerns}
                  onChange={(e) => updateField("skinConcerns", e.target.value)}
                  placeholder="dryness, dullness, aging"
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Select
                  id="badge"
                  value={values.badge}
                  onChange={(e) => updateField("badge", e.target.value)}
                >
                  <option value="">None</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="inStock">In stock</Label>
                <Switch
                  checked={values.inStock}
                  onCheckedChange={(checked) => updateField("inStock", checked)}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  checked={values.isActive}
                  onCheckedChange={(checked) => updateField("isActive", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full rounded-full">
            {mode === "create" ? "Create Product" : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
