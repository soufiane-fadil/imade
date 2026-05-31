"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  FileEdit,
  Image as ImageIcon,
  Mail,
  Newspaper,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/admin/shell/page-header";
import { StatCard } from "@/components/admin/kpi/stat-card";
import { useArticles } from "@/lib/admin/queries/use-articles";
import { useContacts } from "@/lib/admin/queries/use-contacts";
import { useUsers } from "@/lib/admin/queries/use-users";
import { useMedias } from "@/lib/admin/queries/use-medias";
import { useCategories } from "@/lib/admin/queries/use-categories";
import { useAuthors } from "@/lib/admin/queries/use-authors";
import type { Article } from "@/lib/admin/types";

const ARTICLE_STATUS_BADGE: Record<string, [string, string]> = {
  published: ["adm-badge--pub", "Publié"],
  draft: ["adm-badge--draft", "Brouillon"],
  archived: ["adm-badge--draft", "Archivé"],
};

function StatusBadge({ status }: { status: string }) {
  const [cls, label] = ARTICLE_STATUS_BADGE[status] ?? [
    "adm-badge--draft",
    status,
  ];
  return <span className={`adm-badge ${cls}`}>{label}</span>;
}

function TodoLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-[var(--color-paper-line)] px-[14px] py-3 text-[13.5px] font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] hover:bg-[var(--color-paper-2)]"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-[7px] bg-[var(--color-paper-2)] text-[var(--color-signal)]">
        <Icon className="size-4" />
      </span>
      <span className="flex-1">{label}</span>
      <ChevronRight className="size-4 text-[var(--color-ink-mute)]" />
    </Link>
  );
}

function RecentRow({
  article,
  categoryName,
  authorName,
}: {
  article: Article;
  categoryName: string;
  authorName: string;
}) {
  return (
    <tr>
      <td style={{ width: "60%" }}>
        <Link href={`/admin/articles/${article.id}`} className="block">
          <div className="adm-table__title">{article.title}</div>
          <div className="adm-table__sub">
            {categoryName} · {authorName}
          </div>
        </Link>
      </td>
      <td>
        <StatusBadge status={article.status} />
      </td>
      <td
        style={{
          textAlign: "right",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--color-ink-mute)",
        }}
      >
        —
      </td>
    </tr>
  );
}

export default function AdminDashboardPage() {
  const published = useArticles({ status: "published" });
  const drafts = useArticles({ status: "draft" });
  const unread = useContacts({ status: "unread" });
  const allUsers = useUsers();
  const medias = useMedias();
  const categories = useCategories();
  const authors = useAuthors();
  const recent = useArticles({ sort: "newest", pageSize: 5 });

  const publishedCount = published.data?.total ?? 0;
  const draftCount = drafts.data?.total ?? 0;
  const unreadCount = unread.data?.length ?? 0;
  const suspendedCount = (allUsers.data ?? []).filter(
    (u) => u.status === "suspended",
  ).length;
  const totalMediasCount = medias.data?.length ?? 0;

  const catById = React.useMemo(() => {
    const m = new Map<string, string>();
    (categories.data ?? []).forEach((c) => m.set(c.id, c.name));
    return m;
  }, [categories.data]);

  const authorById = React.useMemo(() => {
    const m = new Map<string, string>();
    (authors.data ?? []).forEach((a) => m.set(a.id, a.name));
    return m;
  }, [authors.data]);

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle="Bonjour Imad. Voici l'activité de Maison·Calorie aujourd'hui."
        actions={
          <Link href="/admin/articles/new" className="abtn abtn--primary">
            <Plus className="size-4" />
            Nouvel article
          </Link>
        }
      />

      <div className="mb-4 font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-mute)]">
        Données locales — auth Kinde / API à brancher
      </div>

      <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Articles publiés"
          value={publishedCount}
          href="/admin/articles?status=published"
          icon={Newspaper}
          delta={publishedCount > 0 ? `${publishedCount} en ligne` : "—"}
          deltaDirection="up"
        />
        <StatCard
          label="Vues (30 j)"
          value="—"
          icon={FileEdit}
          delta="Mesure à brancher"
          deltaDirection="up"
        />
        <StatCard
          label="Messages en attente"
          value={unreadCount}
          href="/admin/contacts?status=unread"
          icon={Mail}
          accent="signal"
          delta={unreadCount > 0 ? "À traiter" : "Boîte vide"}
          deltaDirection={unreadCount > 0 ? "down" : "up"}
        />
        <StatCard
          label="Brouillons"
          value={draftCount}
          href="/admin/articles?status=draft"
          icon={FileEdit}
          delta={
            draftCount > 0
              ? `${draftCount} prêt${draftCount > 1 ? "s" : ""} à relire`
              : "Aucun brouillon"
          }
          deltaDirection="up"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="adm-card">
          <div className="adm-card__head">
            <div className="adm-card__title">Articles récents</div>
            <Link href="/admin/articles" className="abtn abtn--ghost abtn--sm">
              Tout voir
              <ChevronRight className="size-3" />
            </Link>
          </div>
          {recent.data && recent.data.items.length > 0 ? (
            <table className="adm-table">
              <tbody>
                {recent.data.items.slice(0, 5).map((a) => (
                  <RecentRow
                    key={a.id}
                    article={a}
                    categoryName={catById.get(a.categoryId) ?? "—"}
                    authorName={authorById.get(a.authorId) ?? "—"}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="adm-card__body text-center text-[13px] text-[var(--color-ink-mute)]">
              Aucun article pour le moment.
            </div>
          )}
        </div>

        <div className="adm-card">
          <div className="adm-card__head">
            <div className="adm-card__title">À traiter</div>
          </div>
          <div className="adm-card__body grid gap-[10px]">
            <TodoLink
              href="/admin/contacts?status=unread"
              icon={Mail}
              label={`${unreadCount} nouveau${
                unreadCount > 1 ? "x" : ""
              } message${unreadCount > 1 ? "s" : ""} de contact`}
            />
            <TodoLink
              href="/admin/articles?status=draft"
              icon={FileEdit}
              label={`${draftCount} brouillon${
                draftCount > 1 ? "s" : ""
              } prêt${draftCount > 1 ? "s" : ""} à publier`}
            />
            <TodoLink
              href="/admin/utilisateurs"
              icon={Users}
              label={`${suspendedCount} utilisateur${
                suspendedCount > 1 ? "s" : ""
              } suspendu${suspendedCount > 1 ? "s" : ""}`}
            />
            <TodoLink
              href="/admin/medias"
              icon={ImageIcon}
              label={`${totalMediasCount} média${
                totalMediasCount > 1 ? "s" : ""
              } dans la bibliothèque`}
            />
          </div>
        </div>
      </div>
    </>
  );
}
