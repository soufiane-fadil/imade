"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type DataTablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/** Build a list of page numbers with ellipsis markers (… as a string). */
function buildPageRange(current: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const range: (number | "…")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(pageCount - 1, current + 1);
  if (left > 2) range.push("…");
  for (let i = left; i <= right; i += 1) range.push(i);
  if (right < pageCount - 1) range.push("…");
  range.push(pageCount);
  return range;
}

export function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: DataTablePaginationProps) {
  const safePageSize = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = total === 0 ? 0 : (safePage - 1) * safePageSize + 1;
  const end = Math.min(total, safePage * safePageSize);

  const canPrev = safePage > 1;
  const canNext = safePage < pageCount;
  const range = buildPageRange(safePage, pageCount);

  return (
    <div className={cn("adm-pager", className)}>
      <span>
        {total === 0
          ? "Aucun résultat"
          : `Affichage ${start}–${end} sur ${total}`}
      </span>
      <div className="adm-pager__nums">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => onPageChange(safePage - 1)}
          aria-label="Page précédente"
        >
          <ChevronLeft className="size-3.5 inline-block align-middle" />
        </button>
        {range.map((value, index) =>
          value === "…" ? (
            <span
              key={`gap-${index}`}
              className="inline-flex h-[30px] w-[30px] items-center justify-center text-ink-mute"
            >
              …
            </span>
          ) : (
            <button
              key={value}
              type="button"
              className={value === safePage ? "is-active" : undefined}
              onClick={() => onPageChange(value)}
              aria-current={value === safePage ? "page" : undefined}
            >
              {value}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={!canNext}
          onClick={() => onPageChange(safePage + 1)}
          aria-label="Page suivante"
        >
          <ChevronRight className="size-3.5 inline-block align-middle" />
        </button>
      </div>
    </div>
  );
}
