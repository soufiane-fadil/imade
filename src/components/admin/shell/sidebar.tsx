"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  FolderClosed,
  PenLine,
  Users,
  Image as ImageIcon,
  Mail,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useArticles } from "@/lib/admin/queries/use-articles";
import { useContacts } from "@/lib/admin/queries/use-contacts";
import { useUsers } from "@/lib/admin/queries/use-users";
import { useAuthors } from "@/lib/admin/queries/use-authors";
import { useCategories } from "@/lib/admin/queries/use-categories";
import { useMedias } from "@/lib/admin/queries/use-medias";

type BadgeKey =
  | "drafts"
  | "unread"
  | "users"
  | "authors"
  | "categories"
  | "medias";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badgeKey?: BadgeKey;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    group: "Pilotage",
    items: [
      { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
    ],
  },
  {
    group: "Contenu",
    items: [
      {
        href: "/admin/articles",
        label: "Articles",
        icon: Newspaper,
        badgeKey: "drafts",
      },
      {
        href: "/admin/categories",
        label: "Catégories",
        icon: FolderClosed,
        badgeKey: "categories",
      },
      {
        href: "/admin/auteurs",
        label: "Auteurs",
        icon: PenLine,
        badgeKey: "authors",
      },
      {
        href: "/admin/medias",
        label: "Médiathèque",
        icon: ImageIcon,
        badgeKey: "medias",
      },
    ],
  },
  {
    group: "Communauté",
    items: [
      {
        href: "/admin/contacts",
        label: "Messages",
        icon: Mail,
        badgeKey: "unread",
      },
      {
        href: "/admin/utilisateurs",
        label: "Utilisateurs",
        icon: Users,
        badgeKey: "users",
      },
    ],
  },
];

type Badges = Partial<Record<BadgeKey, number>>;

function BrandHeader() {
  return (
    <div className="adm-side__brand">
      <Link href="/admin" className="adm-side__logo">
        Maison<b>·</b>Calorie
      </Link>
      <span className="adm-side__badge">ADMIN</span>
    </div>
  );
}

function NavGroups({
  pathname,
  badges,
  onNavigate,
}: {
  pathname: string;
  badges: Badges;
  onNavigate?: () => void;
}) {
  return (
    <nav className="adm-side__nav">
      {NAV_GROUPS.map((g) => (
        <div key={g.group}>
          <div className="adm-side__group">{g.group}</div>
          {g.items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const badgeValue =
              item.badgeKey !== undefined ? badges[item.badgeKey] : undefined;
            const showBadge =
              typeof badgeValue === "number" && badgeValue > 0
                ? badgeValue
                : undefined;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn("adm-nav", active && "is-active")}
              >
                <Icon className="icn" />
                <span>{item.label}</span>
                {showBadge !== undefined ? (
                  <span className="adm-nav__count">{showBadge}</span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function UserFooter() {
  return (
    <div className="adm-side__user">
      <div
        className="adm-side__avatar"
        style={{
          backgroundImage: "url(https://i.pravatar.cc/64?img=12)",
        }}
        aria-hidden
      />
      <div className="min-w-0">
        <div className="truncate text-[13px] font-semibold text-[var(--color-paper)]">
          Imad Benali
        </div>
        <div className="font-mono text-[10px] text-white/50">scope: admin</div>
      </div>
      <button
        type="button"
        className="abtn abtn--ghost abtn--icon border-white/20 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
        title="Déconnexion (Kinde)"
        aria-label="Déconnexion"
      >
        <LogOut className="icn" />
      </button>
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const drafts = useArticles({ status: "draft" });
  const unread = useContacts({ status: "unread" });
  const users = useUsers();
  const authors = useAuthors();
  const categories = useCategories();
  const medias = useMedias();

  const badges: Badges = {
    drafts: drafts.data?.total,
    unread: unread.data?.length,
    users: users.data?.length,
    authors: authors.data?.length,
    categories: categories.data?.length,
    medias: medias.data?.length,
  };

  const sideClass =
    "sticky top-0 hidden h-screen flex-col border-r border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] lg:flex";

  return (
    <>
      <aside className={sideClass}>
        <BrandHeader />
        <NavGroups pathname={pathname} badges={badges} />
        <UserFooter />
      </aside>
      <Sheet open={mobileOpen} onOpenChange={(v) => !v && onMobileClose()}>
        <SheetContent
          side="left"
          className="w-72 border-r border-[var(--color-ink)] bg-[var(--color-ink)] p-0 text-[var(--color-paper)]"
        >
          <SheetTitle className="sr-only">Menu administration</SheetTitle>
          <div className="flex h-full flex-col">
            <BrandHeader />
            <NavGroups
              pathname={pathname}
              badges={badges}
              onNavigate={onMobileClose}
            />
            <UserFooter />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
