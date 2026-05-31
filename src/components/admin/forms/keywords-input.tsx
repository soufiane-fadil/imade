"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type KeywordsInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  max?: number;
  disabled?: boolean;
  className?: string;
};

export function KeywordsInput({
  value,
  onChange,
  placeholder = "Ajouter un mot-clé puis Entrée…",
  max,
  disabled,
  className,
}: KeywordsInputProps) {
  const [draft, setDraft] = React.useState("");

  const canAdd = max === undefined || value.length < max;

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (!canAdd) return;
    if (value.some((k) => k.toLowerCase() === trimmed.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  };

  const removeAt = (index: number) => {
    const next = value.slice();
    next.splice(index, 1);
    onChange(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(draft);
      return;
    }
    if (event.key === "Backspace" && draft.length === 0 && value.length > 0) {
      event.preventDefault();
      removeAt(value.length - 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text");
    if (!text.includes(",")) return;
    event.preventDefault();
    const tokens = text
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tokens.length === 0) return;
    const next: string[] = value.slice();
    const seen = new Set(next.map((k) => k.toLowerCase()));
    for (const token of tokens) {
      if (max !== undefined && next.length >= max) break;
      if (seen.has(token.toLowerCase())) continue;
      seen.add(token.toLowerCase());
      next.push(token);
    }
    onChange(next);
    setDraft("");
  };

  return (
    <div
      className={cn(
        "ainput flex min-h-10 flex-wrap items-center gap-1.5 !p-1.5",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className,
      )}
      onClick={(event) => {
        const target = event.target as HTMLElement | null;
        if (target?.tagName === "INPUT") return;
        const input = event.currentTarget.querySelector("input");
        if (input instanceof HTMLInputElement) input.focus();
      }}
    >
      {value.map((keyword, index) => (
        <span
          key={`${keyword}-${index}`}
          className="inline-flex items-center gap-1 rounded border border-paper-line bg-paper-2 px-2 py-[2px] font-mono text-[11px] text-ink-3"
        >
          {keyword}
          <button
            type="button"
            onClick={() => removeAt(index)}
            disabled={disabled}
            className="inline-flex size-3.5 items-center justify-center rounded-full text-ink-mute hover:bg-paper-3 hover:text-ink"
            aria-label={`Retirer ${keyword}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={() => commit(draft)}
        placeholder={value.length === 0 ? placeholder : undefined}
        disabled={disabled || !canAdd}
        className="min-w-[80px] flex-1 border-0 bg-transparent font-mono text-[12px] outline-none placeholder:text-ink-mute"
      />
    </div>
  );
}
