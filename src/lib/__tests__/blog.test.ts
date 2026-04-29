import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPublishedPosts,
  getFeaturedPosts,
  getPostBySlug,
  getAllPostSlugs,
  getPostCount,
  createPost,
  updatePost,
  deletePost,
  incrementPostViews,
  getAllTags,
} from "../blog";

vi.mock("@/lib/prisma", () => ({
  default: {
    blogPost: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import prisma from "@/lib/prisma";

const mockPrisma = prisma as unknown as {
  blogPost: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
};

describe("getPublishedPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne seulement les posts publiés", async () => {
    const mockPosts = [
      { id: "1", title: "Post 1", published: true },
      { id: "2", title: "Post 2", published: true },
    ];
    mockPrisma.blogPost.findMany.mockResolvedValue(mockPosts);

    const result = await getPublishedPosts();

    expect(mockPrisma.blogPost.findMany).toHaveBeenCalledWith({
      where: { published: true },
      include: expect.any(Object),
      orderBy: expect.any(Object),
      take: 10,
      skip: 0,
    });
  });

  it("filtre par catégorie", async () => {
    mockPrisma.blogPost.findMany.mockResolvedValue([]);

    await getPublishedPosts({ category: "TECHNOLOGIE" });

    expect(mockPrisma.blogPost.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          published: true,
          category: "TECHNOLOGIE",
        }),
      })
    );
  });

  it("filtre par tag", async () => {
    mockPrisma.blogPost.findMany.mockResolvedValue([]);

    await getPublishedPosts({ tag: "React" });

    expect(mockPrisma.blogPost.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          published: true,
          tags: { has: "React" },
        }),
      })
    );
  });

  it("respecte limit et offset", async () => {
    mockPrisma.blogPost.findMany.mockResolvedValue([]);

    await getPublishedPosts({ limit: 5, offset: 10 });

    expect(mockPrisma.blogPost.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
        skip: 10,
      })
    );
  });
});

describe("getFeaturedPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne les posts featured publiés", async () => {
    const mockPosts = [{ id: "1", title: "Featured Post", featured: true, published: true }];
    mockPrisma.blogPost.findMany.mockResolvedValue(mockPosts);

    const result = await getFeaturedPosts();

    expect(mockPrisma.blogPost.findMany).toHaveBeenCalledWith({
      where: { published: true, featured: true },
      include: expect.any(Object),
      orderBy: expect.any(Object),
      take: 3,
    });
  });
});

describe("getPostBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne le post par slug", async () => {
    const mockPost = { id: "1", slug: "mon-post", title: "Mon Post" };
    mockPrisma.blogPost.findUnique.mockResolvedValue(mockPost);

    const result = await getPostBySlug("mon-post");

    expect(mockPrisma.blogPost.findUnique).toHaveBeenCalledWith({
      where: { slug: "mon-post" },
      include: expect.any(Object),
    });
    expect(result).toEqual(mockPost);
  });

  it("retourne null si slug inexistant", async () => {
    mockPrisma.blogPost.findUnique.mockResolvedValue(null);

    const result = await getPostBySlug("inexistant");

    expect(result).toBeNull();
  });
});

describe("getAllPostSlugs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne la liste des slugs publiés", async () => {
    mockPrisma.blogPost.findMany.mockResolvedValue([
      { slug: "post-1" },
      { slug: "post-2" },
      { slug: "post-3" },
    ]);

    const result = await getAllPostSlugs();

    expect(result).toEqual(["post-1", "post-2", "post-3"]);
  });
});

describe("getPostCount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("compte tous les posts publiés", async () => {
    mockPrisma.blogPost.count.mockResolvedValue(10);

    const result = await getPostCount();

    expect(mockPrisma.blogPost.count).toHaveBeenCalledWith({
      where: { published: true },
    });
  });

  it("compte avec filtre category", async () => {
    mockPrisma.blogPost.count.mockResolvedValue(5);

    await getPostCount({ category: "TECHNOLOGIE" });

    expect(mockPrisma.blogPost.count).toHaveBeenCalledWith({
      where: expect.objectContaining({
        published: true,
        category: "TECHNOLOGIE",
      }),
    });
  });
});

describe("createPost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crée un post avec les données requises", async () => {
    const newPost = {
      id: "new-id",
      slug: "nouveau-post",
      title: "Nouveau Post",
      content: "Contenu",
      category: "TECHNOLOGIE",
      authorId: "author-1",
    };
    mockPrisma.blogPost.create.mockResolvedValue(newPost);

    const result = await createPost({
      slug: "nouveau-post",
      title: "Nouveau Post",
      content: "Contenu",
      category: "TECHNOLOGIE",
      authorId: "author-1",
    });

    expect(mockPrisma.blogPost.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        slug: "nouveau-post",
        title: "Nouveau Post",
        content: "Contenu",
        category: "TECHNOLOGIE",
        authorId: "author-1",
        tags: [],
      }),
    });
  });

  it("crée un post avec tags optionnels", async () => {
    mockPrisma.blogPost.create.mockResolvedValue({ id: "1" });

    await createPost({
      slug: "post-avec-tags",
      title: "Post",
      content: "Content",
      category: "TECHNOLOGIE",
      authorId: "author-1",
      tags: ["React", "Next.js"],
    });

    expect(mockPrisma.blogPost.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tags: ["React", "Next.js"],
      }),
    });
  });
});

describe("updatePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("met à jour un post existant", async () => {
    const updatedPost = { id: "1", title: "Titre modifié" };
    mockPrisma.blogPost.update.mockResolvedValue(updatedPost);

    const result = await updatePost("1", { title: "Titre modifié" });

    expect(mockPrisma.blogPost.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { title: "Titre modifié" },
    });
  });

  it("met à jour plusieurs champs", async () => {
    mockPrisma.blogPost.update.mockResolvedValue({ id: "1" });

    await updatePost("1", {
      title: "Nouveau titre",
      published: true,
      category: "PROJETS",
    });

    expect(mockPrisma.blogPost.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        title: "Nouveau titre",
        published: true,
        category: "PROJETS",
      },
    });
  });
});

describe("deletePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("supprime un post par id", async () => {
    mockPrisma.blogPost.delete.mockResolvedValue({ id: "1" });

    await deletePost("1");

    expect(mockPrisma.blogPost.delete).toHaveBeenCalledWith({
      where: { id: "1" },
    });
  });
});

describe("incrementPostViews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("incrémente les vues de 1", async () => {
    mockPrisma.blogPost.update.mockResolvedValue({ id: "1", views: 1 });

    await incrementPostViews("1");

    expect(mockPrisma.blogPost.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { views: { increment: 1 } },
    });
  });
});

describe("getAllTags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne les tags uniques triés", async () => {
    mockPrisma.blogPost.findMany.mockResolvedValue([
      { tags: ["React", "Next.js"] },
      { tags: ["React", "TypeScript"] },
      { tags: ["Next.js"] },
    ]);

    const result = await getAllTags();

    expect(result).toEqual(["Next.js", "React", "TypeScript"]);
  });

  it("retourne un tableau vide s'il n'y a pas de posts", async () => {
    mockPrisma.blogPost.findMany.mockResolvedValue([]);

    const result = await getAllTags();

    expect(result).toEqual([]);
  });
});