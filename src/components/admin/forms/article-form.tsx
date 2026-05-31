"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  Eye,
  ExternalLink,
  FileText,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { AdminField } from "@/components/admin/forms/admin-field";
import { ConfirmDialog } from "@/components/admin/feedback/confirm-dialog";
import { SlugInput } from "@/components/admin/forms/slug-input";
import { KeywordsInput } from "@/components/admin/forms/keywords-input";
import {
  StatusSelect,
  ARTICLE_STATUS_LABEL,
} from "@/components/admin/forms/status-select";
import { ReadingTimeInput } from "@/components/admin/forms/reading-time-input";
import { FaqEditor } from "@/components/admin/forms/faq-editor";
import { RelationPicker } from "@/components/admin/forms/relation-picker";
import { MediaPicker } from "@/components/admin/forms/media-picker";
import { RichTextEditor } from "@/components/admin/forms/rich-text-editor";
import { StatusBadge } from "@/components/admin/feedback/status-badge";
import {
  ArticleSchema,
  makeDefaultArticleValues,
  type ArticleFormValues,
} from "@/lib/admin/validators/article";
import {
  useCreateArticle,
  useRemoveArticle,
  useUpdateArticle,
} from "@/lib/admin/queries/use-articles";
import { useAuthors } from "@/lib/admin/queries/use-authors";
import { useCategories } from "@/lib/admin/queries/use-categories";
import {
  RepositoryError,
  type Article,
  type ArticleStatus,
  type Author,
  type Category,
} from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type ArticleFormProps = {
  mode: "create" | "edit";
  initial?: Article;
  onSuccess?: () => void;
};

type TabValue = "contenu" | "seo" | "faq";

