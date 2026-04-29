import { Suspense } from "react";
import { createMetadata } from "@/lib/metadata";
import { BlogFilters } from "@/components/blog/blog-filters";
import { BlogCard } from "@/components/blog/blog-card";
import { getPublishedPosts } from "@/lib/blog";

export const metadata = createMetadata({
  title: "Blog",
  description: "Actualités et articles sur nos projets, technologies et événements.",
});

type SearchParams = {
  category?: string;
  page?: string;
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const category = params.category;
  const posts = await getPublishedPosts({ category });

  return (
    <div className="container mx-auto py-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Actualités, tutoriels et histoires depuis notre équipe.
        </p>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <BlogFilters />
      </Suspense>

      {category && (
        <p className="col-span-full mt-4 text-sm text-muted-foreground">
          Filtré par: {category}
        </p>
      )}

      {posts.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex justify-center">
          <p className="text-muted-foreground">
            Aucun article pour le moment. Revenez bientôt !
          </p>
        </div>
      )}
    </div>
  );
}