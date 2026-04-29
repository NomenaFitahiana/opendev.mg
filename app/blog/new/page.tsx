import { createMetadata } from "@/lib/metadata";
import { BlogPostForm } from "@/components/blog/blog-post-form";

export const metadata = createMetadata({ title: "Nouvel article" });

export default function NewBlogPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouvel article</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Créez un nouvel article de blog.
        </p>
      </div>
      <BlogPostForm mode="create" />
    </div>
  );
}