function isValidHttpUrl(value: string | null | undefined): value is string {
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

function valuesFromArticle(a: Article): ArticleFormValues {
  return {
    title: a.title,
    slug: a.slug,
    seoExcerpt: a.seoExcerpt,
    metaDescription: a.metaDescription,
    metaKeywords: [...a.metaKeywords],
    contentHtml: a.contentHtml,
    coverMediaId: a.coverMediaId,
    attachedMediaIds: [...a.attachedMediaIds],
    readingMinutes: a.readingMinutes,
    categoryId: a.categoryId,
    authorId: a.authorId,
    faqs: a.faqs.map((f) => ({ ...f })),
    status: a.status,
  };
}

function formatAbsolute(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function ArticleForm({ mode, initial, onSuccess }: ArticleFormProps) {
  const router = useRouter();
  const create = useCreateArticle();
  const update = useUpdateArticle();
  const remove = useRemoveArticle();

  const categories = useCategories();
  const authors = useAuthors();

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: initial
      ? valuesFromArticle(initial)
      : makeDefaultArticleValues(),
  });

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [tab, setTab] = React.useState<TabValue>("contenu");

  const {
    title,
    slug,
    seoExcerpt,
    metaDescription,
    metaKeywords,
    contentHtml,
    faqs,
    readingMinutes,
    categoryId,
    status: currentStatus,
  } = useWatch({
    control: form.control,
    defaultValue: form.getValues(),
  }) as ArticleFormValues;

  const categorySlug =
    categories.data?.find((c) => c.id === categoryId)?.slug ?? "rubrique";
  const articleHref = `/rubriques/${categorySlug}/${slug || "slug"}`;

  const isSubmitting = create.isPending || update.isPending;

  const submit = React.useCallback(
    async (values: ArticleFormValues): Promise<boolean> => {
      try {
        if (mode === "create") {
          const createdArticle = await create.mutateAsync(values);
          onSuccess?.();
          router.replace(`/admin/articles/${createdArticle.id}`);
        } else if (initial) {
          await update.mutateAsync({ id: initial.id, patch: values });
          onSuccess?.();
        }
        return true;
      } catch (err) {
        if (err instanceof RepositoryError && err.code === "SLUG_TAKEN") {
          form.setError("slug", {
            type: "manual",
            message: "Ce slug est déjà utilisé.",
          });
          return false;
        }
        return false;
      }
    },
    [mode, initial, create, update, onSuccess, router, form],
  );

  const onSubmit = form.handleSubmit(submit);

  const saveAsDraft = async () => {
    form.setValue("status", "draft", { shouldDirty: true });
    const values = form.getValues();
    const candidate: ArticleFormValues = { ...values, status: "draft" };
    const parsed = ArticleSchema.safeParse(candidate);
    if (!parsed.success) {
      await form.trigger();
      return;
    }
    await submit(parsed.data);
  };

  const saveAsPublished = async () => {
    form.setValue("status", "published", { shouldDirty: true });
    const values = form.getValues();
    const candidate: ArticleFormValues = { ...values, status: "published" };
    const parsed = ArticleSchema.safeParse(candidate);
    if (!parsed.success) {
      await form.trigger();
      return;
    }
    await submit(parsed.data);
  };

  const onConfirmDelete = async () => {
    if (!initial) return;
    await remove.mutateAsync(initial.id);
    setConfirmDelete(false);
    router.push("/admin/articles");
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} noValidate>
        {/* Action bar */}
        <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link href="/admin/articles" className="abtn abtn--ghost abtn--sm">
              ← Articles
            </Link>
            {mode === "edit" ? <StatusBadge status={currentStatus} /> : null}
            {mode === "edit" && initial ? (
              <span className="font-mono text-[11px] text-ink-mute">
                Mis à jour le {formatAbsolute(initial.updatedAt)}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="abtn abtn--ghost"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="icn" />
              Aperçu
            </button>
            <button
              type="button"
              className="abtn"
              onClick={saveAsDraft}
              disabled={isSubmitting}
            >
              <Save className="icn" />
              {isSubmitting ? "…" : "Enregistrer brouillon"}
            </button>
            <button
              type="button"
              className="abtn abtn--primary"
              onClick={saveAsPublished}
              disabled={isSubmitting}
            >
              <Check className="icn" />
              {currentStatus === "published" ? "Mettre à jour" : "Publier"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[1fr_340px]">
          {/* Main column */}
          <div className="adm-card">
            <div className="adm-card__head !gap-0 !p-0">
              <div className="flex w-full gap-0">
                {(
                  [
                    ["contenu", "Contenu"],
                    ["seo", "SEO & méta"],
                    ["faq", "FAQ"],
                  ] as Array<[TabValue, string]>
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTab(value)}
                    className={cn(
                      "border-b-2 px-4 py-4 text-[13.5px] font-semibold transition",
                      tab === value
                        ? "border-signal text-ink"
                        : "border-transparent text-ink-mute hover:text-ink",
                    )}
                  >
                    {label}
                    {value === "faq" && faqs.length > 0
                      ? ` (${faqs.length})`
                      : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="adm-card__body">
              {tab === "contenu" ? (
                <>
                  <AdminField
                    name="title"
                    label="Titre (H1)"
                    required
                    hint="Titre principal affiché en haut de l'article et dans l'onglet."
                    render={(field) => (
                      <input
                        {...field}
                        type="text"
                        autoFocus={mode === "create"}
                        placeholder="Comment isoler les combles…"
                        className="ainput !text-[18px] !font-semibold"
                      />
                    )}
                  />

                  <AdminField
                    name="slug"
                    label="Slug (URL)"
                    required
                    render={(field) => (
                      <SlugInput
                        value={field.value}
                        onChange={field.onChange}
                        source={title}
                        initiallyManual={mode === "edit"}
                        prefix={`/rubriques/${categorySlug}/`}
                        placeholder="comment-isoler-les-combles"
                      />
                    )}
                  />

                  <AdminField
                    name="seoExcerpt"
                    label="Extrait / chapô"
                    required
                    hint={
                      <span className="flex items-baseline justify-between gap-2">
                        <span>
                          Idéal autour de 140-160 caractères. 200 max.
                        </span>
                        <CharCounter
                          current={seoExcerpt.length}
                          max={200}
                          hintMax={160}
                        />
                      </span>
                    }
                    render={(field) => (
                      <textarea
                        {...field}
                        rows={2}
                        placeholder="Phrase d'accroche affichée sous le titre et dans les listes."
                        className="atext"
                      />
                    )}
                  />

                  <AdminField
                    name="contentHtml"
                    label="Contenu de l'article"
                    required
                    render={(field) => (
                      <RichTextEditor
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Commencez à écrire votre article…"
                        minHeight={300}
                      />
                    )}
                  />
                </>
              ) : null}

              {tab === "seo" ? (
                <>
                  <div className="aform-sec">Référencement (SEO)</div>
                  <AdminField
                    name="metaDescription"
                    label="Meta description"
                    hint={
                      <span className="block text-right">
                        <CharCounter
                          current={metaDescription.length}
                          max={160}
                        />
                      </span>
                    }
                    render={(field) => (
                      <textarea
                        {...field}
                        rows={3}
                        placeholder="Apparaît dans les résultats Google. 150-160 caractères idéalement."
                        className="atext"
                      />
                    )}
                  />

                  <AdminField
                    name="metaKeywords"
                    label="Meta keywords"
                    hint="Entrée ou virgule pour valider. Maximum 15."
                    render={(field) => (
                      <KeywordsInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        max={15}
                      />
                    )}
                  />

                  <div className="aform-sec">Aperçu Google</div>
                  <div className="rounded-lg border border-paper-line bg-paper-2 p-[14px]">
                    <div className="text-[18px] leading-tight text-[#1a0dab]">
                      {title || "Titre de votre article"}
                    </div>
                    <div className="my-[3px] font-mono text-[12.5px] text-[#006621]">
                      maison-calorie.fr › rubriques › {categorySlug} ›{" "}
                      {slug || "slug"}
                    </div>
                    <div className="text-[13px] leading-[1.4] text-ink-3">
                      {metaDescription ||
                        "La meta description apparaîtra ici. Renseignez-la pour optimiser l'affichage dans les résultats Google."}
                    </div>
                  </div>
                </>
              ) : null}

              {tab === "faq" ? (
                <>
                  <div className="mb-[14px] flex items-center justify-between gap-2">
                    <div className="text-[13px] text-ink-mute">
                      Liste de questions/réponses — enregistrée utilisée pour
                      les rich snippets SEO.
                    </div>
                  </div>

                  <AdminField
                    name="faqs"
                    render={(field) => (
                      <FaqEditor
                        value={field.value ?? []}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </>
              ) : null}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="grid grid-cols-1 gap-[16px]">
            {/* Organisation */}
            <div className="adm-card">
              <div className="adm-card__head">
                <div className="adm-card__title">Organisation</div>
              </div>
              <div className="adm-card__body">
                <AdminField
                  name="status"
                  label="Statut"
                  render={(field) => (
                    <StatusSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <AdminField
                  name="categoryId"
                  label="Catégorie"
                  required
                  render={(field) => (
                    <RelationPicker<Category>
                      value={field.value || null}
                      options={categories.data ?? []}
                      isLoading={categories.isLoading}
                      getLabel={(c) => c.name}
                      getSubLabel={(c) => c.slug}
                      onChange={(id) => field.onChange(id ?? "")}
                      placeholder="Choisir une catégorie"
                    />
                  )}
                />

                <AdminField
                  name="authorId"
                  label="Auteur"
                  required
                  render={(field) => (
                    <RelationPicker<Author>
                      value={field.value || null}
                      options={authors.data ?? []}
                      isLoading={authors.isLoading}
                      getLabel={(a) => a.name}
                      getSubLabel={(a) => a.slug}
                      onChange={(id) => field.onChange(id ?? "")}
                      placeholder="Choisir un auteur"
                      searchPlaceholder="Rechercher un auteur…"
                      renderTrigger={(selected) => (
                        <AuthorTrigger author={selected} />
                      )}
                      renderItem={(author) => <AuthorOption author={author} />}
                    />
                  )}
                />

                <AdminField
                  name="readingMinutes"
                  label="Temps de lecture"
                  className="!mb-0"
                  hint="Estimation manuelle, en minutes."
                  render={(field) => (
                    <ReadingTimeInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Image principale */}
            <div className="adm-card">
              <div className="adm-card__head">
                <div className="adm-card__title">Image principale</div>
              </div>
              <div className="adm-card__body">
                <AdminField
                  name="coverMediaId"
                  render={(field) => (
                    <MediaPicker
                      mode="single"
                      kind="image"
                      value={field.value}
                      onChange={field.onChange}
                      triggerLabel="Choisir une couverture"
                    />
                  )}
                />
              </div>
            </div>

            {/* Médias joints */}
            <div className="adm-card">
              <div className="adm-card__head">
                <div className="adm-card__title">Médias joints</div>
              </div>
              <div className="adm-card__body">
                <AdminField
                  name="attachedMediaIds"
                  render={(field) => (
                    <MediaPicker
                      mode="multi"
                      value={field.value ?? []}
                      onChange={field.onChange}
                      triggerLabel="Ajouter des médias"
                    />
                  )}
                />
              </div>
            </div>

            {mode === "edit" && initial ? (
              <>
                {initial.status === "published" ? (
                  <div className="adm-card">
                    <div className="adm-card__body !p-3">
                      <Link
                        href={articleHref}
                        target="_blank"
                        rel="noreferrer"
                        className="abtn abtn--ghost w-full justify-center"
                      >
                        <ExternalLink className="icn" />
                        Voir sur le site
                      </Link>
                    </div>
                  </div>
                ) : null}
                <button
                  type="button"
                  className="abtn abtn--danger w-full justify-center"
                  onClick={() => setConfirmDelete(true)}
                  disabled={remove.isPending}
                >
                  <Trash2 className="icn" />
                  Supprimer l&apos;article
                </button>
              </>
            ) : null}
          </aside>
        </div>

        {/* Preview drawer */}
        <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
          <SheetContent
            side="right"
            className="!w-full !max-w-3xl overflow-y-auto"
          >
            <SheetHeader>
              <SheetTitle>{title || "Aperçu de l'article"}</SheetTitle>
              <SheetDescription>
                Rendu approximatif. Aucune sauvegarde n&apos;a lieu.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 p-4 pt-0">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-mute">
                <StatusBadge status={currentStatus} />
                <span>{ARTICLE_STATUS_LABEL[currentStatus]}</span>
                <span>·</span>
                <span>{readingMinutes} min de lecture</span>
                {metaKeywords.length > 0 ? (
                  <>
                    <span>·</span>
                    <span>{metaKeywords.join(", ")}</span>
                  </>
                ) : null}
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
                {title || "Sans titre"}
              </h1>
              {seoExcerpt ? (
                <p className="text-sm italic text-ink-mute">{seoExcerpt}</p>
              ) : null}
              {metaDescription ? (
                <p className="text-xs text-ink-mute">
                  <strong>SEO :</strong> {metaDescription}
                </p>
              ) : null}
              <hr className="border-paper-line" />
              {contentHtml ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              ) : (
                <p className="flex items-center gap-2 text-sm text-ink-mute">
                  <FileText className="size-4" />
                  Le contenu apparaîtra ici.
                </p>
              )}
              <div className="flex justify-end">
                <SheetClose
                  render={
                    <button type="button" className="abtn">
                      Fermer
                    </button>
                  }
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {initial ? (
          <ConfirmDialog
            open={confirmDelete}
            onOpenChange={setConfirmDelete}
            title="Supprimer cet article ?"
            description={
              <>
                L&apos;article{" "}
                <strong className="text-foreground">{initial.title}</strong>{" "}
                sera définitivement supprimé. Cette action est irréversible.
              </>
            }
            confirmLabel="Supprimer"
            confirmVariant="destructive"
            onConfirm={onConfirmDelete}
          />
        ) : null}
      </form>
    </Form>
  );
}

type CharCounterProps = {
  current: number;
  max: number;
  hintMax?: number;
};

function CharCounter({ current, max, hintMax }: CharCounterProps) {
  const tooLong = current > max;
  const warn = hintMax !== undefined && current > hintMax && !tooLong;
  return (
    <span
      className={cn(
        "font-mono text-[11px] tabular-nums",
        tooLong
          ? "text-signal"
          : warn
            ? "text-[var(--color-signal-deep)]"
            : "text-ink-mute",
      )}
    >
      {current} / {max}
    </span>
  );
}

function AuthorTrigger({ author }: { author: Author | null }) {
  if (!author) {
    return <span className="text-ink-mute">Choisir un auteur</span>;
  }
  return (
    <span className="flex min-w-0 items-center gap-2">
      <AuthorAvatar author={author} className="size-5 text-[10px]" />
      <span className="truncate">{author.name}</span>
    </span>
  );
}

function AuthorOption({ author }: { author: Author }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <AuthorAvatar author={author} className="size-6 text-[10px]" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm">{author.name}</span>
        <span className="truncate text-[11px] text-ink-mute">
          {author.slug}
        </span>
      </span>
    </span>
  );
}

function AuthorAvatar({
  author,
  className,
}: {
  author: Author;
  className?: string;
}) {
  if (isValidHttpUrl(author.photoUrl)) {
    return (
      <span
        className={cn(
          "inline-block shrink-0 rounded-full bg-cover bg-center",
          className,
        )}
        style={{ backgroundImage: `url(${author.photoUrl})` }}
        aria-label={author.name}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-paper-3 font-semibold text-ink-3",
        className,
      )}
      aria-label={author.name}
    >
      {getInitials(author.name)}
    </span>
  );
}
