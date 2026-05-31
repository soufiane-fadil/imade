"use client";

import * as React from "react";
import { Image as ImageIcon, Plus, Search, UploadCloud } from "lucide-react";

import { PageHeader } from "@/components/admin/shell/page-header";
import { EmptyState } from "@/components/admin/feedback/empty-state";
import { AddMediaDialog } from "@/components/admin/media/add-media-dialog";
import { MediaCard } from "@/components/admin/media/media-card";
import { MediaDetailSheet } from "@/components/admin/media/media-detail-sheet";
import { useMedias } from "@/lib/admin/queries/use-medias";
import { useTableFilters } from "@/lib/admin/use-table-filters";
import { cn } from "@/lib/utils";
import type { MediaFilter } from "@/lib/admin/queries/use-medias";

type KindFilter = "all" | "image" | "pdf";
type SortFilter = "newest" | "filename" | "size";

type FilterShape = {
  q: string;
  kind: KindFilter;
  sort: SortFilter;
};

const DEFAULT_FILTERS: FilterShape = {
  q: "",
  kind: "all",
  sort: "newest",
};

function isKindFilter(value: string | undefined): value is KindFilter {
  return value === "all" || value === "image" || value === "pdf";
}

function isSortFilter(value: string | undefined): value is SortFilter {
  return value === "newest" || value === "filename" || value === "size";
}

export default function AdminMediasPage() {
  return (
    <React.Suspense fallback={<MediasPageFallback />}>
      <AdminMediasPageInner />
    </React.Suspense>
  );
}

function MediasPageFallback() {
  return (
    <>
      <PageHeader
        title="Médiathèque"
        subtitle="Bibliothèque images et documents PDF"
      />
      <MediasGridSkeleton />
    </>
  );
}

function AdminMediasPageInner() {
  const { filters, setFilters } = useTableFilters<FilterShape>(DEFAULT_FILTERS);

  const activeKind: KindFilter = isKindFilter(filters.kind)
    ? filters.kind
    : "all";
  const activeSort: SortFilter = isSortFilter(filters.sort)
    ? filters.sort
    : "newest";

  const queryFilter: MediaFilter = {
    q: filters.q || undefined,
    kind: activeKind,
    sort: activeSort,
  };

  const list = useMedias(queryFilter);

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const items = list.data ?? [];

  const hasActiveFilters =
    filters.q !== DEFAULT_FILTERS.q ||
    activeKind !== DEFAULT_FILTERS.kind ||
    activeSort !== DEFAULT_FILTERS.sort;

  const totalCountSubtitle =
    list.data && list.data.length > 0
      ? `Images et documents PDF rattachables aux articles. ${list.data.length} fichier${list.data.length > 1 ? "s" : ""}.`
      : "Images et documents PDF rattachables aux articles.";

  const handleOpenMedia = (id: string) => {
    setSelectedId(id);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (next: boolean) => {
    setSheetOpen(next);
    if (!next) {
      window.setTimeout(() => setSelectedId(null), 200);
    }
  };

  return (
    <>
      <PageHeader
        title="Médiathèque"
        subtitle={totalCountSubtitle}
        actions={
          <button
            type="button"
            className="abtn abtn--primary"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="icn" />
            Téléverser
          </button>
        }
      />

      {/* Dropzone */}
      <div
        className="dropzone mb-[18px]"
        role="button"
        tabIndex={0}
        onClick={() => setAddOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setAddOpen(true);
          }
        }}
      >
        <UploadCloud
          className="mx-auto mb-[10px] size-7 text-ink-mute"
          aria-hidden
        />
        <div className="text-[14px] font-semibold text-ink">
          Glissez-déposez vos fichiers ici
        </div>
        <div className="mt-1 text-[12.5px]">
          ou cliquez pour parcourir · JPG, PNG, WebP, PDF · 20 Mo max
        </div>
      </div>

      {/* Filter bar */}
      <div className="adm-filters">
        <div className="adm-seg">
          {(
            [
              ["all", "Tous"],
              ["image", "Images"],
              ["pdf", "PDF"],
            ] as Array<[KindFilter, string]>
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={cn(activeKind === value && "is-active")}
              onClick={() => setFilters({ kind: value })}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-mute" />
          <input
            type="search"
            value={filters.q}
            onChange={(event) => setFilters({ q: event.target.value })}
            placeholder="Rechercher un fichier…"
            className="ainput !w-[220px] !pl-8"
          />
        </div>

        <select
          value={activeSort}
          onChange={(event) => {
            const next = event.target.value;
            if (isSortFilter(next)) setFilters({ sort: next });
          }}
          className="aselect2 !w-[150px]"
        >
          <option value="newest">Récent</option>
          <option value="filename">Nom</option>
          <option value="size">Taille</option>
        </select>

        <span className="ml-auto font-mono text-[12px] text-ink-mute">
          {items.length} fichier{items.length > 1 ? "s" : ""}
        </span>
      </div>

      {list.isLoading ? (
        <MediasGridSkeleton />
      ) : items.length === 0 ? (
        <div className="adm-card">
          <EmptyState
            icon={ImageIcon}
            title={hasActiveFilters ? "Aucun résultat" : "Bibliothèque vide"}
            description={
              hasActiveFilters
                ? "Aucun média ne correspond à votre recherche."
                : "Ajoutez votre premier média pour illustrer vos articles."
            }
            cta={
              hasActiveFilters
                ? undefined
                : {
                    label: "Ajouter un média",
                    onClick: () => setAddOpen(true),
                  }
            }
          />
        </div>
      ) : (
        <div className="media-grid">
          {items.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              selected={selectedId === media.id}
              onClick={() => handleOpenMedia(media.id)}
            />
          ))}
        </div>
      )}

      <MediaDetailSheet
        mediaId={selectedId}
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
      />

      <AddMediaDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}

function MediasGridSkeleton() {
  return (
    <div className="media-grid">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={`media-skel-${idx}`}
          className="media-tile pointer-events-none animate-pulse"
        >
          <div className="media-tile__thumb !bg-paper-3" />
          <div className="media-tile__meta">
            <div className="h-3 w-3/4 rounded bg-paper-3" />
            <div className="mt-1 h-3 w-1/3 rounded bg-paper-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
