import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/metadata";
import { BlogPostForm } from "@/components/blog/blog-post-form";
import { getPostBySlug } from "@/lib/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return createMetadata({ title: `Modifier - ${slug}` });
}

export default async function EditBlogPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Modifier l'article</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Modifiez les détails de l'article.
        </p>
      </div>
      <BlogPostForm
        mode="edit"
        defaultValues={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt || "",
          content: post.content,
          coverImage: post.coverImage || "",
          category: post.category,
          tags: post.tags || [],
          published: post.published,
          featured: post.featured,
        }}
      />
    </div>
  );
}