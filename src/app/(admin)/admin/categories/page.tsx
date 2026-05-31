"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Tags, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/admin/shell/page-header";
import { DataTableToolbar } from "@/components/admin/data/data-table-toolbar";
import { RowActions } from "@/components/admin/data/row-actions";
import { EmptyState } from "@/components/admin/feedback/empty-state";
import { ConfirmDialog } from "@/components/admin/feedback/confirm-dialog";
import {
  useCategories,
  useRemoveCategory,
} from "@/lib/admin/queries/use-categories";
import { useTableFilters } from "@/lib/admin/use-table-filters";
import { RepositoryError, type Category } from "@/lib/admin/types";

type SortValue = "count-desc" | "name-asc" | "newest";

type FilterShape = {
  q: string;
  sort: SortValue;
};

const FILTER_DEFAULTS: FilterShape = { q: "", sort: "count-desc" };

const COLOR_PALETTE = [
  "#E5481B",
  "#1B4DC4",
  "#2F6B3A",
  "#C58A1E",
  "#0E2F88",
  "#B83410",
  "#4A4538",
];

/** Stable accent colour per category, picked from `COLOR_PALETTE`. */
function colorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return COLOR_PALETTE[hash % COLOR_PALETTE.length] ?? COLOR_PALETTE[0]!;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

function isSortValue(value: string): value is SortValue {
  return value === "count-desc" || value === "name-asc" || value === "newest";
}

function sortCategories(items: Category[], sort: SortValue): Category[] {
  const copy = [...items];
  switch (sort) {
    case "name-asc":
      copy.sort((a, b) => a.name.localeCompare(b.name, "fr"));
      break;
    case "newest":
      copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "count-desc":
    default:
      copy.sort((a, b) => b.articleCount - a.articleCount);
  }
  return copy;
}

export default function AdminCategoriesPage() {
  return (
    <React.Suspense fallback={<CategoriesPageFallback />}>
      <CategoriesPageContent />
    </React.Suspense>
  );
}

