"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/admin/form-field";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { routes } from "@/constants/routes";
import {
  createAdminProduct,
  fetchAdminBrands,
  fetchAdminCategories,
  fetchAdminProduct,
  updateAdminProduct,
} from "@/lib/admin/services";
import { productFormSchema, type ProductFormValues } from "@/lib/admin/schemas";
import { notifyMutationResult } from "@/lib/admin/toast";

type AdminProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
};

const defaultValues: ProductFormValues = {
  name: "",
  slug: "",
  price: 0,
  originalPrice: "",
  category: "",
  brand: "",
  stockCount: 0,
  skinConcerns: "",
  badge: "",
  description: "",
  ingredients: "",
  howToUse: "",
  imageGradient: "from-rose-100 to-pink-50",
  images: [],
  inStock: true,
  isActive: true,
};

export function AdminProductForm({ mode, productId }: AdminProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [imageGradient, setImageGradient] = useState("from-rose-100 to-pink-50");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    async function loadOptions() {
      setOptionsLoading(true);
      const [categoryResult, brandResult] = await Promise.all([
        fetchAdminCategories(),
        fetchAdminBrands(),
      ]);

      setCategories(categoryResult.data.map((item) => ({ id: item.id, name: item.name })));
      setBrands(brandResult.data.map((item) => ({ id: item.id, name: item.name })));

      if (mode === "create") {
        reset({
          ...defaultValues,
          category: categoryResult.data[0]?.id ?? "",
          brand: brandResult.data[0]?.id ?? "",
        });
      }

      setOptionsLoading(false);
    }

    void loadOptions();
  }, [mode, reset]);

  useEffect(() => {
    if (mode !== "edit" || !productId) return;

    async function loadProduct() {
      setLoading(true);
      try {
        const result = await fetchAdminProduct(productId!);
        setImageGradient(result.data.imageGradient);
        reset({
          name: result.data.name,
          slug: result.data.slug,
          price: result.data.price,
          originalPrice: result.data.originalPrice ?? "",
          category: result.data.categoryId ?? result.data.category,
          brand: result.data.brandId ?? result.data.brand,
          stockCount: result.data.stockCount,
          skinConcerns: result.data.skinConcerns.join(", "),
          badge: (result.data.badge as ProductFormValues["badge"]) ?? "",
          description: "",
          ingredients: "",
          howToUse: "",
          imageGradient: result.data.imageGradient,
          images: result.data.images ?? [],
          inStock: result.data.inStock,
          isActive: result.data.isActive,
        });
      } catch {
        notifyMutationResult({
          ok: false,
          source: "fallback",
          successMessage: "",
          error: "Product not found.",
        });
      } finally {
        setLoading(false);
      }
    }

    void loadProduct();
  }, [mode, productId, reset]);

  async function onSubmit(values: ProductFormValues) {
    const result =
      mode === "create"
        ? await createAdminProduct(values)
        : await updateAdminProduct(productId!, values);

    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage:
        mode === "create" ? "Product created successfully." : "Product updated successfully.",
      error: result.error,
      message: result.message,
    });

    if (result.ok) {
      router.push(routes.admin.products);
      router.refresh();
    }
  }

  if (loading || optionsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const inStock = watch("inStock");
  const isActive = watch("isActive");
  const images = watch("images") ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Product name, slug, and identifiers.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField label="Product name" htmlFor="name" error={errors.name?.message} className="sm:col-span-2">
                <Input id="name" className="h-10 rounded-lg" {...register("name")} />
              </FormField>
              <FormField label="Slug" htmlFor="slug" error={errors.slug?.message}>
                <Input id="slug" className="h-10 rounded-lg" {...register("slug")} />
              </FormField>
              <FormField label="Price (৳)" htmlFor="price" error={errors.price?.message}>
                <Input id="price" type="number" className="h-10 rounded-lg" {...register("price", { valueAsNumber: true })} />
              </FormField>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <FormField label="Original price (৳)" htmlFor="originalPrice" error={errors.originalPrice?.message}>
                <Input id="originalPrice" type="number" className="h-10 rounded-lg" {...register("originalPrice", { valueAsNumber: true })} />
              </FormField>
              <FormField label="Stock count" htmlFor="stockCount" error={errors.stockCount?.message}>
                <Input id="stockCount" type="number" className="h-10 rounded-lg" {...register("stockCount", { valueAsNumber: true })} />
              </FormField>
              <FormField label="Skin concerns" htmlFor="skinConcerns" error={errors.skinConcerns?.message}>
                <Input id="skinConcerns" placeholder="dryness, dullness" className="h-10 rounded-lg" {...register("skinConcerns")} />
              </FormField>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Description" htmlFor="description" error={errors.description?.message}>
                <Textarea id="description" {...register("description")} />
              </FormField>
              <FormField label="Ingredients" htmlFor="ingredients" error={errors.ingredients?.message}>
                <Textarea id="ingredients" {...register("ingredients")} />
              </FormField>
              <FormField label="How to use" htmlFor="howToUse" error={errors.howToUse?.message}>
                <Textarea id="howToUse" {...register("howToUse")} />
              </FormField>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Upload product photos. Gradient placeholder is used when no images are uploaded.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploadField
                folder="products"
                label="Product images"
                multiple
                maxFiles={6}
                value={images}
                onChange={(urls) => setValue("images", urls, { shouldDirty: true })}
                fallbackGradient={imageGradient}
              />
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Category" htmlFor="category" error={errors.category?.message}>
                <Select id="category" className="h-10" {...register("category")}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Brand" htmlFor="brand" error={errors.brand?.message}>
                <Select id="brand" className="h-10" {...register("brand")}>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Badge" htmlFor="badge" error={errors.badge?.message}>
                <Select id="badge" className="h-10" {...register("badge")}>
                  <option value="">None</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                </Select>
              </FormField>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="inStock" className="text-sm font-medium">In stock</label>
                <Switch checked={inStock} onCheckedChange={(checked) => setValue("inStock", checked)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="isActive" className="text-sm font-medium">Active</label>
                <Switch checked={isActive} onCheckedChange={(checked) => setValue("isActive", checked)} />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : mode === "create" ? (
              "Create Product"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
