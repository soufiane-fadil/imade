"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { slugify } from "@/lib/admin/utils";

type SlugInputProps = {
  value: string;
  onChange: (next: string) => void;
  /** Title or other text used to auto-generate the slug. */
  source: string;
  /** Set to true once the persisted record has a slug (edit mode). */
  initiallyManual?: boolean;
  placeholder?: string;
  hint?: React.ReactNode;
  /** Path prefix shown in the input's aprefix tag — e.g. "/article/". */
  prefix?: string;
  disabled?: boolean;
  className?: string;
};

export function SlugInput({
  value,
  onChange,
  source,
  initiallyManual = false,
  placeholder = "mon-article",
  hint,
  prefix = "/article/",
  disabled,
  className,
}: SlugInputProps) {
  const manuallyEditedRef = React.useRef<boolean>(initiallyManual);
  const lastSourceRef = React.useRef<string>(source);

  React.useEffect(() => {
    // Auto-sync from source while the slug is still considered automatic.
    if (manuallyEditedRef.current) {
      lastSourceRef.current = source;
      return;
    }
    if (source === lastSourceRef.current) return;
    lastSourceRef.current = source;
    const auto = slugify(source);
    if (auto !== value) {
      onChange(auto);
    }
  }, [source, value, onChange]);

  const handleManualChange = (next: string) => {
    manuallyEditedRef.current = true;
    onChange(next);
  };

  const handleRegenerate = () => {
    manuallyEditedRef.current = false;
    const next = slugify(source);
    lastSourceRef.current = source;
    onChange(next);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="aprefix">
        <span className="aprefix__tag">{prefix}</span>
        <input
          type="text"
          value={value}
          onChange={(event) => handleManualChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="ainput mono"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        {hint ? (
          <span className="afield__hint">{hint}</span>
        ) : (
          <span className="afield__hint">
            URL :{" "}
            <code className="font-mono">
              {prefix}
              {value || "…"}
            </code>
          </span>
        )}
        <button
          type="button"
          className="font-mono text-[11px] text-[var(--color-plot)] hover:underline disabled:opacity-50"
          onClick={handleRegenerate}
          disabled={disabled || source.trim().length === 0}
        >
          Régénérer depuis le titre
        </button>
      </div>
    </div>
  );
}
