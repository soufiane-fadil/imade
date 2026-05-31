"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Align = "left" | "center" | "right";

type ColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  label: string;
  align?: Align;
  className?: string;
};

export function ColumnHeader<TData, TValue>({
  column,
  label,
  align = "left",
  className,
}: ColumnHeaderProps<TData, TValue>) {
  const canSort = column.getCanSort();
  const sorted = column.getIsSorted();

  if (!canSort) {
    return (
      <div
        className={cn(
          "text-xs font-medium text-muted-foreground uppercase tracking-wide",
          align === "center" && "text-center",
          align === "right" && "text-right",
          className,
        )}
      >
        {label}
      </div>
    );
  }

  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ChevronsUpDown;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn(
        "-ml-2 h-7 gap-1 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground",
        align === "center" && "mx-auto",
        align === "right" && "ml-auto -mr-2",
        className,
      )}
      aria-label={`Trier par ${label}`}
    >
      <span>{label}</span>
      <Icon
        className={cn(
          "size-3",
          sorted ? "text-foreground" : "text-muted-foreground/60",
        )}
      />
    </Button>
  );
}
