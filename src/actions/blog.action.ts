"use server";

import prisma from "@/lib/prisma";
import { action } from "@/lib/safe-action";
import { blogSchema, blogUpdateSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const createBlogPostAction = action
  .inputSchema(blogSchema)
  .action(async ({ parsedInput }) => {
    const slug = parsedInput.slug || slugify(parsedInput.title);

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      throw new Error("Un article avec ce titre existe déjà.");
    }

    await prisma.blogPost.create({
      data: {
        ...parsedInput,
        slug,
      },
    });

    revalidatePath("/blog");
  });

export const updateBlogPostAction = action
  .inputSchema(blogUpdateSchema)
  .action(async ({ parsedInput }) => {
    const { id, slug, title, ...data } = parsedInput;

    const finalSlug = slug || slugify(title);

    const existing = await prisma.blogPost.findFirst({
      where: {
        slug: finalSlug,
        NOT: { id },
      },
    });

    if (existing) {
      throw new Error("Un article avec ce titre existe déjà.");
    }

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        slug: finalSlug,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${finalSlug}`);
  });

export const deleteBlogPostAction = action
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    await prisma.blogPost.delete({ where: { id: parsedInput.id } });
    revalidatePath("/blog");
  });

export const publishBlogPostAction = action
  .inputSchema(z.object({ id: z.string(), published: z.boolean() }))
  .action(async ({ parsedInput }) => {
    const { id, published } = parsedInput;

    await prisma.blogPost.update({
      where: { id },
      data: { published },
    });

    revalidatePath("/blog");
  });