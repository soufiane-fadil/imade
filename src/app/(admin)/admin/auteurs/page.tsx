"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, PenLine, Trash2 } from "lucide-react";

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
import { EmptyState } from "@/components/admin/feedback/empty-state";
import { ConfirmDialog } from "@/components/admin/feedback/confirm-dialog";
import { useAuthors, useRemoveAuthor } from "@/lib/admin/queries/use-authors";
import { useTableFilters } from "@/lib/admin/use-table-filters";
import { RepositoryError, type Author } from "@/lib/admin/types";

type FilterShape = {
  q: string;
};

const FILTER_DEFAULTS: FilterShape = { q: "" };

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

function AdminAuthorsPageInner() {
  const { filters, setFilters, reset } =
    useTableFilters<FilterShape>(FILTER_DEFAULTS);

  const list = useAuthors({ q: filters.q || undefined });
  const remove = useRemoveAuthor();

  const [pendingDelete, setPendingDelete] = React.useState<Author | null>(null);
  const [blocked, setBlocked] = React.useState<{
    author: Author;
    count: number;
  } | null>(null);

  const handleAskDelete = React.useCallback((author: Author) => {
    setPendingDelete(author);
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
        err.code === "AUTHOR_HAS_ARTICLES"
      ) {
        const rawCount = err.details.count;
        const count = typeof rawCount === "number" ? rawCount : 0;
        setPendingDelete(null);
        setBlocked({ author: target, count });
        return;
      }
      setPendingDelete(null);
    }
  }, [pendingDelete, remove]);

  const items = list.data ?? [];
  const hasActiveFilters = filters.q !== FILTER_DEFAULTS.q;
  const isEmptyUnfiltered =
    !list.isLoading && !hasActiveFilters && items.length === 0;
  const isEmptyFiltered =
    !list.isLoading && hasActiveFilters && items.length === 0;

  return (
    <>
      <PageHeader
        title="Auteurs"
        subtitle="Liste des plumes éditoriales. Chaque auteur a sa fiche dédiée."
        actions={
          <Link href="/admin/auteurs/new" className="abtn abtn--primary">
            + Nouvel auteur
          </Link>
        }
      />

      {isEmptyUnfiltered ? (
        <EmptyState
          icon={PenLine}
          title="Aucun auteur"
          description="Créez votre premier auteur pour signer les articles éditoriaux."
          cta={{
            label: "Nouvel auteur",
            href: "/admin/auteurs/new",
          }}
        />
      ) : (
        <>
          <DataTableToolbar
            searchValue={filters.q}
            searchPlaceholder="Rechercher un auteur…"
            onSearchChange={(value) => setFilters({ q: value })}
            hasActiveFilters={hasActiveFilters}
            onReset={reset}
            count={`${items.length} auteur${items.length > 1 ? "s" : ""}`}
          />

          {list.isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="adm-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-14 animate-pulse rounded-full bg-paper-2" />
                    <div className="flex flex-1 flex-col gap-1.5">
                      <div className="h-4 w-32 animate-pulse rounded bg-paper-2" />
                      <div className="h-3 w-20 animate-pulse rounded bg-paper-2" />
                    </div>
                  </div>
                  <div className="mt-4 h-5 w-20 animate-pulse rounded bg-paper-2" />
                </div>
              ))}
            </div>
          ) : isEmptyFiltered ? (
            <div className="adm-card">
              <div className="adm-empty">
                <PenLine className="adm-empty__icn" />
                <div className="font-semibold text-ink-3">Aucun résultat</div>
                <div className="text-[13px]" style={{ marginTop: 4 }}>
                  Aucun auteur ne correspond à votre recherche.
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((author) => {
                const photo = isValidHttpUrl(author.photoUrl)
                  ? author.photoUrl
                  : null;
                const initials = getInitials(author.name);
                return (
                  <div
                    key={author.id}
                    className="adm-card flex flex-col gap-3 p-4"
                  >
                    <div className="flex items-center gap-3">
                      {photo ? (
                        <div
                          className="size-14 flex-shrink-0 rounded-full bg-paper-2 bg-cover bg-center"
                          style={{ backgroundImage: `url(${photo})` }}
                          aria-label={author.name}
                          role="img"
                        />
                      ) : (
                        <div
                          className="flex size-14 flex-shrink-0 items-center justify-center rounded-full bg-paper-3 font-semibold text-ink-mute"
                          aria-hidden="true"
                        >
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/admin/auteurs/${author.id}`}
                          className="block truncate text-[15px] font-semibold text-ink hover:underline"
                        >
                          {author.name}
                        </Link>
                        <span className="block truncate font-mono text-[11px] text-ink-mute">
                          {author.slug}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="tag tag--ghost">
                        {author.articleCount} article
                        {author.articleCount > 1 ? "s" : ""}
                      </span>
                      <div className="flex gap-1.5">
                        <Link
                          href={`/admin/auteurs/${author.id}`}
                          className="abtn abtn--ghost abtn--icon"
                          aria-label={`Éditer ${author.name}`}
                          title="Éditer"
                        >
                          <Pencil className="size-3.5" />
                        </Link>
                        <button
                          type="button"
                          className="abtn abtn--danger abtn--icon"
                          aria-label={`Supprimer ${author.name}`}
                          title="Supprimer"
                          onClick={() => handleAskDelete(author)}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
        title="Supprimer cet auteur ?"
        description={
          pendingDelete ? (
            <>
              L&apos;auteur{" "}
              <strong className="text-foreground">{pendingDelete.name}</strong>{" "}
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
                  L&apos;auteur{" "}
                  <strong className="text-foreground">
                    {blocked.author.name}
                  </strong>{" "}
                  a {blocked.count} article{blocked.count > 1 ? "s" : ""}.
                  Réassignez-les avant suppression.
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
                href={`/admin/articles?authorId=${blocked.author.id}`}
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

export default function AdminAuthorsPage() {
  return (
    <React.Suspense fallback={null}>
      <AdminAuthorsPageInner />
    </React.Suspense>
  );
}
