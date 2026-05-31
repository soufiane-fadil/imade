"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

const RichTextEditorClient = dynamic(
  () => import("./rich-text-editor.client"),
  {
    ssr: false,
    loading: () => (
      <div className="wysiwyg">
        <div className="wysiwyg__bar">
          <div className="wysiwyg__btn animate-pulse opacity-30" />
          <div className="wysiwyg__btn animate-pulse opacity-30" />
          <div className="wysiwyg__btn animate-pulse opacity-30" />
        </div>
        <div className="wysiwyg__area min-h-[220px] animate-pulse bg-paper-2" />
      </div>
    ),
  },
);

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Min editor area height in px. Defaults to 220. */
  minHeight?: number;
  className?: string;
};

export function RichTextEditor({ className, ...props }: RichTextEditorProps) {
  return (
    <div className={cn("w-full", className)}>
      <RichTextEditorClient {...props} />
    </div>
  );
}
