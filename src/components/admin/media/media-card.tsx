"use client";

import { FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/admin/utils";
import type { Media } from "@/lib/admin/types";

type MediaCardProps = {
  media: Media;
  selected?: boolean;
  onClick: () => void;
};

function typeBadgeLabel(media: Media): string {
  if (media.kind === "pdf") return "pdf";
  const ext = media.filename.toLowerCase().split(".").pop();
  return ext && ext.length <= 4 ? ext : "img";
}

function typeBadgeColor(media: Media): string {
  if (media.kind === "pdf") return "var(--color-signal)";
  const ext = media.filename.toLowerCase().split(".").pop();
  if (
    ext === "png" ||
    ext === "jpg" ||
    ext === "jpeg" ||
    ext === "webp" ||
    ext === "gif"
  ) {
    return "var(--color-plot)";
  }
  return "var(--color-ink)";
}

export function MediaCard({ media, selected, onClick }: MediaCardProps) {
  const isImage = media.kind === "image";

  const dimsPart =
    isImage && media.width && media.height
      ? `${media.width}×${media.height}`
      : !isImage && media.pageCount
        ? `${media.pageCount} p.`
        : null;
  const sub = [dimsPart, formatBytes(media.sizeBytes)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      aria-label={`Ouvrir ${media.filename}`}
      className={cn("media-tile", selected && "is-selected")}
    >
      <div
        className="media-tile__thumb"
        style={isImage ? { backgroundImage: `url(${media.url})` } : undefined}
      >
        <span
          className="media-tile__type"
          style={{ background: typeBadgeColor(media) }}
        >
          {typeBadgeLabel(media)}
        </span>
        {!isImage ? (
          <FileText className="size-9 text-ink-mute" aria-hidden />
        ) : null}
      </div>
      <div className="media-tile__meta">
        <div className="media-tile__name" title={media.filename}>
          {media.filename}
        </div>
        <div className="media-tile__sub">{sub}</div>
      </div>
    </div>
  );
}
