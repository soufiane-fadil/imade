"use client";

import * as React from "react";
import {
  FileText,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMedias } from "@/lib/admin/queries/use-medias";
import type { Media, MediaKind } from "@/lib/admin/types";
import { formatBytes } from "@/lib/admin/utils";

type SingleProps = {
  mode: "single";
  value: string | null;
  onChange: (id: string | null) => void;
  /** Restrict the picker to a single kind. */
  kind?: MediaKind;
  /** Label shown on the trigger button when no media is selected. */
  triggerLabel?: string;
  emptyMessage?: string;
  className?: string;
};

type MultiProps = {
  mode: "multi";
  value: string[];
  onChange: (ids: string[]) => void;
  kind?: MediaKind;
  triggerLabel?: string;
  emptyMessage?: string;
  className?: string;
};

type MediaPickerProps = SingleProps | MultiProps;

type TabValue = "image" | "pdf" | "all";

function isTabValue(value: string | undefined): value is TabValue {
  return value === "image" || value === "pdf" || value === "all";
}

function tabLabel(tab: TabValue): string {
  if (tab === "image") return "Images";
  if (tab === "pdf") return "PDF";
  return "Tous";
}

function typeBadgeColor(kind: MediaKind, filename: string): string {
  if (kind === "pdf") return "var(--color-signal)";
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp") {
    return "var(--color-plot)";
  }
  return "var(--color-ink)";
}

function typeBadgeLabel(media: Media): string {
  if (media.kind === "pdf") return "pdf";
  const ext = media.filename.toLowerCase().split(".").pop();
  return ext && ext.length <= 4 ? ext : "img";
}

