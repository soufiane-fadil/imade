"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FormSectionProps = {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/**
 * Renders an admin form section: a `.aform-sec` mono uppercase divider
 * (with optional inline actions) followed by an optional description and
 * the children. Designed to be dropped inside an `.adm-card__body` or
 * directly within a form.
 */
export function FormSection({
  title,
  description,
  actions,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className={cn("flex flex-col", className)}>
      <div className="aform-sec justify-between">
        <span>{title}</span>
        {actions ? (
          <div className="flex items-center gap-2 normal-case tracking-normal">
            {actions}
          </div>
        ) : null}
      </div>
      {description ? (
        <p className="mb-4 text-[13px] text-ink-mute">{description}</p>
      ) : null}
      <div className="flex flex-col">{children}</div>
    </section>
  );
}
