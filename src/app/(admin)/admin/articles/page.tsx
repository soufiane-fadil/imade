"use client";

import * as React from "react";
import Link from "next/link";
import { formatDate } from "@/lib/dates";
import {
  Archive,
  Eye,
  FolderInput,
  Newspaper,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";
import type { RowSelectionState } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PageHeader } from "@/components/admin/shell/page-header";
import { DataTableToolbar } from "@/components/admin/data/data-table-toolbar";
import { DataTablePagination } from "@/components/admin/data/data-table-pagination";
import { BulkActionsBar } from "@/components/admin/data/bulk-actions-bar";
import { RowActions } from "@/components/admin/data/row-actions";
import { StatusBadge } from "@/components/admin/feedback/status-badge";
import { EmptyState } from "@/components/admin/feedback/empty-state";
import { ConfirmDialog } from "@/components/admin/feedback/confirm-dialog";
import { ARTICLE_STATUS_LABEL } from "@/components/admin/forms/status-select";
import {
  useArticles,
  useBulkSetStatus,
  useRemoveArticle,
  useUpdateArticle,
} from "@/lib/admin/queries/use-articles";
import { useAuthors } from "@/lib/admin/queries/use-authors";
import { useCategories } from "@/lib/admin/queries/use-categories";
import { useTableFilters } from "@/lib/admin/use-table-filters";
import type {
  Article,
  ArticleStatus,
  Author,
  Category,
} from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type StatusFilter = ArticleStatus | "all";

type FilterShape = {
  q: string;
  status: StatusFilter;
  categoryId: string;
  authorId: string;
  page: number;
};

const FILTER_DEFAULTS: FilterShape = {
  q: "",
  status: "all",
  categoryId: "",
  authorId: "",
  page: 1,
};

const PAGE_SIZE = 20;

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "published", label: "Publiés" },
  { value: "draft", label: "Brouillons" },
  { value: "archived", label: "Archivés" },
];

