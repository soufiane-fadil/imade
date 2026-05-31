"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ExternalLink, Menu, Search } from "lucide-react";
import { CommandPalette } from "./command-palette";

const PAGE_LABEL: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/articles": "Articles",
  "/admin/categories": "Catégories",
  "/admin/auteurs": "Auteurs",
  "/admin/medias": "Médiathèque",
  "/admin/contacts": "Messages",
  "/admin/utilisateurs": "Utilisateurs",
};

function deriveCrumb(pathname: string): string {
  const direct = PAGE_LABEL[pathname];
  if (direct) return direct;
  // Match longest prefix for nested routes (e.g. /admin/articles/new).
  const matched = Object.entries(PAGE_LABEL)
    .filter(([href]) => pathname.startsWith(`${href}/`) || pathname === href)
    .sort((a, b) => b[0].length - a[0].length);
  return matched[0]?.[1] ?? "Tableau de bord";
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const pathname = usePathname();
  const crumb = deriveCrumb(pathname ?? "/admin");

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--color-paper-line)] bg-[var(--color-paper)] px-4 lg:px-7">
      <button
        type="button"
        className="abtn abtn--ghost abtn--icon lg:hidden"
        onClick={onMenuClick}
        aria-label="Ouvrir le menu"
      >
        <Menu className="size-4" />
      </button>
      <div className="adm-top__crumb">
        Admin
        <span className="mx-1.5 text-[var(--color-paper-line)]">/</span>
        <b>{crumb}</b>
      </div>
      <div className="flex-1" />
      <button
        type="button"
        className="adm-search hidden cursor-pointer items-center text-[var(--color-ink-mute)] transition-colors hover:text-[var(--color-ink)] md:flex"
        onClick={() => setPaletteOpen(true)}
        aria-label="Rechercher partout"
      >
        <Search className="size-4 text-[var(--color-ink-mute)]" />
        <span className="font-mono text-[13px] text-[var(--color-ink-mute)]">
          Rechercher partout… (⌘K)
        </span>
      </button>
      <button
        type="button"
        className="abtn abtn--ghost abtn--icon md:hidden"
        onClick={() => setPaletteOpen(true)}
        aria-label="Rechercher"
      >
        <Search className="size-4" />
      </button>
      <button
        type="button"
        className="abtn abtn--ghost abtn--icon"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
      </button>
      <Link
        href="/"
        target="_blank"
        className="abtn abtn--ghost"
        title="Voir le site"
      >
        <ExternalLink className="size-4" />
        <span className="hidden sm:inline">Voir le site</span>
      </Link>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
