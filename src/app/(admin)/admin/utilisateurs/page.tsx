"use client";

import * as React from "react";
import Link from "next/link";
import { parseISO } from "date-fns";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { fr } from "date-fns/locale/fr";
import { Pencil, Trash2, UserCheck, UserX, Users } from "lucide-react";

import { PageHeader } from "@/components/admin/shell/page-header";
import { DataTableToolbar } from "@/components/admin/data/data-table-toolbar";
import { RowActions } from "@/components/admin/data/row-actions";
import { EmptyState } from "@/components/admin/feedback/empty-state";
import { StatusBadge } from "@/components/admin/feedback/status-badge";
import { ConfirmDialog } from "@/components/admin/feedback/confirm-dialog";
import {
  useUsers,
  useRemoveUser,
  useUpdateUser,
} from "@/lib/admin/queries/use-users";
import { useTableFilters } from "@/lib/admin/use-table-filters";
import type { User, UserRole, UserStatus } from "@/lib/admin/types";

type RoleFilter = UserRole | "all";

type FilterShape = {
  q: string;
  role: RoleFilter;
};

const FILTER_DEFAULTS: FilterShape = {
  q: "",
  role: "all",
};

const ROLE_TABS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "admin", label: "Admins" },
  { value: "editor", label: "Éditeurs" },
  { value: "reader", label: "Lecteurs" },
];

const ROLE_LABEL: Record<UserRole, string> = {
  admin: "admin",
  editor: "editor",
  reader: "reader",
};

function initialsOf(user: User): string {
  const first = user.firstName.trim().charAt(0);
  const last = user.lastName.trim().charAt(0);
  const combined = `${first}${last}`.toUpperCase();
  if (combined.length > 0) return combined;
  const fromEmail = user.email.trim().charAt(0).toUpperCase();
  return fromEmail || "?";
}

function formatRelative(iso: string | null): string {
  if (!iso) return "Jamais";
  try {
    return formatDistanceToNow(parseISO(iso), {
      addSuffix: true,
      locale: fr,
    });
  } catch {
    return iso;
  }
}

export default function AdminUsersPage() {
  // useTableFilters reads `useSearchParams`, which forces a CSR bailout
  // on this page. Wrapping the content in Suspense satisfies Next 16's
  // prerender requirements.
  return (
    <React.Suspense fallback={<UsersPageFallback />}>
      <UsersPageContent />
    </React.Suspense>
  );
}

