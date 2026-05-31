import { z } from "zod";
import { slugify } from "../utils";

export const ArticleStatusSchema = z.enum(["draft", "published", "archived"]);

export const FaqItemSchema = z.object({
  question: z.string().min(3, "Question requise"),
  answer: z.string().min(3, "Réponse requise"),
});

export const ArticleSchema = z.object({
  title: z.string().min(5, "Titre trop court").max(180),
  slug: z
    .string()
    .min(3, "Slug trop court")
    .regex(/^[a-z0-9-]+$/, "Slug invalide"),
  seoExcerpt: z
    .string()
    .min(20, "Au moins 20 caractères")
    .max(200, "Max 200 caractères"),
  metaDescription: z.string().max(160, "Max 160 caractères"),
  metaKeywords: z.array(z.string().min(1)).max(15),
  contentHtml: z.string().min(20, "Contenu trop court"),
  coverMediaId: z.union([z.string(), z.null()]),
  attachedMediaIds: z.array(z.string()),
  readingMinutes: z.number().int().min(1).max(120),
  categoryId: z.string().min(1, "Catégorie requise"),
  authorId: z.string().min(1, "Auteur requis"),
  faqs: z.array(FaqItemSchema).max(20),
  status: ArticleStatusSchema,
});

export type ArticleFormValues = z.infer<typeof ArticleSchema>;

export function makeDefaultArticleValues(): ArticleFormValues {
  return {
    title: "",
    slug: "",
    seoExcerpt: "",
    metaDescription: "",
    metaKeywords: [],
    contentHtml: "",
    coverMediaId: null,
    attachedMediaIds: [],
    readingMinutes: 1,
    categoryId: "",
    authorId: "",
    faqs: [],
    status: "draft",
  };
}

export function articleSlugFor(title: string): string {
  return slugify(title);
}
