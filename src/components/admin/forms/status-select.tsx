"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { ArticleStatus } from "@/lib/admin/types";

const STATUS_LABEL: Record<ArticleStatus, string> = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
};

function isArticleStatus(value: string): value is ArticleStatus {
  return value === "draft" || value === "published" || value === "archived";
}

type StatusSelectProps = {
  value: ArticleStatus;
  onChange: (next: ArticleStatus) => void;
  disabled?: boolean;
  className?: string;
};

export function StatusSelect({
  value,
  onChange,
  disabled,
  className,
}: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => {
        const next = event.target.value;
        if (isArticleStatus(next)) onChange(next);
      }}
      disabled={disabled}
      className={cn("aselect2", className)}
    >
      {(Object.keys(STATUS_LABEL) as ArticleStatus[]).map((status) => (
        <option key={status} value={status}>
          {STATUS_LABEL[status]}
        </option>
      ))}
    </select>
  );
}

export { STATUS_LABEL as ARTICLE_STATUS_LABEL };
