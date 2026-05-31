"use client";

import * as React from "react";
import Link from "next/link";
import { Download, Eye, MessageSquare, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { RowSelectionState } from "@tanstack/react-table";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/shell/page-header";
import { DataTableToolbar } from "@/components/admin/data/data-table-toolbar";
import { BulkActionsBar } from "@/components/admin/data/bulk-actions-bar";
import { RowActions } from "@/components/admin/data/row-actions";
import { ConfirmDialog } from "@/components/admin/feedback/confirm-dialog";
import {
  useContacts,
  useMarkArchived,
  useMarkHandled,
  useRemoveContact,
} from "@/lib/admin/queries/use-contacts";
import { useUsers } from "@/lib/admin/queries/use-users";
import { useTableFilters } from "@/lib/admin/use-table-filters";
import type { ContactSubmission, ID } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const TAB_VALUES = ["all", "unread", "handled", "archived"] as const;
type TabValue = (typeof TAB_VALUES)[number];

const TAB_LABELS: Record<TabValue, string> = {
  all: "Tous",
  unread: "Non lus",
  handled: "Traités",
  archived: "Archivés",
};

function isTabValue(value: string | undefined): value is TabValue {
  return TAB_VALUES.includes((value ?? "") as TabValue);
}

function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return `${input.slice(0, max - 1).trimEnd()}…`;
}

function relativeDate(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), {
      addSuffix: true,
      locale: fr,
    });
  } catch {
    return iso;
  }
}

/** Reason heuristic: take everything before the first ":" in the subject,
 * fallback to "Contact" when the subject has no separator. The current data
 * model has no dedicated "reason" field, so this is a pragmatic stand-in. */
function reasonFromSubject(subject: string): string {
  const head = subject.split(":")[0]?.trim();
  if (!head || head.length === 0 || head.length > 24) return "Contact";
  return head;
}

const DEFAULT_FILTERS = { tab: "unread" as TabValue, q: "" };

export default function AdminContactsPage() {
  return (
    <React.Suspense fallback={<ContactsPageFallback />}>
      <AdminContactsPageInner />
    </React.Suspense>
  );
}

