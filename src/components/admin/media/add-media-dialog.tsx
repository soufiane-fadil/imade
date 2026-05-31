"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCreateMedia } from "@/lib/admin/queries/use-medias";
import {
  MediaSchema,
  makeDefaultMediaValues,
  type MediaFormValues,
} from "@/lib/admin/validators/media";
import type { MediaKind } from "@/lib/admin/types";

type AddMediaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TabValue = "upload" | "url";

function deriveFilenameFromUrl(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    const last = u.pathname.split("/").pop();
    return last && last.length > 0 ? decodeURIComponent(last) : "";
  } catch {
    return "";
  }
}

function probeImageDimensions(
  url: string,
): Promise<{ width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    try {
      const img = new window.Image();
      let settled = false;
      const finish = (w: number | null, h: number | null) => {
        if (settled) return;
        settled = true;
        resolve({ width: w, height: h });
      };
      img.onload = () => {
        finish(img.naturalWidth || null, img.naturalHeight || null);
      };
      img.onerror = () => finish(null, null);
      img.src = url;
      window.setTimeout(() => finish(null, null), 2500);
    } catch {
      resolve({ width: null, height: null });
    }
  });
}

export function AddMediaDialog({ open, onOpenChange }: AddMediaDialogProps) {
  const [tab, setTab] = React.useState<TabValue>("url");

  const handleOpenChange = (next: boolean) => {
    if (next) setTab("url");
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Ajouter un média</DialogTitle>
          <DialogDescription>
            Importez une image ou un PDF dans la bibliothèque.
          </DialogDescription>
        </DialogHeader>

        <div className="adm-seg w-full">
          {(
            [
              ["url", "URL externe"],
              ["upload", "Upload"],
            ] as Array<[TabValue, string]>
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={cn("flex-1", tab === value && "is-active")}
              onClick={() => setTab(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "url" ? (
          <UrlImportForm onDone={() => onOpenChange(false)} />
        ) : (
          <UploadPlaceholder />
        )}
      </DialogContent>
    </Dialog>
  );
}

function UploadPlaceholder() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-paper-line bg-paper-2 p-3 text-[12.5px] text-ink-3">
        <strong className="text-ink">Upload bientôt disponible.</strong>{" "}
        L&apos;upload de fichiers sera branché sur Cloudflare R2.
      </div>
      <div
        aria-disabled="true"
        className="dropzone pointer-events-none flex flex-col items-center justify-center gap-3 opacity-60"
      >
        <UploadCloud className="size-8 text-ink-mute" />
        <div>
          <div className="text-[14px] font-semibold text-ink">
            Glissez un fichier ici
          </div>
          <div className="mt-1 text-[12.5px]">
            ou cliquez pour sélectionner depuis votre disque
          </div>
        </div>
        <span className="scope-tag">À venir</span>
      </div>
    </div>
  );
}

type UrlImportFormProps = {
  onDone: () => void;
};

function isMediaKind(value: string): value is MediaKind {
  return value === "image" || value === "pdf";
}

function UrlImportForm({ onDone }: UrlImportFormProps) {
  const create = useCreateMedia();
  const [filenameDirty, setFilenameDirty] = React.useState(false);

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(MediaSchema),
    defaultValues: makeDefaultMediaValues(),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const altValue =
      typeof values.alt === "string" && values.alt.trim() === ""
        ? null
        : values.alt;
    const captionValue =
      typeof values.caption === "string" && values.caption.trim() === ""
        ? null
        : values.caption;

    let width: number | null = null;
    let height: number | null = null;
    if (values.kind === "image") {
      const dims = await probeImageDimensions(values.url);
      width = dims.width;
      height = dims.height;
    }

    await create.mutateAsync({
      kind: values.kind,
      url: values.url,
      filename: values.filename,
      alt: altValue,
      caption: captionValue,
      sizeBytes: 0,
      width,
      height,
      pageCount: null,
    });
    form.reset(makeDefaultMediaValues());
    setFilenameDirty(false);
    onDone();
  });

  const urlError = form.formState.errors.url?.message;
  const filenameError = form.formState.errors.filename?.message;

  return (
    <form onSubmit={onSubmit} className="flex flex-col" noValidate>
      <Controller
        control={form.control}
        name="kind"
        render={({ field }) => (
          <div className="afield">
            <label>Type</label>
            <div className="adm-seg w-full">
              {(
                [
                  ["image", "Image"],
                  ["pdf", "PDF"],
                ] as Array<[MediaKind, string]>
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={cn("flex-1", field.value === value && "is-active")}
                  onClick={() => {
                    if (isMediaKind(value)) field.onChange(value);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="url"
        render={({ field }) => (
          <div className="afield">
            <label htmlFor="media-url">
              URL <span className="req">*</span>
            </label>
            <input
              id="media-url"
              type="url"
              placeholder="https://exemple.com/fichier.jpg"
              className="ainput mono"
              value={field.value}
              onChange={field.onChange}
              onBlur={(event) => {
                field.onBlur();
                const url = event.target.value.trim();
                if (!url) return;
                if (filenameDirty) return;
                const current = form.getValues("filename");
                if (current && current.trim() !== "") return;
                const guess = deriveFilenameFromUrl(url);
                if (guess) {
                  form.setValue("filename", guess, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
            />
            <div className="afield__hint">
              Lien direct vers le fichier (accessible publiquement).
            </div>
            {urlError ? (
              <div className="afield__hint !text-signal">{urlError}</div>
            ) : null}
          </div>
        )}
      />

      <div className="afield">
        <label htmlFor="media-filename">
          Nom du fichier <span className="req">*</span>
        </label>
        <input
          id="media-filename"
          type="text"
          placeholder="ma-photo.jpg"
          className="ainput mono"
          {...form.register("filename")}
          onChange={(event) => {
            setFilenameDirty(true);
            form.setValue("filename", event.target.value, {
              shouldValidate: true,
            });
          }}
        />
        {filenameError ? (
          <div className="afield__hint !text-signal">{filenameError}</div>
        ) : null}
      </div>

      <Controller
        control={form.control}
        name="alt"
        render={({ field }) => (
          <div className="afield">
            <label htmlFor="media-alt-add">Texte alternatif</label>
            <input
              id="media-alt-add"
              type="text"
              placeholder="Description de l'image (optionnel)"
              className="ainput"
              value={field.value ?? ""}
              onBlur={field.onBlur}
              onChange={(event) =>
                field.onChange(
                  event.target.value === "" ? null : event.target.value,
                )
              }
            />
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="caption"
        render={({ field }) => (
          <div className="afield">
            <label htmlFor="media-caption-add">Légende</label>
            <textarea
              id="media-caption-add"
              placeholder="Légende affichée sous le média (optionnel)"
              className="atext min-h-[80px]"
              value={field.value ?? ""}
              onBlur={field.onBlur}
              onChange={(event) =>
                field.onChange(
                  event.target.value === "" ? null : event.target.value,
                )
              }
            />
          </div>
        )}
      />

      <DialogFooter>
        <button
          type="button"
          className="abtn"
          onClick={onDone}
          disabled={create.isPending}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="abtn abtn--primary"
          disabled={create.isPending}
        >
          {create.isPending ? "…" : "Importer"}
        </button>
      </DialogFooter>
    </form>
  );
}
