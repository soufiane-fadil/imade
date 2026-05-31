"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateCta = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  cta?: EmptyStateCta;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  cta,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="max-w-sm text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {cta ? (
        cta.href ? (
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            render={<Link href={cta.href} />}
          >
            {cta.label}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={cta.onClick}
          >
            {cta.label}
          </Button>
        )
      ) : null}
    </div>
  );
}