function ArticlesPageFallback() {
  return (
    <>
      <PageHeader
        title="Articles"
        subtitle="Filtrez par statut, catégorie ou recherche, puis éditez en un clic."
        actions={
          <Link href="/admin/articles/new" className="abtn abtn--primary">
            + Nouvel article
          </Link>
        }
      />
      <div className="adm-card overflow-hidden">
        <table className="adm-table">
          <tbody>
            {Array.from({ length: 4 }).map((_, idx) => (
              <tr key={idx}>
                <td colSpan={8}>
                  <div className="h-4 w-full max-w-[260px] animate-pulse rounded bg-paper-2" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function AdminArticlesPage() {
  return (
    <React.Suspense fallback={<ArticlesPageFallback />}>
      <ArticlesPageInner />
    </React.Suspense>
  );
}

function ArticlesPageInner() {
  const { filters, setFilters, reset } =
    useTableFilters<FilterShape>(FILTER_DEFAULTS);

  const categories = useCategories();
  const authors = useAuthors();

  const list = useArticles({
    q: filters.q || undefined,
    status: filters.status,
    categoryId: filters.categoryId || undefined,
    authorId: filters.authorId || undefined,
    sort: "newest",
    page: filters.page,
    pageSize: PAGE_SIZE,
  });

  const removeMutation = useRemoveArticle();
  const updateMutation = useUpdateArticle();
  const bulkSetStatus = useBulkSetStatus();

  const [selection, setSelection] = React.useState<RowSelectionState>({});
  const [pendingDelete, setPendingDelete] = React.useState<Article | null>(
    null,
  );
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
  const [previewArticle, setPreviewArticle] = React.useState<Article | null>(
    null,
  );
  const [reassignOpen, setReassignOpen] = React.useState(false);
  const [reassignCategoryId, setReassignCategoryId] =
    React.useState<string>("");

  const items = React.useMemo(() => list.data?.items ?? [], [list.data]);
  const total = list.data?.total ?? 0;

  const categoryMap = React.useMemo(() => {
    const map = new Map<string, Category>();
    for (const cat of categories.data ?? []) map.set(cat.id, cat);
    return map;
  }, [categories.data]);

  const authorMap = React.useMemo(() => {
    const map = new Map<string, Author>();
    for (const author of authors.data ?? []) map.set(author.id, author);
    return map;
  }, [authors.data]);

  const selectedIds = React.useMemo(
    () =>
      Object.entries(selection)
        .filter(([, value]) => value)
        .map(([id]) => id),
    [selection],
  );

  const setFiltersAndClear = React.useCallback(
    (patch: Partial<FilterShape>) => {
      setSelection({});
      setFilters(patch);
    },
    [setFilters],
  );

  const resetAndClear = React.useCallback(() => {
    setSelection({});
    reset();
  }, [reset]);

  const handleAskDelete = React.useCallback((article: Article) => {
    setPendingDelete(article);
  }, []);

  const handleConfirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    try {
      await removeMutation.mutateAsync(pendingDelete.id);
    } finally {
      setPendingDelete(null);
    }
  }, [pendingDelete, removeMutation]);

  const handleQuickStatus = React.useCallback(
    async (article: Article, status: ArticleStatus) => {
      if (article.status === status) return;
      try {
        await updateMutation.mutateAsync({
          id: article.id,
          patch: { status },
        });
      } catch {
        // toast handled by useAdminMutation
      }
    },
    [updateMutation],
  );

  const runBulkStatus = async (status: ArticleStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await bulkSetStatus.mutateAsync({ ids: selectedIds, status });
      setSelection({});
    } catch {
      // toast handled
    }
  };

  const runBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    await Promise.all(selectedIds.map((id) => removeMutation.mutateAsync(id)));
    setSelection({});
    setBulkDeleteOpen(false);
  };

  const runBulkReassign = async () => {
    if (selectedIds.length === 0 || !reassignCategoryId) return;
    await Promise.all(
      selectedIds.map((id) =>
        updateMutation.mutateAsync({
          id,
          patch: { categoryId: reassignCategoryId },
        }),
      ),
    );
    setSelection({});
    setReassignCategoryId("");
    setReassignOpen(false);
  };

  const allRowsSelected =
    items.length > 0 && items.every((article) => selection[article.id]);
  const someRowsSelected = items.some((article) => selection[article.id]);

  const toggleAllRows = (checked: boolean) => {
    if (!checked) {
      setSelection({});
      return;
    }
    const next: RowSelectionState = { ...selection };
    for (const a of items) next[a.id] = true;
    setSelection(next);
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelection((prev) => {
      const next = { ...prev };
      if (checked) next[id] = true;
      else delete next[id];
      return next;
    });
  };

  const hasActiveFilters =
    filters.q !== FILTER_DEFAULTS.q ||
    filters.status !== FILTER_DEFAULTS.status ||
    filters.categoryId !== FILTER_DEFAULTS.categoryId ||
    filters.authorId !== FILTER_DEFAULTS.authorId;

  const isEmptyUnfiltered = !list.isLoading && !hasActiveFilters && total === 0;

  const subtitle = `${total} article${total > 1 ? "s" : ""} au total. Filtrez par statut, catégorie ou recherche, puis éditez en un clic.`;

  return (
    <>
      <PageHeader
        title="Articles"
        subtitle={subtitle}
        actions={
          <Link href="/admin/articles/new" className="abtn abtn--primary">
            + Nouvel article
          </Link>
        }
      />

      {isEmptyUnfiltered ? (
        <EmptyState
          icon={Newspaper}
          title="Aucun article"
          description="Publiez votre premier article pour démarrer la ligne éditoriale."
          cta={{ label: "Nouvel article", href: "/admin/articles/new" }}
        />
      ) : (
        <>
          <DataTableToolbar
            searchValue={filters.q}
            searchPlaceholder="Rechercher un article…"
            onSearchChange={(value) =>
              setFiltersAndClear({ q: value, page: 1 })
            }
            hasActiveFilters={hasActiveFilters}
            onReset={resetAndClear}
            count={`${total} résultat${total > 1 ? "s" : ""}`}
          >
            <div className="adm-seg">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  className={filters.status === tab.value ? "is-active" : ""}
                  onClick={() =>
                    setFiltersAndClear({ status: tab.value, page: 1 })
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <select
              className="adm-select"
              value={filters.categoryId || "__all__"}
              onChange={(event) => {
                const value = event.target.value;
                setFiltersAndClear({
                  categoryId: value === "__all__" ? "" : value,
                  page: 1,
                });
              }}
              aria-label="Catégorie"
            >
              <option value="__all__">Toutes les catégories</option>
              {(categories.data ?? []).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              className="adm-select"
              value={filters.authorId || "__all__"}
              onChange={(event) => {
                const value = event.target.value;
                setFiltersAndClear({
                  authorId: value === "__all__" ? "" : value,
                  page: 1,
                });
              }}
              aria-label="Auteur"
            >
              <option value="__all__">Tous les auteurs</option>
              {(authors.data ?? []).map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </DataTableToolbar>

          <BulkActionsBar
            selectedCount={selectedIds.length}
            onClear={() => setSelection({})}
            itemLabel={{ singular: "article", plural: "articles" }}
            actions={[
              {
                label: "Publier",
                icon: Send,
                onClick: () => {
                  void runBulkStatus("published");
                },
                disabled: bulkSetStatus.isPending,
              },
              {
                label: "Dépublier",
                icon: Pencil,
                onClick: () => {
                  void runBulkStatus("draft");
                },
                disabled: bulkSetStatus.isPending,
              },
              {
                label: "Archiver",
                icon: Archive,
                onClick: () => {
                  void runBulkStatus("archived");
                },
                disabled: bulkSetStatus.isPending,
              },
              {
                label: "Réassigner",
                icon: FolderInput,
                onClick: () => setReassignOpen(true),
                disabled: updateMutation.isPending,
              },
              {
                label: "Supprimer",
                icon: Trash2,
                variant: "destructive",
                onClick: () => setBulkDeleteOpen(true),
                disabled: removeMutation.isPending,
              },
            ]}
          />

          <div className="adm-card overflow-hidden">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <CheckBox
                      checked={allRowsSelected}
                      indeterminate={!allRowsSelected && someRowsSelected}
                      onChange={toggleAllRows}
                      ariaLabel="Tout sélectionner"
                    />
                  </th>
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>Auteur</th>
                  <th>Statut</th>
                  <th style={{ textAlign: "right" }}>Vues</th>
                  <th>Date</th>
                  <th style={{ width: 110 }}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.isLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`}>
                      {Array.from({ length: 8 }).map((__, cidx) => (
                        <td key={cidx}>
                          <div className="h-3.5 w-full max-w-[200px] animate-pulse rounded bg-paper-2" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 0 }}>
                      <div className="adm-empty">
                        <Newspaper className="adm-empty__icn" />
                        <div className="font-semibold text-ink-3">
                          Aucun article ne correspond
                        </div>
                        <div className="text-[13px]" style={{ marginTop: 4 }}>
                          Ajustez les filtres ou la recherche.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((article) => {
                    const isSelected = !!selection[article.id];
                    const category = categoryMap.get(article.categoryId);
                    const author = authorMap.get(article.authorId);
                    const nextStatus: ArticleStatus =
                      article.status === "published" ? "draft" : "published";
                    return (
                      <tr
                        key={article.id}
                        className={cn(isSelected && "is-selected")}
                      >
                        <td>
                          <CheckBox
                            checked={isSelected}
                            onChange={(checked) =>
                              toggleRow(article.id, checked)
                            }
                            ariaLabel={`Sélectionner ${article.title}`}
                          />
                        </td>
                        <td style={{ maxWidth: 380 }}>
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="block hover:text-[var(--color-signal)]"
                          >
                            <div className="adm-table__title line-clamp-1">
                              {article.title}
                            </div>
                            <div className="adm-table__sub">
                              /{article.slug} · {article.readingMinutes} min
                              {article.attachedMediaIds.length > 0
                                ? ` · ${article.attachedMediaIds.length} médias`
                                : ""}
                            </div>
                          </Link>
                        </td>
                        <td className="text-[12.5px]">
                          {category ? category.name : "—"}
                        </td>
                        <td className="text-[12.5px] text-ink-3">
                          {author ? author.name : "—"}
                        </td>
                        <td>
                          <StatusBadge status={article.status} />
                        </td>
                        <td
                          style={{ textAlign: "right" }}
                          className="font-mono text-[12.5px]"
                        >
                          —
                        </td>
                        <td className="font-mono text-[11.5px] text-ink-mute whitespace-nowrap">
                          {formatDate(article.publishedAt ?? article.updatedAt)}
                        </td>
                        <td>
                          <RowActions
                            ariaLabel={`Actions pour ${article.title}`}
                            inlineLimit={2}
                            items={[
                              {
                                label: "Éditer",
                                icon: Pencil,
                                href: `/admin/articles/${article.id}`,
                              },
                              {
                                label: "Supprimer",
                                icon: Trash2,
                                destructive: true,
                                onClick: () => handleAskDelete(article),
                              },
                              {
                                label: "Aperçu",
                                icon: Eye,
                                onClick: () => setPreviewArticle(article),
                              },
                              {
                                label:
                                  nextStatus === "published"
                                    ? "Publier"
                                    : "Repasser en brouillon",
                                icon:
                                  nextStatus === "published" ? Send : Pencil,
                                onClick: () => {
                                  void handleQuickStatus(article, nextStatus);
                                },
                                disabled: updateMutation.isPending,
                              },
                              {
                                label: "Archiver",
                                icon: Archive,
                                onClick: () => {
                                  void handleQuickStatus(article, "archived");
                                },
                                disabled:
                                  article.status === "archived" ||
                                  updateMutation.isPending,
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <DataTablePagination
            page={filters.page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={(page) => setFilters({ page })}
          />
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
        title="Supprimer cet article ?"
        description={
          pendingDelete ? (
            <>
              L&apos;article{" "}
              <strong className="text-foreground">{pendingDelete.title}</strong>{" "}
              sera définitivement supprimé. Cette action est irréversible.
            </>
          ) : (
            "Cette action est irréversible."
          )
        }
        confirmLabel="Supprimer"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Supprimer ${selectedIds.length} article${selectedIds.length > 1 ? "s" : ""} ?`}
        description="Les articles sélectionnés seront définitivement supprimés."
        confirmLabel="Supprimer"
        confirmVariant="destructive"
        onConfirm={runBulkDelete}
      />

      <Dialog
        open={reassignOpen}
        onOpenChange={(next) => {
          setReassignOpen(next);
          if (!next) setReassignCategoryId("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réassigner la catégorie</DialogTitle>
            <DialogDescription>
              Choisissez la catégorie cible pour les {selectedIds.length}{" "}
              article{selectedIds.length > 1 ? "s" : ""} sélectionné
              {selectedIds.length > 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label className="text-xs">Catégorie</Label>
            <Select
              value={reassignCategoryId}
              onValueChange={(value) => {
                if (typeof value !== "string") return;
                setReassignCategoryId(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une catégorie…" />
              </SelectTrigger>
              <SelectContent>
                {(categories.data ?? []).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReassignOpen(false)}
              disabled={updateMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              onClick={runBulkReassign}
              disabled={!reassignCategoryId || updateMutation.isPending}
            >
              Réassigner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ArticlePreviewSheet
        article={previewArticle}
        category={
          previewArticle
            ? (categoryMap.get(previewArticle.categoryId) ?? null)
            : null
        }
        author={
          previewArticle
            ? (authorMap.get(previewArticle.authorId) ?? null)
            : null
        }
        onOpenChange={(open) => {
          if (!open) setPreviewArticle(null);
        }}
      />
    </>
  );
}

type CheckBoxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
  indeterminate?: boolean;
};

/** Native-styled checkbox that follows the `.adm-check` design language. */
function CheckBox({
  checked,
  onChange,
  ariaLabel,
  indeterminate = false,
}: CheckBoxProps) {
  const isOn = checked || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
      className={cn("adm-check", isOn && "is-on")}
    />
  );
}

type ArticlePreviewSheetProps = {
  article: Article | null;
  category: Category | null;
  author: Author | null;
  onOpenChange: (open: boolean) => void;
};

function ArticlePreviewSheet({
  article,
  category,
  author,
  onOpenChange,
}: ArticlePreviewSheetProps) {
  return (
    <Sheet open={article !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full !max-w-3xl overflow-y-auto">
        {article ? (
          <>
            <SheetHeader>
              <SheetTitle>{article.title}</SheetTitle>
              <SheetDescription>
                Aperçu du contenu publié — réservé à la prévisualisation.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 p-4 pt-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <StatusBadge status={article.status} />
                {category ? (
                  <Badge variant="secondary">{category.name}</Badge>
                ) : null}
                {author ? <span>par {author.name}</span> : null}
                <Separator orientation="vertical" className="h-4" />
                <span>
                  {ARTICLE_STATUS_LABEL[article.status]} ·{" "}
                  {article.readingMinutes} min
                </span>
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {article.title}
              </h1>
              {article.seoExcerpt ? (
                <p className="text-sm italic text-muted-foreground">
                  {article.seoExcerpt}
                </p>
              ) : null}
              <Separator />
              {article.contentHtml ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">Contenu vide.</p>
              )}
              <div className={cn("flex justify-end gap-2")}>
                <SheetClose
                  render={
                    <Button type="button" variant="outline">
                      Fermer
                    </Button>
                  }
                />
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
