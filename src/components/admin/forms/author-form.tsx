"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { AdminField } from "@/components/admin/forms/admin-field";
import { SlugInput } from "@/components/admin/forms/slug-input";
import { RichTextEditor } from "@/components/admin/forms/rich-text-editor";
import {
  AuthorSchema,
  makeDefaultAuthorValues,
  type AuthorFormValues,
} from "@/lib/admin/validators/author";
import {
  useCreateAuthor,
  useUpdateAuthor,
} from "@/lib/admin/queries/use-authors";
import { RepositoryError, type Author } from "@/lib/admin/types";

type AuthorFormProps = {
  mode: "create" | "edit";
  initial?: Author;
  onSuccess?: () => void;
};

function isValidHttpUrl(value: string): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function getInitials(name: string): string {
  const cleaned = name.trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function AuthorForm({ mode, initial, onSuccess }: AuthorFormProps) {
  const router = useRouter();
  const create = useCreateAuthor();
  const update = useUpdateAuthor();

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(AuthorSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          slug: initial.slug,
          descriptionHtml: initial.descriptionHtml,
          photoUrl: initial.photoUrl,
        }
      : makeDefaultAuthorValues(),
  });

  const isSubmitting = create.isPending || update.isPending;

  const watchedName = useWatch({ control: form.control, name: "name" });
  const watchedPhotoUrl = useWatch({
    control: form.control,
    name: "photoUrl",
  });
  const previewUrl =
    typeof watchedPhotoUrl === "string" && isValidHttpUrl(watchedPhotoUrl)
      ? watchedPhotoUrl
      : null;
  const initials = getInitials(watchedName || initial?.name || "");

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (mode === "create") {
        const createdAuthor = await create.mutateAsync(values);
        onSuccess?.();
        router.replace(`/admin/auteurs/${createdAuthor.id}`);
      } else if (initial) {
        await update.mutateAsync({ id: initial.id, patch: values });
        onSuccess?.();
      }
    } catch (err) {
      if (err instanceof RepositoryError && err.code === "SLUG_TAKEN") {
        form.setError("slug", {
          type: "manual",
          message: "Ce slug est déjà utilisé.",
        });
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="mx-auto max-w-3xl" noValidate>
        <div className="adm-card">
          <div className="adm-card__body !p-[22px]">
            <AdminField
              name="photoUrl"
              label="Photo (URL)"
              hint="URL absolue (https://). Laisser vide pour utiliser les initiales."
              render={(field) => (
                <div className="flex items-center gap-3">
                  <div className="adm-userchip__av size-16 shrink-0 border border-paper-line">
                    {previewUrl ? (
                      <div
                        className="size-full rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${previewUrl})` }}
                        aria-label={watchedName || "Auteur"}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-[18px] font-semibold text-ink-3">
                        {initials}
                      </div>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="https://…"
                    className="ainput mono"
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      const next = event.target.value;
                      field.onChange(next.length === 0 ? null : next);
                    }}
                  />
                </div>
              )}
            />

            <AdminField
              name="name"
              label="Nom"
              required
              render={(field) => (
                <input
                  {...field}
                  type="text"
                  autoFocus
                  placeholder="Jean Dupont"
                  className="ainput"
                />
              )}
            />

            <AdminField
              name="slug"
              label="Slug"
              required
              render={(field) => (
                <SlugInput
                  value={field.value}
                  onChange={field.onChange}
                  source={watchedName || ""}
                  initiallyManual={mode === "edit"}
                  prefix="maison-calorie.fr/auteurs/"
                  placeholder="jean-dupont"
                />
              )}
            />

            <AdminField
              name="descriptionHtml"
              label="Description"
              render={(field) => (
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Une courte biographie…"
                  minHeight={140}
                />
              )}
            />
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
                ? "Créer l'auteur"
                : "Enregistrer"}
          </button>
        </div>
      </form>
    </Form>
  );
}
