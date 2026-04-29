import Link from "next/link";
import Image from "next/image";
import type { BlogPostWithAuthor } from "@/types/blog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPostWithAuthor;
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const categoryLabels: Record<string, string> = {
  ENTREPRISE: "Entreprise",
  TECHNOLOGIE: "Technologie",
  PROJETS: "Projets",
  CARRIERES: "Carrières",
  EVENEMENTS: "Événements",
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-md">
        {post.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="p-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {categoryLabels[post.category] || post.category}
            </Badge>
            {post.featured && (
              <Badge variant="default" className="text-xs">
                À la une
              </Badge>
            )}
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {post.excerpt || post.content.slice(0, 150)}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <div className="flex items-center gap-2">
            {post.author.image && (
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-xs text-muted-foreground">
              {post.author.name}
            </span>
          </div>
          <time className="text-xs text-muted-foreground">
            {formatDate(post.createdAt)}
          </time>
        </CardFooter>
      </Card>
    </Link>
  );
}