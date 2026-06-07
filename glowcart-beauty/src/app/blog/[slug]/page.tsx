import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronRight, Tag, User } from "lucide-react";

import { RelatedPosts } from "@/components/blog/blog-listing";
import { Container } from "@/components/common/container";
import { routes } from "@/constants/routes";
import { getBlogBySlug, getRelatedBlogs } from "@/lib/blog/service";
import { buildPageMetadata } from "@/lib/seo";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return buildPageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) notFound();

  const related = await getRelatedBlogs(post.slug, post.category);
  const date = post.publishedAt ?? post.createdAt;

  return (
    <article className="bg-gradient-to-b from-rose-50/40 via-white to-beige-50/30">
      <Container className="py-8 sm:py-12 lg:py-16">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href={routes.blog} className="transition-colors hover:text-primary">
            Blog
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-medium text-foreground">{post.title}</span>
        </nav>

        <header className="mx-auto max-w-3xl space-y-5 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {post.category}
          </span>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">{post.excerpt}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-4" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4" />
              {new Date(date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {post.coverImage ? (
          <div className="relative mx-auto mt-10 aspect-[21/9] max-w-5xl overflow-hidden rounded-2xl border border-border/60 shadow-sm">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        ) : null}

        <div
          className="prose prose-neutral mx-auto mt-10 max-w-3xl prose-headings:font-heading prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length ? (
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center gap-2">
            <Tag className="size-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-white px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <RelatedPosts posts={related} />
      </Container>
    </article>
  );
}
