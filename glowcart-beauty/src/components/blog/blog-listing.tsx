import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

import { Container } from "@/components/common/container";
import { routes } from "@/constants/routes";
import type { BlogPost } from "@/types/blog";
import { cn } from "@/lib/utils";

type BlogCardProps = {
  post: BlogPost;
  featured?: boolean;
};

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const date = post.publishedAt ?? post.createdAt;

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        featured && "sm:col-span-2 lg:col-span-2"
      )}
    >
      <Link href={routes.blogPost(post.slug)} className="block">
        <div
          className={cn(
            "relative overflow-hidden bg-gradient-to-br from-rose-100 to-pink-50",
            featured ? "aspect-[21/9]" : "aspect-[16/10]"
          )}
        >
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {post.category}
          </span>
        </div>
        <div className="space-y-3 p-5 sm:p-6">
          <h2
            className={cn(
              "font-heading font-medium text-foreground transition-colors group-hover:text-primary",
              featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
            )}
          >
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

type BlogListingProps = {
  posts: BlogPost[];
};

export function BlogListing({ posts }: BlogListingProps) {
  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-white/60 p-12 text-center">
        <p className="font-heading text-xl text-foreground">Beauty tips coming soon</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back for skincare routines, makeup tutorials, and glow guides.
        </p>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featured ? <BlogCard post={featured} featured /> : null}
      {rest.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

type RelatedPostsProps = {
  posts: BlogPost[];
};

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="mt-16 border-t border-border/60 pt-12">
      <Container className="px-0">
        <h2 className="mb-6 font-heading text-2xl font-medium text-foreground">Related Beauty Tips</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
