export const BLOG_CATEGORIES = [
  "ENTREPRISE",
  "TECHNOLOGIE",
  "PROJETS",
  "CARRIERES",
  "EVENEMENTS",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  views: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPostWithAuthor extends BlogPost {
  author: {
    id: string;
    name: string;
    image: string | null;
  };
}