"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { AdminField } from "@/components/admin/forms/admin-field";
import { SlugInput } from "@/components/admin/forms/slug-input";
import { RichTextEditor } from "@/components/admin/forms/rich-text-editor";
import {
  CategorySchema,
  makeDefaultCategoryValues,
  type CategoryFormValues,
} from "@/lib/admin/validators/category";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/lib/admin/queries/use-categories";
import { RepositoryError, type Category } from "@/lib/admin/types";

type CategoryFormProps = {
  mode: "create" | "edit";
  initial?: Category;
  onSuccess?: () => void;
};

export function CategoryForm({ mode, initial, onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const create = useCreateCategory();
  const update = useUpdateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initial
      ? {
          name: initial.name,
          slug: initial.slug,
          descriptionHtml: initial.descriptionHtml,
        }
      : makeDefaultCategoryValues(),
  });

  const isSubmitting = create.isPending || update.isPending;
  const watchedName = form.watch("name");

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (mode === "create") {
        const createdCategory = await create.mutateAsync(values);
        onSuccess?.();
        router.replace(`/admin/categories/${createdCategory.id}`);
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
      <form onSubmit={onSubmit} className="mx-auto max-w-2xl" noValidate>
        <div className="adm-card">
          <div className="adm-card__body !p-[22px]">
            <AdminField
              name="name"
              label="Nom"
              required
              render={(field) => (
                <input
                  {...field}
                  type="text"
                  autoFocus
                  placeholder="Isolation, Chauffage, Aides…"
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
                  prefix="maison-calorie.fr/rubriques/"
                  placeholder="isolation-thermique"
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
                  placeholder="Présentez brièvement cette rubrique…"
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
                ? "Créer la catégorie"
                : "Enregistrer"}
          </button>
        </div>
      </form>
    </Form>
  );
}
