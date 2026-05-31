import { z } from "zod";
import { slugify } from "../utils";

export const CategorySchema = z.object({
  name: z.string().min(2, "Nom requis (min 2)").max(80),
  slug: z
    .string()
    .min(2, "Slug requis (min 2)")
    .regex(/^[a-z0-9-]+$/, "Slug invalide"),
  descriptionHtml: z.string().max(5000),
});

export type CategoryFormValues = z.infer<typeof CategorySchema>;

export function makeDefaultCategoryValues(): CategoryFormValues {
  return { name: "", slug: "", descriptionHtml: "" };
}

export function slugFor(name: string): string {
  return slugify(name);
}
