import type { BlogPost } from "@/types/blog";
import { connectDB } from "@/lib/db";
import { Blog, type BlogDocument, type BlogStatus } from "@/models/Blog";

export { slugifyTitle } from "@/lib/blog/slugify";

function mapBlog(doc: BlogDocument): BlogPost {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    coverImage: doc.coverImage || undefined,
    excerpt: doc.excerpt ?? "",
    content: doc.content ?? "",
    author: doc.author,
    category: doc.category ?? "Beauty Tips",
    tags: doc.tags ?? [],
    status: doc.status as BlogPost["status"],
    seoTitle: doc.seoTitle || undefined,
    seoDescription: doc.seoDescription || undefined,
    publishedAt: doc.publishedAt?.toISOString(),
    createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function getPublishedBlogs(limit = 50): Promise<BlogPost[]> {
  try {
    await connectDB();
    const blogs = await Blog.find({ status: "published" as BlogStatus })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit);
    return blogs.map(mapBlog);
  } catch {
    return [];
  }
}

export async function getAllBlogs(admin = false): Promise<BlogPost[]> {
  try {
    await connectDB();
    const filter = admin ? {} : { status: "published" as BlogStatus };
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    return blogs.map(mapBlog);
  } catch {
    return [];
  }
}

export async function getBlogBySlug(slug: string, admin = false): Promise<BlogPost | null> {
  try {
    await connectDB();
    const filter: Record<string, unknown> = { slug: slug.toLowerCase() };
    if (!admin) filter.status = "published" as BlogStatus;
    const blog = await Blog.findOne(filter);
    return blog ? mapBlog(blog) : null;
  } catch {
    return null;
  }
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  try {
    await connectDB();
    const blog = await Blog.findById(id);
    return blog ? mapBlog(blog) : null;
  } catch {
    return null;
  }
}

export async function getRelatedBlogs(slug: string, category: string, limit = 3): Promise<BlogPost[]> {
  try {
    await connectDB();
    const blogs = await Blog.find({
      slug: { $ne: slug.toLowerCase() },
      status: "published" as BlogStatus,
      category,
    })
      .sort({ publishedAt: -1 })
      .limit(limit);
    return blogs.map(mapBlog);
  } catch {
    return [];
  }
}
