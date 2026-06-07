import type { MetadataRoute } from "next";

import { products } from "@/data/products";
import { getPublishedBlogs } from "@/lib/blog/service";
import { getSiteUrl } from "@/lib/seo";
import { connectDB } from "@/lib/db";
import { Brand, Category } from "@/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms-and-conditions`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/return-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  let categoryPages: MetadataRoute.Sitemap = [];
  let brandPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    await connectDB();
    const [categories, brands, blogs] = await Promise.all([
      Category.find({ isActive: true }).select("slug updatedAt"),
      Brand.find({ isActive: true }).select("slug updatedAt"),
      getPublishedBlogs(200),
    ]);

    categoryPages = categories.map((category) => ({
      url: `${base}/categories/${category.slug}`,
      lastModified: category.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    brandPages = brands.map((brand) => ({
      url: `${base}/brands/${brand.slug}`,
      lastModified: brand.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    blogPages = blogs.map((blog) => ({
      url: `${base}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    blogPages = [];
  }

  return [...staticPages, ...productPages, ...categoryPages, ...brandPages, ...blogPages];
}