export function MediaPicker(props: MediaPickerProps) {
  const isMulti = props.mode === "multi";
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState<TabValue>(
    props.kind ?? (isMulti ? "all" : "image"),
  );
  const [q, setQ] = React.useState("");
  const [draftMulti, setDraftMulti] = React.useState<string[]>(
    isMulti ? [...props.value] : [],
  );

  const openDialog = () => {
    if (props.mode === "multi") {
      setDraftMulti([...props.value]);
    }
    setQ("");
    if (props.kind) setTab(props.kind);
    setOpen(true);
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      openDialog();
    } else {
      setOpen(false);
    }
  };

  const effectiveKind: MediaKind | "all" = props.kind ?? tab;
  const list = useMedias({
    kind: effectiveKind === "all" ? "all" : effectiveKind,
    q: q || undefined,
  });

  const allMedias = React.useMemo(() => list.data ?? [], [list.data]);

  // Resolve single selection's media for the trigger preview.
  const singleSelected = useMediaById(
    !isMulti ? (props as SingleProps).value : null,
  );

  const handleSingleSelect = (id: string) => {
    if (props.mode !== "single") return;
    props.onChange(id);
    setOpen(false);
  };

  const handleMultiToggle = (id: string) => {
    setDraftMulti((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleMultiConfirm = () => {
    if (props.mode !== "multi") return;
    props.onChange(draftMulti);
    setOpen(false);
  };

  const dialogTitle =
    props.mode === "single"
      ? "Sélectionner un média"
      : "Sélectionner des médias";

  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-full flex-col gap-2",
        props.className,
      )}
    >
      {props.mode === "single" ? (
        <SingleTrigger
          media={singleSelected}
          onPick={openDialog}
          onClear={() => props.onChange(null)}
          label={props.triggerLabel ?? "Sélectionner un média"}
        />
      ) : (
        <MultiTrigger
          ids={props.value}
          onPick={openDialog}
          onRemove={(id) => props.onChange(props.value.filter((x) => x !== id))}
          label={props.triggerLabel ?? "Ajouter des médias"}
        />
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              Choisissez dans la bibliothèque locale. Les nouveaux médias sont
              gérés depuis la section Médias.
            </DialogDescription>
          </DialogHeader>

          <div className="adm-filters !mb-0">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-mute" />
              <input
                type="search"
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Rechercher un fichier…"
                className="ainput !pl-8"
              />
            </div>
            {props.kind ? null : (
              <div className="adm-seg">
                {(["all", "image", "pdf"] as TabValue[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={tab === value ? "is-active" : ""}
                    onClick={() => {
                      if (isTabValue(value)) setTab(value);
                    }}
                  >
                    {tabLabel(value)}
                  </button>
                ))}
              </div>
            )}
            <span className="ml-auto font-mono text-[12px] text-ink-mute">
              {allMedias.length} fichier{allMedias.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="max-h-[55vh] overflow-y-auto rounded-lg border border-paper-line bg-paper-2 p-3">
            {list.isLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-ink-mute">
                <Loader2 className="size-4 animate-spin" />
                Chargement…
              </div>
            ) : allMedias.length === 0 ? (
              <div className="adm-empty">
                <ImageIcon className="adm-empty__icn" />
                <div className="font-semibold text-ink-3">
                  {props.emptyMessage ?? "Aucun média ne correspond."}
                </div>
              </div>
            ) : (
              <div className="media-grid">
                {allMedias.map((media) => {
                  const isSelected =
                    props.mode === "single"
                      ? props.value === media.id
                      : draftMulti.includes(media.id);
                  return (
                    <div
                      key={media.id}
                      onClick={() => {
                        if (props.mode === "single") {
                          handleSingleSelect(media.id);
                        } else {
                          handleMultiToggle(media.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        if (props.mode === "single") {
                          handleSingleSelect(media.id);
                        } else {
                          handleMultiToggle(media.id);
                        }
                      }}
                      className={cn("media-tile", isSelected && "is-selected")}
                    >
                      <div
                        className="media-tile__thumb"
                        style={
                          media.kind === "image"
                            ? { backgroundImage: `url(${media.url})` }
                            : undefined
                        }
                      >
                        <span
                          className="media-tile__type"
                          style={{
                            background: typeBadgeColor(
                              media.kind,
                              media.filename,
                            ),
                          }}
                        >
                          {typeBadgeLabel(media)}
                        </span>
                        {media.kind !== "image" ? (
                          <FileText className="size-9 text-ink-mute" />
                        ) : null}
                        {props.mode === "multi" ? (
                          <span
                            className={cn(
                              "adm-check absolute top-2 right-2",
                              isSelected && "is-on",
                            )}
                            aria-hidden
                          />
                        ) : null}
                      </div>
                      <div className="media-tile__meta">
                        <div className="media-tile__name">{media.filename}</div>
                        <div className="media-tile__sub">
                          {media.kind === "image" && media.width
                            ? `${media.width}×${media.height ?? "?"} · `
                            : ""}
                          {media.kind === "pdf" && media.pageCount
                            ? `${media.pageCount} p. · `
                            : ""}
                          {formatBytes(media.sizeBytes)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {props.mode === "multi" ? (
            <DialogFooter>
              <button
                type="button"
                className="abtn"
                onClick={() => setOpen(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="abtn abtn--primary"
                onClick={handleMultiConfirm}
              >
                Confirmer ({draftMulti.length})
              </button>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function useMediaById(id: string | null): Media | null {
  // We only need a single record. Pull from the list query and resolve in-memory.
  // Avoids creating a new query hook just for a string lookup.
  const list = useMedias({ kind: "all" });
  if (id === null) return null;
  return list.data?.find((m) => m.id === id) ?? null;
}

type SingleTriggerProps = {
  media: Media | null;
  onPick: () => void;
  onClear: () => void;
  label: string;
};

function SingleTrigger({ media, onPick, onClear, label }: SingleTriggerProps) {
  if (!media) {
    return (
      <button
        type="button"
        className="abtn abtn--ghost w-full justify-center"
        onClick={onPick}
      >
        <ImagePlus className="size-4" />
        {label}
      </button>
    );
  }
  return (
    <div className="flex w-full min-w-0 max-w-full items-center gap-2 overflow-hidden rounded-lg border border-paper-line bg-paper p-2">
      <div
        className="media-tile__thumb !aspect-auto h-[44px] w-[60px] shrink-0 rounded-md"
        style={
          media.kind === "image"
            ? { backgroundImage: `url(${media.url})` }
            : undefined
        }
      >
        {media.kind !== "image" ? (
          <FileText className="size-4 text-ink-mute" />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span
          className="truncate text-[13px] font-semibold text-ink"
          title={media.filename}
        >
          {media.filename}
        </span>
        <span className="font-mono text-[11px] text-ink-mute">
          {formatBytes(media.sizeBytes)}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          className="abtn abtn--ghost abtn--icon"
          onClick={onPick}
          title="Changer la couverture"
          aria-label="Changer la couverture"
        >
          <ImagePlus className="size-4" />
        </button>
        <button
          type="button"
          className="abtn abtn--ghost abtn--icon"
          aria-label="Retirer"
          title="Retirer la couverture"
          onClick={onClear}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

type MultiTriggerProps = {
  ids: string[];
  onPick: () => void;
  onRemove: (id: string) => void;
  label: string;
};

function MultiTrigger({ ids, onPick, onRemove, label }: MultiTriggerProps) {
  return (
    <div className="flex flex-col gap-2">
      {ids.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {ids.map((id) => (
            <MultiTriggerRow key={id} id={id} onRemove={() => onRemove(id)} />
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        className="abtn abtn--ghost abtn--sm w-full justify-center"
        onClick={onPick}
      >
        <ImagePlus className="size-4" />
        {label}
      </button>
    </div>
  );
}

function MultiTriggerRow({
  id,
  onRemove,
}: {
  id: string;
  onRemove: () => void;
}) {
  const media = useMediaById(id);
  return (
    <li className="flex items-center gap-2 rounded-md border border-paper-line bg-paper px-2.5 py-2">
      <FileText className="size-4 shrink-0 text-ink-mute" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[12.5px] font-semibold text-ink">
          {media?.filename ?? id}
        </span>
        {media ? (
          <span className="font-mono text-[10px] text-ink-mute">
            {formatBytes(media.sizeBytes)}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        className="abtn abtn--ghost abtn--icon"
        aria-label="Retirer"
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}
