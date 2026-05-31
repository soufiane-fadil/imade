"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type WithId = { id: string };

type RelationPickerProps<T extends WithId> = {
  value: string | null;
  options: T[];
  isLoading?: boolean;
  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string | null;
  /** Render the trigger's inner content. Defaults to label only. */
  renderTrigger?: (selected: T | null) => React.ReactNode;
  /** Render each command item (defaults to label + sub-label). */
  renderItem?: (item: T) => React.ReactNode;
  onChange: (id: string | null) => void;
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  /** When true, the user can clear the selection via an "Aucun" item. */
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
};

/**
 * Relation picker. Defaults to a native `.aselect2` for plain text options
 * (matches the design). When `renderItem` or `renderTrigger` is provided
 * (rich content like an author with avatar), falls back to a styled Popover +
 * Command list still using admin tokens.
 */
export function RelationPicker<T extends WithId>(
  props: RelationPickerProps<T>,
) {
  if (props.renderItem || props.renderTrigger) {
    return <RichRelationPicker {...props} />;
  }
  return <NativeRelationPicker {...props} />;
}

function NativeRelationPicker<T extends WithId>({
  value,
  options,
  isLoading = false,
  getLabel,
  onChange,
  placeholder = "Sélectionner…",
  clearable = false,
  disabled,
  className,
}: RelationPickerProps<T>) {
  return (
    <select
      className={cn("aselect2", className)}
      value={value ?? ""}
      disabled={disabled || (isLoading && options.length === 0)}
      onChange={(event) => {
        const next = event.target.value;
        if (next === "") {
          onChange(null);
          return;
        }
        onChange(next);
      }}
    >
      <option value="" disabled={!clearable}>
        {isLoading && options.length === 0 ? "Chargement…" : placeholder}
      </option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

function RichRelationPicker<T extends WithId>({
  value,
  options,
  isLoading = false,
  getLabel,
  getSubLabel,
  renderTrigger,
  renderItem,
  onChange,
  placeholder = "Sélectionner…",
  emptyMessage = "Aucun résultat",
  searchPlaceholder = "Rechercher…",
  clearable = false,
  disabled,
  className,
  contentClassName,
}: RelationPickerProps<T>) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(() => {
    if (value === null) return null;
    return options.find((o) => o.id === value) ?? null;
  }, [options, value]);

  const handleSelect = (id: string | null) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            disabled={disabled || (isLoading && options.length === 0)}
            className={cn(
              "aselect2 flex w-full items-center justify-between gap-2 text-left disabled:opacity-50",
              !selected && "text-ink-mute",
              className,
            )}
          />
        }
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-left">
          {renderTrigger ? (
            renderTrigger(selected)
          ) : selected ? (
            <span className="truncate">{getLabel(selected)}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </span>
        {isLoading ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-ink-mute" />
        ) : (
          <ChevronsUpDown className="size-4 shrink-0 text-ink-mute" />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          "w-(--anchor-width) min-w-[240px] border-paper-line bg-paper p-0",
          contentClassName,
        )}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {clearable ? (
                <CommandItem
                  value="__clear__"
                  data-checked={value === null}
                  onSelect={() => handleSelect(null)}
                  className="data-[selected=true]:bg-paper-2"
                >
                  <span className="text-ink-mute">Aucun</span>
                </CommandItem>
              ) : null}
              {options.map((option) => {
                const label = getLabel(option);
                const subLabel = getSubLabel?.(option);
                const isSelected = option.id === value;
                return (
                  <CommandItem
                    key={option.id}
                    value={`${label} ${subLabel ?? ""} ${option.id}`}
                    data-checked={isSelected}
                    onSelect={() => handleSelect(option.id)}
                    className="data-[selected=true]:bg-paper-2"
                  >
                    {renderItem ? (
                      renderItem(option)
                    ) : (
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm">{label}</span>
                        {subLabel ? (
                          <span className="truncate text-[11px] text-ink-mute">
                            {subLabel}
                          </span>
                        ) : null}
                      </div>
                    )}
                    {isSelected ? (
                      <Check className="ml-auto size-4 text-ink" />
                    ) : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
