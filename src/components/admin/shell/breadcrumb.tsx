import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label="Fil d'Ariane"
      className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-mute)]"
    >
      {items.map((item, idx) => {
        const last = idx === items.length - 1;
        return (
          <span
            key={`${item.label}-${idx}`}
            className="flex items-center gap-1.5"
          >
            {idx > 0 ? (
              <span className="text-[var(--color-paper-line)]">/</span>
            ) : null}
            {item.href && !last ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-[var(--color-ink)]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  last ? "font-bold text-[var(--color-ink)]" : undefined
                }
                aria-current={last ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
