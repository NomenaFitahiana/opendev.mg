"use client";

import { useForm } from "@/components/ui/tanstack-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ForwardRefEditor } from "@/components/templates/forward-ref-editor";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { BLOG_CATEGORIES } from "@/types/blog";

const blogPostSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Le contenu est requis"),
  coverImage: z.string().optional(),
  category: z.string().min(1, "La catégorie est requise"),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  defaultValues?: BlogPostFormValues & { id: string };
  mode?: "create" | "edit";
}

const categoryLabels: Record<string, string> = {
  ENTREPRISE: "Entreprise",
  TECHNOLOGIE: "Technologie",
  PROJETS: "Projets",
  CARRIERES: "Carrières",
  EVENEMENTS: "Événements",
};

export function BlogPostForm({
  defaultValues,
  mode = "create",
}: BlogPostFormProps) {
  const router = useRouter();

  const [contentValue, setContentValue] = useState(
    defaultValues?.content ?? ""
  );

  const [tagsInput, setTagsInput] = useState(
    defaultValues?.tags?.join(", ") ?? ""
  );

  const form = useForm({
    schema: blogPostSchema,
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      category: "TECHNOLOGIE",
      tags: [],
      published: false,
      featured: false,
      ...defaultValues,
    },
    onSubmit: (values) => {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      console.log("Submit:", { ...values, tags, content: contentValue });

      toast.success(
        mode === "create" ? "Article créé !" : "Article mis à jour !"
      );
      router.push("/blog");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form.AppField name="title">
              {(field) => (
                <field.Field>
                  <field.Label>Titre *</field.Label>
                  <field.Content>
                    <field.Input placeholder="Mon super article" />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>

            <form.AppField name="slug">
              {(field) => (
                <field.Field>
                  <field.Label>Slug *</field.Label>
                  <field.Content>
                    <field.Input placeholder="mon-super-article" />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>

            <form.AppField name="excerpt">
              {(field) => (
                <field.Field>
                  <field.Label>Résumé</field.Label>
                  <field.Content>
                    <field.Input placeholder="Un court résumé..." />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>

            <form.AppField name="category">
              {(field) => (
                <field.Field>
                  <field.Label>Catégorie *</field.Label>
                  <field.Content>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOG_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {categoryLabels[cat] || cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>

            <form.AppField name="coverImage">
              {(field) => (
                <field.Field>
                  <field.Label>Image de couverture (URL)</field.Label>
                  <field.Content>
                    <field.Input placeholder="https://..." />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="react, tutorial, nextjs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contenu (MDX)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md min-h-[400px]">
              <ForwardRefEditor
                markdown={contentValue}
                onChange={(v) => setContentValue(v ?? "")}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Options de publication</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form.AppField name="published">
              {(field) => (
                <field.Field>
                  <field.Label className="flex items-center gap-2">
                    <field.Input type="checkbox" className="w-4 h-4" />
                    Publié
                  </field.Label>
                </field.Field>
              )}
            </form.AppField>

            <form.AppField name="featured">
              {(field) => (
                <field.Field>
                  <field.Label className="flex items-center gap-2">
                    <field.Input type="checkbox" className="w-4 h-4" />
                    À la une
                  </field.Label>
                </field.Field>
              )}
            </form.AppField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prévisualisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 rounded-lg border bg-muted/50">
              <p className="font-medium line-clamp-1">
                {form.state.values.title || "Titre de l'article"}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {form.state.values.excerpt || "Résumé de l'article..."}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                  {categoryLabels[form.state.values.category] || form.state.values.category}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {mode === "create" ? "Créer l'article" : "Mettre à jour"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/blog")}
          >
            Annuler
          </Button>
        </div>
      </div>
    </form>
  );
}