function CategoriesPageFallback() {
  return (
    <>
      <PageHeader
        title="Catégories"
        subtitle="Organisez les rubriques du site. Chaque catégorie possède un nom, un slug d’URL et une description en HTML."
        actions={
          <Link href="/admin/categories/new" className="abtn abtn--primary">
            + Nouvelle catégorie
          </Link>
        }
      />
      <div className="adm-card">
        <table className="adm-table">
          <tbody>
            {Array.from({ length: 4 }).map((_, idx) => (
              <tr key={idx}>
                <td colSpan={6}>
                  <div className="h-4 w-full max-w-[200px] animate-pulse rounded bg-paper-2" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CategoriesPageContent() {
  const { filters, setFilters, reset } =
    useTableFilters<FilterShape>(FILTER_DEFAULTS);

  const list = useCategories({ q: filters.q || undefined });
  const remove = useRemoveCategory();

  const [pendingDelete, setPendingDelete] = React.useState<Category | null>(
    null,
  );
  const [blocked, setBlocked] = React.useState<{
    category: Category;
    count: number;
  } | null>(null);

  const handleAskDelete = React.useCallback((category: Category) => {
    setPendingDelete(category);
  }, []);

  const handleConfirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    try {
      await remove.mutateAsync(target.id);
      setPendingDelete(null);
    } catch (err) {
      if (
        err instanceof RepositoryError &&
        err.code === "CATEGORY_HAS_ARTICLES"
      ) {
        const rawCount = err.details.count;
        const count = typeof rawCount === "number" ? rawCount : 0;
        setPendingDelete(null);
        setBlocked({ category: target, count });
        return;
      }
      setPendingDelete(null);
    }
  }, [pendingDelete, remove]);

  const items = React.useMemo(
    () => sortCategories(list.data ?? [], filters.sort),
    [list.data, filters.sort],
  );

  const hasActiveFilters =
    filters.q !== FILTER_DEFAULTS.q || filters.sort !== FILTER_DEFAULTS.sort;
  const isEmptyUnfiltered =
    !list.isLoading && !hasActiveFilters && items.length === 0;

  return (
    <>
      <PageHeader
        title="Catégories"
        subtitle="Organisez les rubriques du site. Chaque catégorie possède un nom, un slug d’URL et une description en HTML."
        actions={
          <Link href="/admin/categories/new" className="abtn abtn--primary">
            + Nouvelle catégorie
          </Link>
        }
      />

      {isEmptyUnfiltered ? (
        <EmptyState
          icon={Tags}
          title="Aucune catégorie"
          description="Créez votre première catégorie pour commencer à organiser vos articles."
          cta={{
            label: "Nouvelle catégorie",
            href: "/admin/categories/new",
          }}
        />
      ) : (
        <>
          <DataTableToolbar
            searchValue={filters.q}
            searchPlaceholder="Rechercher une catégorie…"
            onSearchChange={(value) => setFilters({ q: value })}
            hasActiveFilters={hasActiveFilters}
            onReset={reset}
            count={`${items.length} catégorie${items.length > 1 ? "s" : ""}`}
          >
            <select
              className="adm-select"
              value={filters.sort}
              onChange={(event) => {
                const next = event.target.value;
                if (isSortValue(next)) setFilters({ sort: next });
              }}
              aria-label="Trier les catégories"
            >
              <option value="count-desc">Trier : Nb d’articles ↓</option>
              <option value="name-asc">Nom A→Z</option>
              <option value="newest">Plus récent</option>
            </select>
          </DataTableToolbar>

          <div className="adm-card overflow-hidden">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Catégorie</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Articles</th>
                  <th style={{ width: 90 }}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`}>
                      {Array.from({ length: 6 }).map((__, cidx) => (
                        <td key={cidx}>
                          <div className="h-3.5 w-full max-w-[160px] animate-pulse rounded bg-paper-2" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <div className="adm-empty">
                        <Tags className="adm-empty__icn" />
                        <div className="font-semibold text-ink-3">
                          Aucun résultat
                        </div>
                        <div className="text-[13px]" style={{ marginTop: 4 }}>
                          Ajustez la recherche ou le tri.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <span
                          className="adm-dot"
                          style={{
                            background: colorFor(category.id),
                            width: 12,
                            height: 12,
                          }}
                        />
                      </td>
                      <td>
                        <Link
                          href={`/admin/categories/${category.id}`}
                          className="adm-table__title hover:underline"
                        >
                          {category.name}
                        </Link>
                      </td>
                      <td>
                        <code className="font-mono text-[12px] text-plot">
                          /{category.slug}
                        </code>
                      </td>
                      <td
                        className="text-ink-mute text-[12.5px]"
                        style={{ maxWidth: 340 }}
                      >
                        <span className="line-clamp-2">
                          {stripHtml(category.descriptionHtml) || "—"}
                        </span>
                      </td>
                      <td
                        style={{ textAlign: "right" }}
                        className="font-mono font-semibold"
                      >
                        {category.articleCount}
                      </td>
                      <td onClick={(event) => event.stopPropagation()}>
                        <RowActions
                          ariaLabel={`Actions pour ${category.name}`}
                          items={[
                            {
                              label: "Éditer",
                              icon: Pencil,
                              href: `/admin/categories/${category.id}`,
                            },
                            {
                              label: "Supprimer",
                              icon: Trash2,
                              destructive: true,
                              onClick: () => handleAskDelete(category),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
        title="Supprimer cette catégorie ?"
        description={
          pendingDelete ? (
            <>
              La catégorie{" "}
              <strong className="text-foreground">{pendingDelete.name}</strong>{" "}
              sera définitivement supprimée. Cette action est irréversible.
            </>
          ) : (
            "Cette action est irréversible."
          )
        }
        confirmLabel="Supprimer"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />

      <Dialog
        open={blocked !== null}
        onOpenChange={(next) => {
          if (!next) setBlocked(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suppression impossible</DialogTitle>
            <DialogDescription>
              {blocked ? (
                <>
                  La catégorie{" "}
                  <strong className="text-foreground">
                    {blocked.category.name}
                  </strong>{" "}
                  contient {blocked.count} article{blocked.count > 1 ? "s" : ""}
                  . Réassignez-les à une autre catégorie avant suppression.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              className="abtn abtn--ghost"
              onClick={() => setBlocked(null)}
            >
              Fermer
            </button>
            {blocked ? (
              <Link
                href={`/admin/articles?categoryId=${blocked.category.id}`}
                className="abtn abtn--primary"
                onClick={() => setBlocked(null)}
              >
                Voir ces articles
              </Link>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
