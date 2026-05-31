"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ReadingTimeInputProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
};

export function ReadingTimeInput({
  value,
  onChange,
  min = 1,
  max = 120,
  disabled,
  className,
}: ReadingTimeInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (raw === "") {
      onChange(min);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    onChange(Math.round(parsed));
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={1}
        value={Number.isFinite(value) ? value : min}
        onChange={handleChange}
        disabled={disabled}
        className="ainput mono !w-[70px]"
      />
      <span className="text-[13px] text-ink-mute">minutes</span>
    </div>
  );
}
