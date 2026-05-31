import { z } from "zod";

export const ContactStatusSchema = z.enum(["unread", "handled", "archived"]);

export const ContactSchema = z.object({
  name: z.string().min(2, "Nom requis (min 2)").max(120),
  email: z.string().email("Email invalide"),
  subject: z.string().min(2, "Sujet requis (min 2)").max(200),
  message: z.string().min(5, "Message trop court").max(5000),
});

export type ContactFormValues = z.infer<typeof ContactSchema>;

export function makeDefaultContactValues(): ContactFormValues {
  return { name: "", email: "", subject: "", message: "" };
}
