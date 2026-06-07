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
import { Textarea } from "@/components/ui/textarea";
import { routes } from "@/constants/routes";
import {
  createAdminBlog,
  fetchAdminBlog,
  updateAdminBlog,
} from "@/lib/admin/services";
import { blogFormSchema, type BlogFormValues } from "@/lib/admin/schemas";
import { slugifyTitle } from "@/lib/blog/slugify";
import { notifyMutationResult } from "@/lib/admin/toast";

type AdminBlogFormProps = {
  mode: "create" | "edit";
  blogId?: string;
};

const defaultValues: BlogFormValues = {
  title: "",
  slug: "",
  coverImage: "",
  excerpt: "",
  content: "",
  author: "GlowCart Beauty",
  category: "Beauty Tips",
  tags: "",
  status: "draft",
  seoTitle: "",
  seoDescription: "",
};

export function AdminBlogForm({ mode, blogId }: AdminBlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
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

  const title = watch("title");

  useEffect(() => {
    if (mode === "create" && title && !watch("slug")) {
      setValue("slug", slugifyTitle(title));
    }
  }, [title, mode, setValue, watch]);

  useEffect(() => {
    if (mode !== "edit" || !blogId) return;

    async function loadBlog() {
      setLoading(true);
      try {
        const { data } = await fetchAdminBlog(blogId!);
        const row = data as Record<string, unknown>;
        reset({
          title: String(row.title ?? ""),
          slug: String(row.slug ?? ""),
          coverImage: String(row.coverImage ?? ""),
          excerpt: String(row.excerpt ?? ""),
          content: String(row.content ?? ""),
          author: String(row.author ?? "GlowCart Beauty"),
          category: String(row.category ?? "Beauty Tips"),
          tags: Array.isArray(row.tags) ? row.tags.join(", ") : "",
          status: (row.status as BlogFormValues["status"]) ?? "draft",
          seoTitle: String(row.seoTitle ?? ""),
          seoDescription: String(row.seoDescription ?? ""),
        });
      } finally {
        setLoading(false);
      }
    }

    void loadBlog();
  }, [mode, blogId, reset]);

  async function onSubmit(values: BlogFormValues) {
    const result =
      mode === "create"
        ? await createAdminBlog(values)
        : await updateAdminBlog(blogId!, values);

    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage: mode === "create" ? "Blog post created." : "Blog post updated.",
      error: result.error,
      message: result.message,
    });

    if (result.ok) {
      router.push(routes.admin.blogs);
      router.refresh();
    }
  }

  if (loading) {
    return (
      <Card className="border-border/60">
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
          <CardDescription>Title, slug, and cover image.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title" error={errors.title?.message} className="sm:col-span-2">
            <Input id="title" {...register("title")} className="h-10 rounded-lg" />
          </FormField>
          <FormField label="Slug" htmlFor="slug" error={errors.slug?.message}>
            <Input id="slug" {...register("slug")} className="h-10 rounded-lg" />
          </FormField>
          <FormField label="Status" htmlFor="status" error={errors.status?.message}>
            <Select id="status" {...register("status")} className="h-10 rounded-lg">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </FormField>
          <div className="sm:col-span-2">
            <ImageUploadField
              folder="blogs"
              label="Cover image"
              aspectClassName="aspect-[16/9]"
              value={watch("coverImage") ? [watch("coverImage")!] : []}
              onChange={(urls) => setValue("coverImage", urls[0] ?? "")}
              fallbackGradient="from-rose-100 to-pink-50"
            />
          </div>
          <FormField label="Excerpt" htmlFor="excerpt" error={errors.excerpt?.message} className="sm:col-span-2">
            <Textarea id="excerpt" {...register("excerpt")} rows={3} />
          </FormField>
          <FormField label="Content" htmlFor="content" error={errors.content?.message} className="sm:col-span-2">
            <Textarea id="content" {...register("content")} rows={12} placeholder="Write your beauty tips..." />
          </FormField>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Author" htmlFor="author" error={errors.author?.message}>
            <Input id="author" {...register("author")} className="h-10 rounded-lg" />
          </FormField>
          <FormField label="Category" htmlFor="category" error={errors.category?.message}>
            <Input id="category" {...register("category")} className="h-10 rounded-lg" />
          </FormField>
          <FormField label="Tags" htmlFor="tags" error={errors.tags?.message} className="sm:col-span-2">
            <Input id="tags" {...register("tags")} placeholder="skincare, glow, tips" className="h-10 rounded-lg" />
          </FormField>
          <FormField label="SEO title" htmlFor="seoTitle" error={errors.seoTitle?.message} className="sm:col-span-2">
            <Input id="seoTitle" {...register("seoTitle")} className="h-10 rounded-lg" />
          </FormField>
          <FormField label="SEO description" htmlFor="seoDescription" error={errors.seoDescription?.message} className="sm:col-span-2">
            <Textarea id="seoDescription" {...register("seoDescription")} rows={3} />
          </FormField>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" className="rounded-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : mode === "create" ? "Create Post" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" className="rounded-full" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
