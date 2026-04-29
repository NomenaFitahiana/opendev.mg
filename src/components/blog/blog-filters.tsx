"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { BlogCategory } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES } from "@/types/blog";

const categoryLabels: Record<string, string> = {
  ENTREPRISE: "Entreprise",
  TECHNOLOGIE: "Technologie",
  PROJETS: "Projets",
  CARRIERES: "Carrières",
  EVENEMENTS: "Événements",
};

interface BlogFiltersProps {
  tags?: string[];
}

export function BlogFilters({ tags = [] }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  function setCategory(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!currentCategory ? "default" : "outline"}
          size="sm"
          onClick={() => setCategory(null)}
        >
          Tous
        </Button>
        {BLOG_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={currentCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(category)}
          >
            {categoryLabels[category] || category}
          </Button>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Button key={tag} variant="ghost" size="sm" className="text-xs">
              #{tag}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}