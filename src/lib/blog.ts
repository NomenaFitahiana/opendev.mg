import prisma from "./prisma";
import type { BlogPost, BlogPostWithAuthor } from "@/types/blog";

export async function getPublishedPosts(options?: {
  category?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}): Promise<BlogPostWithAuthor[]> {
  const { category, tag, limit = 10, offset = 0 } = options || {};

  const where: Record<string, unknown> = { published: true };
  if (category) where.category = category;
  if (tag) where.tags = { has: tag };

  return prisma.blogPost.findMany({
    where,
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  }) as Promise<BlogPostWithAuthor[]>;
}

export async function getFeaturedPosts(): Promise<BlogPostWithAuthor[]> {
  return prisma.blogPost.findMany({
    where: { published: true, featured: true },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  }) as Promise<BlogPostWithAuthor[]>;
}

export async function getPostBySlug(slug: string): Promise<BlogPostWithAuthor | null> {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  }) as Promise<BlogPostWithAuthor | null>;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((p) => p.slug);
}

export async function getPostCount(options?: {
  category?: string;
  tag?: string;
}): Promise<number> {
  const { category, tag } = options || {};

  const where: Record<string, unknown> = { published: true };
  if (category) where.category = category;
  if (tag) where.tags = { has: tag };

  return prisma.blogPost.count({ where });
}

export async function createPost(data: {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  published?: boolean;
  featured?: boolean;
  authorId: string;
}): Promise<BlogPost> {
  return prisma.blogPost.create({
    data: {
      ...data,
      tags: data.tags ?? [],
    },
  }) as Promise<BlogPost>;
}

export async function updatePost(
  id: string,
  data: Partial<{
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    tags: string[];
    published: boolean;
    featured: boolean;
  }>
): Promise<BlogPost> {
  return prisma.blogPost.update({
    where: { id },
    data,
  }) as Promise<BlogPost>;
}

export async function deletePost(id: string): Promise<void> {
  await prisma.blogPost.delete({ where: { id } });
}

export async function incrementPostViews(id: string): Promise<void> {
  await prisma.blogPost.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

export async function getAllTags(): Promise<string[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { tags: true },
  });

  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}