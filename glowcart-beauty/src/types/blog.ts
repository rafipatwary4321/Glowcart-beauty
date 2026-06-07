export type BlogStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  status: BlogStatus;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogFormValues = {
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string;
  status: BlogStatus;
  seoTitle: string;
  seoDescription: string;
};
