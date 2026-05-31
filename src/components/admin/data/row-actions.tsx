"use client";

import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, type LucideIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type RowActionBase = {
  label: string;
  icon?: LucideIcon;
  destructive?: boolean;
  disabled?: boolean;
};

export type RowAction =
  | (RowActionBase & { href: string; onClick?: never })
  | (RowActionBase & { onClick: () => void; href?: never });

type RowActionsProps = {
  items: RowAction[];
  ariaLabel?: string;
  /**
   * Hard cap on inline icon buttons. When `items.length` exceeds this,
   * the surplus collapses into a "More" dropdown to avoid crowded rows.
   * Defaults to 3.
   */
  inlineLimit?: number;
  className?: string;
};

export function RowActions({
  items,
  ariaLabel = "Actions",
  inlineLimit = 3,
  className,
}: RowActionsProps) {
  if (items.length === 0) return null;

  const renderInline = items.length <= inlineLimit;

  if (renderInline) {
    return (
      <div className={cn("adm-rowactions", className)}>
        {items.map((item) => (
          <InlineAction key={item.label} item={item} ariaLabel={ariaLabel} />
        ))}
      </div>
    );
  }

  const firstRegular = items.find((i) => !i.destructive);
  const firstDestructive = items.find((i) => i.destructive);
  const inlineSet = new Set<RowAction>();
  if (firstRegular) inlineSet.add(firstRegular);
  if (firstDestructive && firstDestructive !== firstRegular) {
    inlineSet.add(firstDestructive);
  }
  const overflow = items.filter((i) => !inlineSet.has(i));
  const regularOverflow = overflow.filter((i) => !i.destructive);
  const destructiveOverflow = overflow.filter((i) => i.destructive);

  return (
    <div className={cn("adm-rowactions", className)}>
      {firstRegular ? (
        <InlineAction item={firstRegular} ariaLabel={ariaLabel} />
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="abtn abtn--ghost abtn--icon"
              aria-label={`${ariaLabel} (plus)`}
              onClick={(event: React.MouseEvent) => event.stopPropagation()}
            />
          }
        >
          <MoreHorizontal className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px]">
          {regularOverflow.map((item) => (
            <OverflowItem key={item.label} item={item} />
          ))}
          {regularOverflow.length > 0 && destructiveOverflow.length > 0 ? (
            <DropdownMenuSeparator />
          ) : null}
          {destructiveOverflow.map((item) => (
            <OverflowItem key={item.label} item={item} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {firstDestructive && firstDestructive !== firstRegular ? (
        <InlineAction item={firstDestructive} ariaLabel={ariaLabel} />
      ) : null}
    </div>
  );
}

function InlineAction({
  item,
  ariaLabel,
}: {
  item: RowAction;
  ariaLabel: string;
}) {
  const Icon = item.icon;
  const className = cn(
    "abtn abtn--icon",
    item.destructive ? "abtn--danger" : "abtn--ghost",
  );
  const accessibleLabel = `${ariaLabel}: ${item.label}`;

  if (item.href !== undefined) {
    return (
      <Link
        href={item.href}
        className={className}
        title={item.label}
        aria-label={accessibleLabel}
        onClick={(event) => event.stopPropagation()}
      >
        {Icon ? <Icon className="size-3.5" /> : null}
      </Link>
    );
  }

  const handleClick = item.onClick;
  return (
    <button
      type="button"
      className={className}
      disabled={item.disabled}
      title={item.label}
      aria-label={accessibleLabel}
      onClick={(event) => {
        event.stopPropagation();
        handleClick();
      }}
    >
      {Icon ? <Icon className="size-3.5" /> : null}
    </button>
  );
}

function OverflowItem({ item }: { item: RowAction }) {
  const Icon = item.icon;
  const variant = item.destructive ? "destructive" : undefined;

  if (item.href !== undefined) {
    return (
      <DropdownMenuItem
        render={
          <Link href={item.href} onClick={(event) => event.stopPropagation()} />
        }
        variant={variant}
      >
        {Icon ? <Icon /> : null}
        {item.label}
      </DropdownMenuItem>
    );
  }

  const handleClick = item.onClick;
  return (
    <DropdownMenuItem
      variant={variant}
      disabled={item.disabled}
      onClick={(event: React.MouseEvent) => {
        event.stopPropagation();
        handleClick();
      }}
    >
      {Icon ? <Icon /> : null}
      {item.label}
    </DropdownMenuItem>
  );
}
