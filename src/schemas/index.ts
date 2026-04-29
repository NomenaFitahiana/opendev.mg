import z from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Email invalide" }),
  password: z.string().min(8, { error: "Mot de passe trop court" }),
  rememberMe: z.boolean().default(false),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { error: "Le mot de passe doit contenir au moins 8 caractères" })
      .max(60, { error: "Le mot de passe ne doit pas dépasser 60 caractères" }),
    confirmPassword: z
      .string()
      .min(1, { error: "Veuillez confirmer votre mot de passe" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(80, "Le nom est trop long."),
  email: z.email("Adresse email invalide.").min(1, "L'email est requis."),
  projectDescription: z
    .string()
    .min(20, "Décrivez votre projet en au moins 20 caractères.")
    .max(1000, "La description ne doit pas dépasser 1000 caractères."),
  budget: z.string().min(1, "Veuillez sélectionner une fourchette de budget."),
});

export const projectSchema = z.object({
  title: z.string().min(2, "Titre requis"),
  clientName: z.string().min(1, "Nom du client requis"),
  hideClientName: z.boolean().default(false),
  shortDescription: z.string().max(200, "Maximum 200 caractères"),
  longDescription: z.string().min(1, "Description détaillée requise"),
  problem: z.string().optional(),
  solution: z.string().optional(),
  technologyIds: z.array(z.string()).default([]),
  duration: z.coerce.number().min(1),
  teamSize: z.coerce.number().min(1),
  budget: z.coerce.number().optional(),
  metrics: z.string().optional(),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "FEATURED"]).default("COMPLETED"),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

export const technologySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50, "Le nom ne doit pas dépasser 50 caractères"),
  category: z.enum(["FRONTEND", "BACKEND", "MOBILE", "DATABASE", "DEVOPS", "DESIGN", "OTHER"]),
  logo: z.string().optional(),
});

export const testimonialSchema = z.object({
  clientName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(60, "Le nom ne doit pas dépasser 60 caractères"),
  clientRole: z
    .string()
    .min(2, "Le poste doit contenir au moins 2 caractères")
    .max(80, "Le poste ne doit pas dépasser 80 caractères"),
  company: z
    .string()
    .min(2, "L'entreprise doit contenir au moins 2 caractères")
    .max(80, "L'entreprise ne doit pas dépasser 80 caractères"),
  content: z
    .string()
    .min(20, "Le témoignage doit contenir au moins 20 caractères")
    .max(500, "Le témoignage ne doit pas dépasser 500 caractères"),
  photo: z.url("URL invalide").optional().or(z.literal("")),
  projectId: z.string().optional().or(z.literal("")),
  active: z.boolean().default(true),
});

export const blogSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères").max(150, "Le titre ne doit pas dépasser 150 caractères"),
  slug: z.string().max(100, "Le slug ne doit pas dépasser 100 caractères").optional(),
  excerpt: z.string().max(300, "Le résumé ne doit pas dépasser 300 caractères").optional(),
  content: z.string().min(20, "Le contenu doit contenir au moins 20 caractères"),
  coverImage: z.string().url("URL invalide").optional().or(z.literal("")),
  category: z.enum(["ENTREPRISE", "TECHNOLOGIE", "PROJETS", "CARRIERES", "EVENEMENTS"]),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  authorId: z.string().min(1, "L'auteur est requis"),
});

export const blogUpdateSchema = blogSchema.merge(z.object({
  id: z.string(),
}));
