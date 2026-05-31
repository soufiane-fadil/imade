import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  href,
  icon: Icon,
  accent = "default",
  delta,
  deltaDirection = "up",
}: {
  label: string;
  value: number | string;
  href?: string;
  icon?: LucideIcon;
  accent?: "default" | "signal";
  delta?: string;
  deltaDirection?: "up" | "down";
}) {
  const body = (
    <div
      className={cn(
        "adm-stat block transition-colors",
        href && "cursor-pointer hover:border-[var(--color-ink)]",
      )}
    >
      <div className="adm-stat__label">{label}</div>
      <div className="adm-stat__value tabular-nums">{value}</div>
      {delta ? (
        <div className={cn("adm-stat__delta", deltaDirection)}>
          <span aria-hidden>{deltaDirection === "up" ? "↑" : "●"}</span> {delta}
        </div>
      ) : null}
      {Icon ? (
        <Icon
          className={cn(
            "absolute right-4 bottom-4 size-5 opacity-40",
            accent === "signal"
              ? "text-[var(--color-signal)]"
              : "text-[var(--color-ink-mute)]",
          )}
          aria-hidden
        />
      ) : null}
    </div>
  );
  if (href) {
    return (
      <Link href={href} aria-label={label} className="block">
        {body}
      </Link>
    );
  }
  return body;
}
