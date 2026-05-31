import { z } from "zod";

export const UserRoleSchema = z.enum(["admin", "editor", "reader"]);
export const UserStatusSchema = z.enum(["active", "suspended"]);

export const UserSchema = z.object({
  email: z.string().email("Email invalide"),
  firstName: z.string().min(1, "Prénom requis").max(80),
  lastName: z.string().min(1, "Nom requis").max(80),
  role: UserRoleSchema,
  status: UserStatusSchema,
});

export type UserFormValues = z.infer<typeof UserSchema>;

export function makeDefaultUserValues(): UserFormValues {
  return {
    email: "",
    firstName: "",
    lastName: "",
    role: "reader",
    status: "active",
  };
}
