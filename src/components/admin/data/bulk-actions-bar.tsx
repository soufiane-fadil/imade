"use client";

import { X, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type BulkActionVariant = "default" | "destructive";

export type BulkAction = {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: BulkActionVariant;
  disabled?: boolean;
};

type BulkActionsBarProps = {
  selectedCount: number;
  actions: BulkAction[];
  onClear: () => void;
  itemLabel?: { singular: string; plural: string };
  className?: string;
};

const GHOST_OVERRIDE = {
  borderColor: "rgba(255,255,255,0.25)",
  color: "#fff",
  background: "transparent",
} as const;

const DANGER_OVERRIDE = {
  borderColor: "var(--color-signal)",
  color: "var(--color-signal)",
  background: "transparent",
} as const;

export function BulkActionsBar({
  selectedCount,
  actions,
  onClear,
  itemLabel = { singular: "élément", plural: "éléments" },
  className,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;
  const noun = selectedCount > 1 ? itemLabel.plural : itemLabel.singular;

  // Group destructive actions and push them right.
  const destructive = actions.filter((a) => a.variant === "destructive");
  const regular = actions.filter((a) => a.variant !== "destructive");

  return (
    <div
      role="region"
      aria-label="Actions groupées"
      className={cn(
        "mb-3 flex flex-wrap items-center gap-3 rounded-lg bg-ink px-[14px] py-[10px] text-paper",
        className,
      )}
    >
      <span className="text-[13px] font-semibold">
        {selectedCount} {noun} sélectionné{selectedCount > 1 ? "s" : ""}
      </span>
      {regular.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            type="button"
            className="abtn abtn--ghost abtn--sm"
            style={GHOST_OVERRIDE}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {Icon ? <Icon className="size-3.5" /> : null}
            {action.label}
          </button>
        );
      })}
      {destructive.length > 0 ? (
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {destructive.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                className="abtn abtn--sm"
                style={DANGER_OVERRIDE}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {Icon ? <Icon className="size-3.5" /> : null}
                {action.label}
              </button>
            );
          })}
        </div>
      ) : null}
      <button
        type="button"
        className={cn(
          "abtn abtn--ghost abtn--sm abtn--icon",
          destructive.length === 0 && "ml-auto",
        )}
        style={GHOST_OVERRIDE}
        onClick={onClear}
        aria-label="Annuler la sélection"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
