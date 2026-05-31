import { z } from "zod";

export const MediaKindSchema = z.enum(["image", "pdf"]);

export const MediaSchema = z.object({
  kind: MediaKindSchema,
  url: z.string().url("URL invalide"),
  filename: z.string().min(1, "Nom de fichier requis").max(200),
  alt: z.union([z.string().max(300), z.null()]),
  caption: z.union([z.string().max(500), z.null()]),
});

export type MediaFormValues = z.infer<typeof MediaSchema>;

export function makeDefaultMediaValues(): MediaFormValues {
  return {
    kind: "image",
    url: "",
    filename: "",
    alt: null,
    caption: null,
  };
}
