import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    blogPost: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import prisma from "@/lib/prisma";
import { createBlogPostAction, deleteBlogPostAction } from "../blog.action";

const mockPrisma = prisma as unknown as {
  blogPost: {
    findUnique: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

describe("createBlogPostAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crée un article avec des données valides", async () => {
    mockPrisma.blogPost.findUnique.mockResolvedValue(null);
    mockPrisma.blogPost.create.mockResolvedValue({
      id: "new-id",
      slug: "mon-article",
      title: "Mon Article",
      content: "Contenu de l'article",
      category: "TECHNOLOGIE",
      authorId: "author-1",
      published: false,
      featured: false,
      tags: [],
      excerpt: null,
      coverImage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    });

    const result = await createBlogPostAction({
      title: "Mon Article",
      content: "Contenu de l'article",
      category: "TECHNOLOGIE",
      authorId: "author-1",
    });

    expect(mockPrisma.blogPost.create).toHaveBeenCalled();
    expect(mockPrisma.blogPost.findUnique).toHaveBeenCalledWith({ where: { slug: "mon-article" } });
  });

  it("rejette si le slug existe déjà", async () => {
    mockPrisma.blogPost.findUnique.mockResolvedValue({
      id: "existing-id",
      slug: "mon-article",
    });

    const result = await createBlogPostAction({
      title: "Mon Article",
      content: "Contenu très long de cet article qui a plus de 20 caractères",
      category: "TECHNOLOGIE",
      authorId: "author-1",
    });

    expect(result).toHaveProperty("serverError");
  });
});

describe("deleteBlogPostAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("supprime un article existant", async () => {
    mockPrisma.blogPost.delete.mockResolvedValue({ id: "1" });

    await deleteBlogPostAction({ id: "1" });

    expect(mockPrisma.blogPost.delete).toHaveBeenCalledWith({
      where: { id: "1" },
    });
  });
});