function ContactsPageFallback() {
  return (
    <>
      <PageHeader
        title="Messages de contact"
        subtitle="Demandes reçues via le formulaire du site."
      />
      <div className="adm-card overflow-hidden">
        <table className="adm-table">
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx}>
                <td colSpan={6}>
                  <div className="h-4 w-full max-w-[280px] animate-pulse rounded bg-paper-2" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminContactsPageInner() {
  const { filters, setFilters, reset } = useTableFilters(DEFAULT_FILTERS);
  const activeTab: TabValue = isTabValue(filters.tab) ? filters.tab : "unread";

  const list = useContacts({
    status: activeTab,
    q: filters.q || undefined,
    sort: "newest",
  });
  // Separate query for the "unread" count badge in the subtitle —
  // independent of the active tab.
  const unreadList = useContacts({ status: "unread" });

  const adminsQuery = useUsers({ role: "admin" });
  const adminUserId: ID = React.useMemo(() => {
    const admins = adminsQuery.data ?? [];
    return admins[0]?.id ?? "usr_unknown_admin";
  }, [adminsQuery.data]);

  const markHandled = useMarkHandled();
  const markArchived = useMarkArchived();
  const removeContact = useRemoveContact();

  const [selection, setSelection] = React.useState<RowSelectionState>({});
  const [confirmBulkDelete, setConfirmBulkDelete] = React.useState(false);
  const [pendingDelete, setPendingDelete] =
    React.useState<ContactSubmission | null>(null);

  const data = React.useMemo(() => list.data ?? [], [list.data]);
  const total = data.length;
  const unreadCount = unreadList.data?.length ?? 0;
  const selectedIds = React.useMemo(
    () =>
      Object.entries(selection)
        .filter(([, selected]) => selected)
        .map(([id]) => id),
    [selection],
  );

  const hasActiveFilters = filters.q.length > 0;

  const onSearchChange = (value: string) => {
    setFilters({ q: value });
  };

  const onTabChange = (next: TabValue) => {
    setFilters({ tab: next });
    setSelection({});
  };

  const runBulkHandled = async () => {
    if (selectedIds.length === 0) return;
    await Promise.all(
      selectedIds.map((id) =>
        markHandled.mutateAsync({ id, byUserId: adminUserId }),
      ),
    );
    setSelection({});
  };

  const runBulkArchive = async () => {
    if (selectedIds.length === 0) return;
    await Promise.all(selectedIds.map((id) => markArchived.mutateAsync(id)));
    setSelection({});
  };

  const runBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    await Promise.all(selectedIds.map((id) => removeContact.mutateAsync(id)));
    setSelection({});
    setConfirmBulkDelete(false);
  };

  const handleAskDelete = React.useCallback((row: ContactSubmission) => {
    setPendingDelete(row);
  }, []);

  const handleConfirmDelete = React.useCallback(async () => {
    if (!pendingDelete) return;
    try {
      await removeContact.mutateAsync(pendingDelete.id);
    } finally {
      setPendingDelete(null);
    }
  }, [pendingDelete, removeContact]);

  const allSelected = data.length > 0 && data.every((row) => selection[row.id]);
  const someSelected = data.some((row) => selection[row.id]);
  const toggleAll = (checked: boolean) => {
    if (!checked) {
      setSelection({});
      return;
    }
    const next: RowSelectionState = { ...selection };
    for (const row of data) next[row.id] = true;
    setSelection(next);
  };
  const toggleRow = (id: string, checked: boolean) => {
    setSelection((prev) => {
      const next = { ...prev };
      if (checked) next[id] = true;
      else delete next[id];
      return next;
    });
  };

  const emptyTitle =
    activeTab === "unread"
      ? "Boîte vide"
      : activeTab === "handled"
        ? "Aucun message traité"
        : activeTab === "archived"
          ? "Aucun archive"
          : "Aucun message";
  const emptyDescription =
    activeTab === "unread"
      ? "Tout est traité. Profitez-en pour publier un article."
      : activeTab === "handled"
        ? "Aucun message traité pour le moment."
        : activeTab === "archived"
          ? "Aucun message archivé."
          : "Aucun message à afficher.";

  const subtitle =
    unreadCount > 0
      ? `${unreadCount} nouveau${unreadCount > 1 ? "x" : ""} message${unreadCount > 1 ? "s" : ""} à traiter.`
      : "Aucun nouveau message. Tout est sous contrôle.";

  return (
    <>
      <PageHeader
        title="Messages de contact"
        subtitle={subtitle}
        actions={
          <button
            type="button"
            className="abtn abtn--ghost"
            onClick={() => toast("Export CSV — à venir")}
          >
            <Download className="size-3.5" />
            Exporter
          </button>
        }
      />

      <DataTableToolbar
        searchValue={filters.q}
        searchPlaceholder="Rechercher dans les sujets, messages…"
        onSearchChange={onSearchChange}
        hasActiveFilters={hasActiveFilters}
        onReset={reset}
        count={`${total} message${total > 1 ? "s" : ""}`}
      >
        <div className="adm-seg">
          {TAB_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              className={activeTab === value ? "is-active" : ""}
              onClick={() => onTabChange(value)}
            >
              {TAB_LABELS[value]}
            </button>
          ))}
        </div>
      </DataTableToolbar>

      <BulkActionsBar
        selectedCount={selectedIds.length}
        onClear={() => setSelection({})}
        itemLabel={{ singular: "message", plural: "messages" }}
        actions={[
          {
            label: "Marquer traités",
            icon: MessageSquare,
            onClick: () => {
              void runBulkHandled();
            },
            disabled: markHandled.isPending,
          },
          {
            label: "Archiver",
            icon: Eye,
            onClick: () => {
              void runBulkArchive();
            },
            disabled: markArchived.isPending,
          },
          {
            label: "Supprimer",
            icon: Trash2,
            variant: "destructive",
            onClick: () => setConfirmBulkDelete(true),
            disabled: removeContact.isPending,
          },
        ]}
      />

      <div className="adm-card overflow-hidden">
        <table className="adm-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <CheckBox
                  ariaLabel="Tout sélectionner"
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  onChange={toggleAll}
                />
              </th>
              <th style={{ width: 24 }}>
                <span className="sr-only">Statut</span>
              </th>
              <th>Expéditeur</th>
              <th>Motif</th>
              <th>Sujet</th>
              <th>Date</th>
              <th style={{ width: 110 }}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {list.isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`}>
                  {Array.from({ length: 7 }).map((__, cidx) => (
                    <td key={cidx}>
                      <div className="h-3.5 w-full max-w-[200px] animate-pulse rounded bg-paper-2" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 0 }}>
                  <div className="adm-empty">
                    <MessageSquare className="adm-empty__icn" />
                    <div className="font-semibold text-ink-3">{emptyTitle}</div>
                    <div className="text-[13px]" style={{ marginTop: 4 }}>
                      {emptyDescription}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const unread = row.status === "unread";
                const isSelected = !!selection[row.id];
                const reason = reasonFromSubject(row.subject);
                return (
                  <tr key={row.id} className={cn(isSelected && "is-selected")}>
                    <td>
                      <CheckBox
                        ariaLabel={`Sélectionner le message de ${row.name}`}
                        checked={isSelected}
                        onChange={(checked) => toggleRow(row.id, checked)}
                      />
                    </td>
                    <td>
                      {unread ? (
                        <span
                          className="adm-dot"
                          style={{ background: "var(--color-signal)" }}
                          aria-label="Non lu"
                          title="Non lu"
                        />
                      ) : null}
                    </td>
                    <td>
                      <Link
                        href={`/admin/contacts/${row.id}`}
                        className="block hover:text-[var(--color-signal)]"
                      >
                        <div
                          className={cn(
                            "adm-table__title",
                            !unread && "font-medium",
                          )}
                          style={{ fontWeight: unread ? 700 : 500 }}
                        >
                          {row.name}
                        </div>
                        <div className="adm-table__sub">{row.email}</div>
                      </Link>
                    </td>
                    <td>
                      <span className="scope-tag">{reason}</span>
                    </td>
                    <td
                      className={cn(
                        "max-w-[300px] truncate text-[13px]",
                        unread
                          ? "font-medium text-ink"
                          : "font-normal text-ink-3",
                      )}
                      title={row.subject}
                    >
                      <Link
                        href={`/admin/contacts/${row.id}`}
                        className="block hover:underline"
                      >
                        {truncate(row.subject, 60)}
                      </Link>
                    </td>
                    <td className="font-mono text-[11px] text-ink-mute whitespace-nowrap">
                      {relativeDate(row.createdAt)}
                    </td>
                    <td onClick={(event) => event.stopPropagation()}>
                      <RowActions
                        ariaLabel={`Actions pour le message de ${row.name}`}
                        items={[
                          {
                            label: "Lire",
                            icon: Eye,
                            href: `/admin/contacts/${row.id}`,
                          },
                          {
                            label: "Supprimer",
                            icon: Trash2,
                            destructive: true,
                            onClick: () => handleAskDelete(row),
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

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
        title="Supprimer ce message ?"
        description={
          pendingDelete ? (
            <>
              Le message de{" "}
              <strong className="text-foreground">{pendingDelete.name}</strong>{" "}
              sera définitivement supprimé.
            </>
          ) : (
            "Cette action est irréversible."
          )
        }
        confirmLabel="Supprimer"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDialog
        open={confirmBulkDelete}
        onOpenChange={setConfirmBulkDelete}
        title={`Supprimer ${selectedIds.length} message${selectedIds.length > 1 ? "s" : ""} ?`}
        description="Cette action est définitive. Les messages sélectionnés seront retirés de la boîte."
        confirmLabel="Supprimer"
        confirmVariant="destructive"
        onConfirm={runBulkDelete}
      />
    </>
  );
}

type CheckBoxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
  indeterminate?: boolean;
};

/** Native-styled checkbox matching the `.adm-check` design language. */
function CheckBox({
  checked,
  onChange,
  ariaLabel,
  indeterminate = false,
}: CheckBoxProps) {
  const isOn = checked || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
      className={cn("adm-check", isOn && "is-on")}
    />
  );
}
