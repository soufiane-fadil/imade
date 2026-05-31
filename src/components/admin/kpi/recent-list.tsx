import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type RecentListItem = {
  id: string;
  primary: string;
  secondary?: string;
  href: string;
};

export function RecentList({
  title,
  items,
  emptyLabel = "Aucun élément récent.",
}: {
  title: string;
  items: RecentListItem[];
  emptyLabel?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {emptyLabel}
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 py-3 transition-colors hover:text-foreground"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {item.primary}
                    </div>
                    {item.secondary ? (
                      <div className="truncate text-xs text-muted-foreground">
                        {item.secondary}
                      </div>
                    ) : null}
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
