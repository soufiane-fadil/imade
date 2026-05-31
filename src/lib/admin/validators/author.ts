import { z } from "zod";
import { slugify } from "../utils";

export const AuthorSchema = z.object({
  name: z.string().min(2, "Nom requis (min 2)").max(120),
  slug: z
    .string()
    .min(2, "Slug requis (min 2)")
    .regex(/^[a-z0-9-]+$/, "Slug invalide"),
  descriptionHtml: z.string().max(5000),
  photoUrl: z.union([z.string().url("URL invalide"), z.null()]),
});

export type AuthorFormValues = z.infer<typeof AuthorSchema>;

export function makeDefaultAuthorValues(): AuthorFormValues {
  return { name: "", slug: "", descriptionHtml: "", photoUrl: null };
}

export function authorSlugFor(name: string): string {
  return slugify(name);
}
