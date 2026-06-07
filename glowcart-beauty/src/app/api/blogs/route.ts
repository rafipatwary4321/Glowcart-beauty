export const runtime = "nodejs";

import { auth } from "@/auth";
import { ApiRouteError, apiSuccess, serializeDocument, serializeDocuments, withDb } from "@/lib/api";
import { isAdmin } from "@/lib/auth/roles";
import { Blog, type BlogStatus } from "@/models";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  coverImage: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  author: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const GET = withDb(async (request: Request) => {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "true";

  if (admin && !isAdmin(session)) {
    throw new ApiRouteError("Admin access required.", 403);
  }

  const filter = admin ? {} : { status: "published" as BlogStatus };
  const blogs = await Blog.find(filter).sort({ createdAt: -1 });

  return apiSuccess({ items: serializeDocuments(blogs) });
});

export const POST = withDb(async (request: Request) => {
  const session = await auth();
  if (!isAdmin(session)) throw new ApiRouteError("Admin access required.", 403);

  const parsed = blogSchema.safeParse(await request.json());
  if (!parsed.success) {
    throw new ApiRouteError(parsed.error.issues[0]?.message ?? "Invalid blog payload.", 400);
  }

  const data = parsed.data;
  const blog = await Blog.create({
    ...data,
    slug: data.slug.toLowerCase(),
    publishedAt: data.status === "published" ? new Date() : undefined,
  });

  return apiSuccess(serializeDocument(blog), { status: 201, message: "Blog created." });
});
