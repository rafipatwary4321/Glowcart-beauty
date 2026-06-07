export const runtime = "nodejs";

import { auth } from "@/auth";
import { ApiRouteError, apiSuccess, serializeDocument, withDb } from "@/lib/api";
import { isAdmin } from "@/lib/auth/roles";
import { isValidObjectId } from "@/lib/db";
import { Blog } from "@/models";
import { z } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

const blogSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  coverImage: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  author: z.string().min(1).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

function getQuery(id: string) {
  return isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };
}

export const GET = withDb(async (request: Request, context?: unknown) => {
  const session = await auth();
  const { id } = await (context as RouteContext).params;
  const blog = await Blog.findOne(getQuery(id));

  if (!blog) throw new ApiRouteError("Blog not found.", 404);
  if (blog.status !== "published" && !isAdmin(session)) {
    throw new ApiRouteError("Blog not found.", 404);
  }

  return apiSuccess(serializeDocument(blog));
});

export const PUT = withDb(async (request: Request, context?: unknown) => {
  const session = await auth();
  if (!isAdmin(session)) throw new ApiRouteError("Admin access required.", 403);

  const { id } = await (context as RouteContext).params;
  const parsed = blogSchema.safeParse(await request.json());
  if (!parsed.success) throw new ApiRouteError("Invalid blog payload.", 400);

  const update: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.slug) update.slug = parsed.data.slug.toLowerCase();
  if (parsed.data.status === "published") {
    update.publishedAt = new Date();
  }

  const blog = await Blog.findOneAndUpdate(getQuery(id), update, {
    new: true,
    runValidators: true,
  });

  if (!blog) throw new ApiRouteError("Blog not found.", 404);

  return apiSuccess(serializeDocument(blog), { message: "Blog updated." });
});

export const DELETE = withDb(async (_request: Request, context?: unknown) => {
  const session = await auth();
  if (!isAdmin(session)) throw new ApiRouteError("Admin access required.", 403);

  const { id } = await (context as RouteContext).params;
  const blog = await Blog.findOneAndDelete(getQuery(id));

  if (!blog) throw new ApiRouteError("Blog not found.", 404);

  return apiSuccess({ id: blog._id.toString() }, { message: "Blog deleted." });
});
