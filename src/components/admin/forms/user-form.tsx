"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { AdminField } from "@/components/admin/forms/admin-field";
import { FormSection } from "@/components/admin/forms/form-section";
import { Switch } from "@/components/ui/switch";
import {
  UserSchema,
  makeDefaultUserValues,
  type UserFormValues,
} from "@/lib/admin/validators/user";
import { useCreateUser, useUpdateUser } from "@/lib/admin/queries/use-users";
import { RepositoryError, type User, type UserRole } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type UserFormProps = {
  mode: "create" | "edit";
  initial?: User;
  onSuccess?: () => void;
};

type ScopeOption = {
  id: UserRole;
  label: string;
  desc: string;
};

const SCOPES: ScopeOption[] = [
  {
    id: "admin",
    label: "Administrateur",
    desc: "Accès total : utilisateurs, configuration, suppression d'articles, médias.",
  },
  {
    id: "editor",
    label: "Éditeur",
    desc: "Rédige et publie les articles. Pas d'accès aux utilisateurs.",
  },
  {
    id: "reader",
    label: "Lecteur",
    desc: "Accède au back-office en lecture seule (consultation des contenus).",
  },
];

export function UserForm({ mode, initial, onSuccess }: UserFormProps) {
  const router = useRouter();
  const create = useCreateUser();
  const update = useUpdateUser();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: initial
      ? {
          email: initial.email,
          firstName: initial.firstName,
          lastName: initial.lastName,
          role: initial.role,
          status: initial.status,
        }
      : makeDefaultUserValues(),
  });

  const isSubmitting = create.isPending || update.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (mode === "create") {
        const createdUser = await create.mutateAsync(values);
        onSuccess?.();
        router.replace(`/admin/utilisateurs/${createdUser.id}`);
      } else if (initial) {
        await update.mutateAsync({ id: initial.id, patch: values });
        onSuccess?.();
      }
    } catch (err) {
      if (err instanceof RepositoryError && err.code === "EMAIL_TAKEN") {
        form.setError("email", {
          type: "manual",
          message: "Cet email est déjà utilisé.",
        });
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="mx-auto max-w-3xl" noValidate>
        <div className="adm-card">
          <div className="adm-card__body !p-[22px]">
            <FormSection title="Identité">
              <AdminField
                name="email"
                label="Email"
                required
                hint={
                  mode === "edit"
                    ? "Géré par Kinde — modification synchronisée."
                    : undefined
                }
                render={(field) => (
                  <input
                    {...field}
                    type="email"
                    autoFocus={mode === "create"}
                    autoComplete="email"
                    placeholder="prenom.nom@maison-calorie.fr"
                    className="ainput mono"
                  />
                )}
              />

              <div className="afield__row">
                <AdminField
                  name="firstName"
                  label="Prénom"
                  required
                  className="!mb-0"
                  render={(field) => (
                    <input
                      {...field}
                      type="text"
                      autoComplete="given-name"
                      placeholder="Marie"
                      className="ainput"
                    />
                  )}
                />
                <AdminField
                  name="lastName"
                  label="Nom"
                  required
                  className="!mb-0"
                  render={(field) => (
                    <input
                      {...field}
                      type="text"
                      autoComplete="family-name"
                      placeholder="Dubois"
                      className="ainput"
                    />
                  )}
                />
              </div>
            </FormSection>

            <FormSection title="Rôles & permissions (scopes)">
              <AdminField
                name="role"
                render={(field) => (
                  <div className="flex flex-col gap-2">
                    {SCOPES.map((scope) => {
                      const isOn = field.value === scope.id;
                      return (
                        <label
                          key={scope.id}
                          className={cn(
                            "grid cursor-pointer grid-cols-[22px_1fr] items-start gap-3 rounded-lg border px-3.5 py-3 transition",
                            isOn
                              ? "border-ink bg-paper-2"
                              : "border-paper-line bg-paper hover:border-ink-mute",
                          )}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={scope.id}
                            checked={isOn}
                            onChange={() => field.onChange(scope.id)}
                            className="sr-only"
                          />
                          <span
                            aria-hidden
                            className={cn("adm-check mt-0.5", isOn && "is-on")}
                          />
                          <div>
                            <div className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                              {scope.label}
                              <span
                                className={cn(
                                  "scope-tag",
                                  scope.id === "admin" && "admin",
                                )}
                              >
                                {scope.id}
                              </span>
                            </div>
                            <div className="mt-1 text-[12.5px] text-ink-mute">
                              {scope.desc}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
            </FormSection>

            <FormSection title="Compte">
              <AdminField
                name="status"
                label="Compte actif"
                hint="Un compte suspendu conserve ses données mais ne peut plus se connecter."
                render={(field) => {
                  const isActive = field.value === "active";
                  return (
                    <div className="flex items-center gap-3 rounded-md border border-paper-line bg-paper px-3 py-2.5">
                      <Switch
                        checked={isActive}
                        onCheckedChange={(next) =>
                          field.onChange(next ? "active" : "suspended")
                        }
                        aria-label="Compte actif"
                      />
                      <span
                        className={cn(
                          "text-[13px] font-medium",
                          isActive ? "text-ink" : "text-ink-mute",
                        )}
                      >
                        {isActive ? "Actif" : "Suspendu"}
                      </span>
                    </div>
                  );
                }}
              />
            </FormSection>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            className="abtn abtn--ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="abtn abtn--primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "…"
              : mode === "create"
                ? "Créer l'utilisateur"
                : "Enregistrer"}
          </button>
        </div>
      </form>
    </Form>
  );
}