function UsersPageFallback() {
  return (
    <>
      <PageHeader
        title="Utilisateurs"
        subtitle={
          <>
            Comptes gérés par Kinde. Les rôles (scopes) déterminent l&apos;accès
            au back-office. Seul le scope{" "}
            <code className="font-mono text-signal">admin</code> accède à cet
            espace.
          </>
        }
        actions={
          <Link href="/admin/utilisateurs/new" className="abtn abtn--primary">
            + Inviter un utilisateur
          </Link>
        }
      />
      <div className="adm-card overflow-hidden">
        <table className="adm-table">
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx}>
                <td colSpan={5}>
                  <div className="h-4 w-full max-w-[260px] animate-pulse rounded bg-paper-2" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function UsersPageContent() {
  const { filters, setFilters, reset } =
    useTableFilters<FilterShape>(FILTER_DEFAULTS);

  const list = useUsers({
    q: filters.q || undefined,
    role: filters.role,
  });
  const remove = useRemoveUser();
  const update = useUpdateUser();

  const [pendingDelete, setPendingDelete] = React.useState<User | null>(null);

  const handleAskDelete = React.useCallback((user: User) => {
    setPendingDelete(user);
  }, []);

  const handleConfirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
    } finally {
      setPendingDelete(null);
    }
  }, [pendingDelete, remove]);

  const handleToggleStatus = React.useCallback(
    (user: User) => {
      const nextStatus: UserStatus =
        user.status === "active" ? "suspended" : "active";
      update.mutate({ id: user.id, patch: { status: nextStatus } });
    },
    [update],
  );

  const items = list.data ?? [];
  const total = items.length;
  const hasActiveFilters =
    filters.q !== FILTER_DEFAULTS.q || filters.role !== FILTER_DEFAULTS.role;
  const isEmptyUnfiltered =
    !list.isLoading && !hasActiveFilters && items.length === 0;

  const subtitle = (
    <>
      Comptes gérés par Kinde. Les rôles (scopes) déterminent l&apos;accès au
      back-office. Seul le scope{" "}
      <code className="font-mono text-signal">admin</code> accède à cet espace.
    </>
  );

  return (
    <>
      <PageHeader
        title="Utilisateurs"
        subtitle={subtitle}
        actions={
          <Link href="/admin/utilisateurs/new" className="abtn abtn--primary">
            + Inviter un utilisateur
          </Link>
        }
      />

      {isEmptyUnfiltered ? (
        <EmptyState
          icon={Users}
          title="Aucun utilisateur"
          description="Créez votre premier compte pour donner accès au back-office."
          cta={{
            label: "Nouvel utilisateur",
            href: "/admin/utilisateurs/new",
          }}
        />
      ) : (
        <>
          <DataTableToolbar
            searchValue={filters.q}
            searchPlaceholder="Rechercher par nom ou email…"
            onSearchChange={(value) => setFilters({ q: value })}
            hasActiveFilters={hasActiveFilters}
            onReset={reset}
            count={`${total} compte${total > 1 ? "s" : ""}`}
          >
            <div className="adm-seg">
              {ROLE_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  className={filters.role === tab.value ? "is-active" : ""}
                  onClick={() => setFilters({ role: tab.value })}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </DataTableToolbar>

          <div className="adm-card overflow-hidden">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôles (scopes)</th>
                  <th>Statut</th>
                  <th>Dernière activité</th>
                  <th style={{ width: 110 }}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`}>
                      {Array.from({ length: 5 }).map((__, cidx) => (
                        <td key={cidx}>
                          <div className="h-3.5 w-full max-w-[180px] animate-pulse rounded bg-paper-2" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div className="adm-empty">
                        <Users className="adm-empty__icn" />
                        <div className="font-semibold text-ink-3">
                          Aucun résultat
                        </div>
                        <div className="text-[13px]" style={{ marginTop: 4 }}>
                          Aucun utilisateur ne correspond à vos filtres.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((user) => {
                    const suspended = user.status === "suspended";
                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="adm-userchip">
                            <div
                              className="adm-userchip__av flex items-center justify-center font-semibold text-ink-mute"
                              aria-hidden="true"
                            >
                              <span className="text-[11px]">
                                {initialsOf(user)}
                              </span>
                            </div>
                            <div>
                              <Link
                                href={`/admin/utilisateurs/${user.id}`}
                                className="adm-table__title hover:underline"
                              >
                                {user.firstName} {user.lastName}
                              </Link>
                              <div className="adm-table__sub">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={
                              user.role === "admin"
                                ? "scope-tag admin"
                                : "scope-tag"
                            }
                          >
                            {ROLE_LABEL[user.role]}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="font-mono text-[11.5px] text-ink-mute whitespace-nowrap">
                          {formatRelative(user.lastLoginAt)}
                        </td>
                        <td onClick={(event) => event.stopPropagation()}>
                          <RowActions
                            ariaLabel={`Actions pour ${user.firstName} ${user.lastName}`}
                            items={[
                              {
                                label: "Éditer",
                                icon: Pencil,
                                href: `/admin/utilisateurs/${user.id}`,
                              },
                              {
                                label: suspended ? "Réactiver" : "Suspendre",
                                icon: suspended ? UserCheck : UserX,
                                onClick: () => handleToggleStatus(user),
                                disabled: update.isPending,
                              },
                              {
                                label: "Supprimer",
                                icon: Trash2,
                                destructive: true,
                                onClick: () => handleAskDelete(user),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
        title="Supprimer cet utilisateur ?"
        description={
          pendingDelete ? (
            <>
              Le compte de{" "}
              <strong className="text-foreground">
                {pendingDelete.firstName} {pendingDelete.lastName}
              </strong>{" "}
              ({pendingDelete.email}) sera définitivement supprimé. Cette action
              est irréversible.
            </>
          ) : (
            "Cette action est irréversible."
          )
        }
        confirmLabel="Supprimer"
        confirmVariant="destructive"
        typeToConfirm={pendingDelete?.email}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
