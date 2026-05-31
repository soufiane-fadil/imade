"use client";

import * as React from "react";
import { Copy, FileText, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/admin/feedback/confirm-dialog";
import {
  useMedia,
  useRemoveMedia,
  useUpdateMedia,
} from "@/lib/admin/queries/use-medias";
import { formatBytes } from "@/lib/admin/utils";
import { RepositoryError, type Media } from "@/lib/admin/types";

type MediaDetailSheetProps = {
  mediaId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function kindLabel(kind: Media["kind"]): string {
  return kind === "image" ? "Image" : "PDF";
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR");
  } catch {
    return iso;
  }
}

export function MediaDetailSheet({
  mediaId,
  open,
  onOpenChange,
}: MediaDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!w-full !max-w-[440px] overflow-hidden bg-paper p-0"
      >
        <SheetTitle className="sr-only">Détails du média</SheetTitle>
        <SheetDescription className="sr-only">
          Aperçu et édition du média sélectionné.
        </SheetDescription>
        {mediaId ? (
          <MediaDetailContent
            mediaId={mediaId}
            onClose={() => onOpenChange(false)}
          />
        ) : (
          <div className="adm-drawer__head">
            <div>
              <div className="text-[18px] font-bold tracking-tight">
                Détails du média
              </div>
              <div className="mt-[3px] text-[12.5px] text-ink-mute">
                Aucun média sélectionné.
              </div>
            </div>
            <button
              type="button"
              className="abtn abtn--ghost abtn--icon"
              onClick={() => onOpenChange(false)}
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

type MediaDetailContentProps = {
  mediaId: string;
  onClose: () => void;
};

function MediaDetailContent({ mediaId, onClose }: MediaDetailContentProps) {
  const query = useMedia(mediaId);
  const update = useUpdateMedia();
  const remove = useRemoveMedia();

  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [blockedArticles, setBlockedArticles] = React.useState<string[] | null>(
    null,
  );

  const media = query.data ?? null;

  const [filename, setFilename] = React.useState("");
  const [alt, setAlt] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const [hydratedId, setHydratedId] = React.useState<string | null>(null);

  // Hydrate local form state from server data when the media id changes.
  if (media && hydratedId !== media.id) {
    setHydratedId(media.id);
    setFilename(media.filename);
    setAlt(media.alt ?? "");
    setCaption(media.caption ?? "");
  }

  const saveField = async (
    field: "filename" | "alt" | "caption",
    value: string,
  ) => {
    if (!media) return;
    if (field === "filename") {
      if (!value.trim() || value === media.filename) return;
      await update.mutateAsync({ id: media.id, patch: { filename: value } });
      return;
    }
    if (field === "alt") {
      const next = value.trim() === "" ? null : value;
      if (next === (media.alt ?? null)) return;
      await update.mutateAsync({ id: media.id, patch: { alt: next } });
      return;
    }
    if (field === "caption") {
      const next = value.trim() === "" ? null : value;
      if (next === (media.caption ?? null)) return;
      await update.mutateAsync({ id: media.id, patch: { caption: next } });
      return;
    }
  };

  const handleCopyUrl = async () => {
    if (!media) return;
    try {
      await navigator.clipboard.writeText(media.url);
      toast.success("URL copiée");
    } catch {
      toast.error("Impossible de copier");
    }
  };

  const handleConfirmDelete = async () => {
    if (!media) return;
    try {
      await remove.mutateAsync(media.id);
      setConfirmDelete(false);
      onClose();
    } catch (err) {
      if (err instanceof RepositoryError && err.code === "MEDIA_IN_USE") {
        const rawIds = err.details.articleIds;
        const ids = Array.isArray(rawIds)
          ? rawIds.filter((x): x is string => typeof x === "string")
          : [];
        setConfirmDelete(false);
        setBlockedArticles(ids);
        return;
      }
      setConfirmDelete(false);
    }
  };

  if (query.isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="adm-drawer__head">
          <div>
            <div className="text-[18px] font-bold tracking-tight">
              Chargement…
            </div>
            <div className="mt-[3px] text-[12.5px] text-ink-mute">
              Récupération du média.
            </div>
          </div>
          <button
            type="button"
            className="abtn abtn--ghost abtn--icon"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="adm-drawer__body flex flex-col gap-3">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="flex h-full flex-col">
        <div className="adm-drawer__head">
          <div>
            <div className="text-[18px] font-bold tracking-tight">
              Média introuvable
            </div>
            <div className="mt-[3px] text-[12.5px] text-ink-mute">
              Ce média a peut-être été supprimé.
            </div>
          </div>
          <button
            type="button"
            className="abtn abtn--ghost abtn--icon"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  const isImage = media.kind === "image";

  return (
    <div className="flex h-full flex-col">
      <div className="adm-drawer__head">
        <div className="min-w-0 flex-1">
          <div
            className="truncate text-[18px] font-bold tracking-tight"
            title={media.filename}
          >
            {media.filename}
          </div>
          <div className="mt-[3px] font-mono text-[12.5px] text-ink-mute">
            {kindLabel(media.kind)} · {formatBytes(media.sizeBytes)}
          </div>
        </div>
        <button
          type="button"
          className="abtn abtn--ghost abtn--icon"
          onClick={onClose}
          aria-label="Fermer"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="adm-drawer__body flex flex-col gap-4">
        {/* Preview */}
        <div
          className="aspect-video overflow-hidden rounded-lg border border-paper-line bg-paper-2"
          style={
            isImage
              ? {
                  backgroundImage: `url(${media.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {!isImage ? (
            <div className="flex h-full items-center justify-center text-ink-mute">
              <FileText className="size-12" />
            </div>
          ) : null}
        </div>

        {/* Editable fields */}
        <div className="afield !mb-0">
          <label htmlFor="media-filename">Nom du fichier</label>
          <input
            id="media-filename"
            type="text"
            value={filename}
            onChange={(event) => setFilename(event.target.value)}
            onBlur={(event) => {
              void saveField("filename", event.target.value);
            }}
            className="ainput mono"
            disabled={update.isPending}
          />
        </div>

        <div className="afield !mb-0">
          <label htmlFor="media-alt">Texte alternatif (alt)</label>
          <input
            id="media-alt"
            type="text"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            onBlur={(event) => {
              void saveField("alt", event.target.value);
            }}
            placeholder={isImage ? "Décrivez l'image…" : "—"}
            disabled={update.isPending}
            className="ainput"
          />
          <div className="afield__hint">
            Important pour l&apos;accessibilité et le SEO.
          </div>
        </div>

        <div className="afield !mb-0">
          <label htmlFor="media-caption">Légende</label>
          <textarea
            id="media-caption"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            onBlur={(event) => {
              void saveField("caption", event.target.value);
            }}
            placeholder="Légende optionnelle…"
            className="atext min-h-[80px]"
            disabled={update.isPending}
          />
        </div>

        {/* Read-only metadata */}
        <div className="aform-sec">Métadonnées</div>
        <dl className="grid grid-cols-[100px_1fr] gap-y-2 text-[12.5px]">
          <dt className="text-ink-mute">URL</dt>
          <dd className="flex items-start gap-1.5">
            <code
              className="flex-1 truncate font-mono text-[11px] text-ink-3"
              title={media.url}
            >
              {media.url}
            </code>
            <button
              type="button"
              className="abtn abtn--ghost abtn--icon abtn--sm"
              onClick={handleCopyUrl}
              aria-label="Copier l'URL"
            >
              <Copy className="size-3.5" />
            </button>
          </dd>
          <dt className="text-ink-mute">Taille</dt>
          <dd className="font-mono text-[11px]">
            {formatBytes(media.sizeBytes)}
          </dd>
          {isImage && media.width && media.height ? (
            <>
              <dt className="text-ink-mute">Dimensions</dt>
              <dd className="font-mono text-[11px]">
                {media.width} × {media.height}px
              </dd>
            </>
          ) : null}
          {!isImage && media.pageCount ? (
            <>
              <dt className="text-ink-mute">Pages</dt>
              <dd className="font-mono text-[11px]">{media.pageCount}</dd>
            </>
          ) : null}
          <dt className="text-ink-mute">Ajouté le</dt>
          <dd className="font-mono text-[11px]">
            {formatDate(media.createdAt)}
          </dd>
          <dt className="text-ink-mute">ID</dt>
          <dd className="truncate font-mono text-[11px]" title={media.id}>
            {media.id}
          </dd>
        </dl>
      </div>

      {/* Footer */}
      <div className="adm-drawer__foot">
        <button
          type="button"
          className="abtn abtn--danger"
          onClick={() => setConfirmDelete(true)}
          disabled={remove.isPending}
        >
          <Trash2 className="size-4" />
          Supprimer
        </button>
        <button
          type="button"
          className="abtn abtn--primary"
          onClick={handleCopyUrl}
        >
          <Copy className="size-4" />
          Copier l&apos;URL
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Supprimer ce média ?"
        description={
          <>
            Le fichier{" "}
            <strong className="text-foreground">{media.filename}</strong> sera
            définitivement retiré de la bibliothèque. Cette action est
            irréversible.
          </>
        }
        confirmLabel="Supprimer"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />

      <Dialog
        open={blockedArticles !== null}
        onOpenChange={(next) => {
          if (!next) setBlockedArticles(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suppression impossible</DialogTitle>
            <DialogDescription>
              Ce média est utilisé par {blockedArticles?.length ?? 0} article
              {blockedArticles && blockedArticles.length > 1 ? "s" : ""}.
              Détachez-le de ces articles avant suppression.
            </DialogDescription>
          </DialogHeader>
          {blockedArticles && blockedArticles.length > 0 ? (
            <ul className="max-h-48 overflow-y-auto rounded-md border border-paper-line bg-paper-2 p-2 font-mono text-[11px]">
              {blockedArticles.map((id) => (
                <li key={id} className="px-1 py-0.5">
                  {id}
                </li>
              ))}
            </ul>
          ) : null}
          <DialogFooter>
            <button
              type="button"
              className="abtn"
              onClick={() => setBlockedArticles(null)}
            >
              Fermer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
