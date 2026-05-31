"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  HelpCircle,
  Plus,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/admin/types";

type FaqEditorProps = {
  value: FaqItem[];
  onChange: (next: FaqItem[]) => void;
  max?: number;
  disabled?: boolean;
  className?: string;
};

function emptyItem(): FaqItem {
  return { question: "", answer: "" };
}

export function FaqEditor({
  value,
  onChange,
  max = 20,
  disabled,
  className,
}: FaqEditorProps) {
  const updateAt = (index: number, patch: Partial<FaqItem>) => {
    const next = value.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    );
    onChange(next);
  };

  const removeAt = (index: number) => {
    const next = value.slice();
    next.splice(index, 1);
    onChange(next);
  };

  const moveBy = (index: number, delta: number) => {
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= value.length) return;
    const next = value.slice();
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
  };

  const addItem = () => {
    if (value.length >= max) return;
    onChange([...value, emptyItem()]);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {value.length === 0 ? (
        <div className="adm-empty">
          <HelpCircle className="adm-empty__icn" />
          <div className="font-semibold text-ink-3">Aucune question</div>
          <div className="mt-1 text-[13px]">
            Ajoutez des Q/R pour enrichir le SEO (rich snippets).
          </div>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="abtn abtn--ghost abtn--sm"
              onClick={addItem}
              disabled={disabled || value.length >= max}
            >
              <Plus className="size-4" />
              Ajouter une question
            </button>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {value.map((item, index) => {
            const title =
              item.question.trim().length > 0
                ? item.question
                : `Question ${index + 1}`;
            return (
              <li
                key={index}
                className="overflow-hidden rounded-md border border-paper-line bg-paper-2"
              >
                <details
                  className="group/faq"
                  open={index === value.length - 1}
                >
                  <summary className="flex cursor-pointer list-none items-center gap-[10px] px-3 py-[10px] text-[13px] font-semibold text-ink hover:bg-paper-3/40 [&::-webkit-details-marker]:hidden">
                    <ChevronDown className="size-4 shrink-0 text-ink-mute transition-transform group-open/faq:rotate-180" />
                    <GripVertical
                      className="size-4 shrink-0 cursor-grab text-ink-mute"
                      aria-hidden
                    />
                    <span className="font-mono text-[11px] font-semibold text-signal">
                      Q{index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{title}</span>
                    <div
                      className="flex shrink-0 items-center gap-1"
                      onClick={(event) => event.preventDefault()}
                    >
                      <button
                        type="button"
                        className="abtn abtn--ghost abtn--icon abtn--sm"
                        aria-label="Monter"
                        disabled={disabled || index === 0}
                        onClick={() => moveBy(index, -1)}
                      >
                        <ChevronUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="abtn abtn--ghost abtn--icon abtn--sm"
                        aria-label="Descendre"
                        disabled={disabled || index === value.length - 1}
                        onClick={() => moveBy(index, 1)}
                      >
                        <ChevronDown className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="abtn abtn--danger abtn--icon abtn--sm"
                        aria-label="Supprimer"
                        disabled={disabled}
                        onClick={() => removeAt(index)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </summary>
                  <div className="flex flex-col gap-2 border-t border-paper-line bg-paper px-3 py-3">
                    <div className="afield !mb-0">
                      <label className="!mb-1.5 text-[12px] font-medium !text-ink-mute">
                        Question
                      </label>
                      <input
                        type="text"
                        className="ainput"
                        value={item.question}
                        onChange={(event) =>
                          updateAt(index, { question: event.target.value })
                        }
                        placeholder="Pourquoi isoler les combles ?"
                        disabled={disabled}
                      />
                    </div>
                    <div className="afield !mb-0">
                      <label className="!mb-1.5 text-[12px] font-medium !text-ink-mute">
                        Réponse
                      </label>
                      <textarea
                        className="atext min-h-[100px]"
                        value={item.answer}
                        onChange={(event) =>
                          updateAt(index, { answer: event.target.value })
                        }
                        placeholder="Une isolation des combles permet de…"
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}

      {value.length > 0 ? (
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[11px] text-ink-mute">
            {value.length} / {max}
          </span>
          <button
            type="button"
            className="abtn abtn--ghost abtn--sm"
            onClick={addItem}
            disabled={disabled || value.length >= max}
          >
            <Plus className="size-4" />
            Ajouter une question
          </button>
        </div>
      ) : null}
    </div>
  );
}
