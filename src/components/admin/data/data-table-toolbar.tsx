"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

type DataTableToolbarProps = {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  hasActiveFilters?: boolean;
  onReset?: () => void;
  /** Right-aligned counter text (e.g. "12 résultats"). */
  count?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function DataTableToolbar({
  searchValue,
  searchPlaceholder = "Rechercher…",
  onSearchChange,
  hasActiveFilters = false,
  onReset,
  count,
  children,
  className,
}: DataTableToolbarProps) {
  const hasSearch = typeof onSearchChange === "function";

  return (
    <div className={cn("adm-filters", className)}>
      {hasSearch ? (
        <div className="adm-search">
          <Search className="size-4 text-ink-mute" />
          <input
            type="search"
            value={searchValue ?? ""}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
      ) : null}
      {children}
      {count !== undefined ? (
        <div
          className="font-mono text-[12px] text-ink-mute"
          style={{ marginLeft: "auto" }}
        >
          {count}
        </div>
      ) : null}
      {hasActiveFilters && onReset ? (
        <button
          type="button"
          className="abtn abtn--ghost abtn--sm"
          onClick={onReset}
        >
          <X className="size-3.5" />
          Réinitialiser
        </button>
      ) : null}
    </div>
  );
}
