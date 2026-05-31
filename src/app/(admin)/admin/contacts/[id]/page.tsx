"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import {
  Archive,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MailOpen,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

import { PageHeader } from "@/components/admin/shell/page-header";
import { StatusBadge } from "@/components/admin/feedback/status-badge";
import { ConfirmDialog } from "@/components/admin/feedback/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useContact,
  useMarkArchived,
  useMarkHandled,
  useMarkUnread,
  useRemoveContact,
} from "@/lib/admin/queries/use-contacts";
import { useUsers } from "@/lib/admin/queries/use-users";
import type { ID } from "@/lib/admin/types";

function relative(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: fr });
  } catch {
    return iso;
  }
}

function absolute(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/** Same heuristic used on the list view — derives a "reason" / motif tag
 * from the subject line until the model gets a real field. */
function reasonFromSubject(subject: string): string {
  const head = subject.split(":")[0]?.trim();
  if (!head || head.length === 0 || head.length > 24) return "Contact";
  return head;
}

export default function AdminContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: contact, isLoading } = useContact(id);

  const adminsQuery = useUsers({ role: "admin" });
  const admins = adminsQuery.data ?? [];
  const adminUserId: ID = admins[0]?.id ?? "usr_unknown_admin";

  let handledBy: string | null = null;
  if (contact?.handledByUserId) {
    const user = admins.find((u) => u.id === contact.handledByUserId);
    if (user) {
      handledBy = `${user.firstName} ${user.lastName}`.trim() || user.email;
    }
  }

  const markHandled = useMarkHandled();
  const markUnread = useMarkUnread();
  const markArchived = useMarkArchived();
  const removeContact = useRemoveContact();

  const [confirmDelete, setConfirmDelete] = React.useState(false);

  if (isLoading) {
    return (
      <>
        <PageHeader
          breadcrumb={[
            { label: "Contacts", href: "/admin/contacts" },
            { label: "Chargement…" },
          ]}
          title="Chargement…"
        />
        <div className="grid gap-[18px] lg:grid-cols-[1fr_280px]">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </>
    );
  }

  if (!contact) {
    notFound();
  }

  const onCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      toast.success("Email copié");
    } catch {
      toast.error("Impossible de copier");
    }
  };

  const onConfirmDelete = async () => {
    await removeContact.mutateAsync(contact.id);
    setConfirmDelete(false);
    window.history.back();
  };

  const mailtoHref = `mailto:${contact.email}?subject=${encodeURIComponent("Re: " + contact.subject)}`;
  const reason = reasonFromSubject(contact.subject);

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Contacts", href: "/admin/contacts" },
          { label: contact.subject },
        ]}
        title={contact.subject}
        subtitle={`${contact.name} — ${contact.email}`}
      />

      <div className="grid items-start gap-[18px] lg:grid-cols-[1fr_280px]">
        {/* Main */}
        <div className="flex flex-col gap-[16px]">
          {/* Message card */}
          <div className="adm-card">
            <div className="adm-card__head">
              <div className="adm-card__title">Message</div>
              <div className="flex items-center gap-2">
                <span className="scope-tag">{reason}</span>
                <StatusBadge status={contact.status} />
                <span
                  className="font-mono text-[11px] text-ink-mute"
                  title={absolute(contact.createdAt)}
                >
                  {relative(contact.createdAt)}
                </span>
              </div>
            </div>
            <div className="adm-card__body">
              <div className="rounded-lg border border-paper-line bg-paper-2 p-4 text-[14.5px] leading-relaxed whitespace-pre-wrap text-ink-2">
                {contact.message}
              </div>
            </div>
          </div>

          {/* Metadata card */}
          <div className="adm-card">
            <div className="adm-card__head">
              <div className="adm-card__title">Métadonnées</div>
            </div>
            <div className="adm-card__body">
              <dl className="grid grid-cols-[140px_1fr] gap-y-3 text-[13.5px]">
                <dt className="text-ink-mute">Nom</dt>
                <dd className="text-ink">{contact.name}</dd>

                <dt className="text-ink-mute">Email</dt>
                <dd className="font-mono text-[12px] text-ink">
                  {contact.email}
                </dd>

                <dt className="text-ink-mute">Reçu</dt>
                <dd
                  className="font-mono text-[12px] text-ink"
                  title={absolute(contact.createdAt)}
                >
                  {absolute(contact.createdAt)}
                </dd>

                {contact.handledAt ? (
                  <>
                    <dt className="text-ink-mute">Traité</dt>
                    <dd
                      className="font-mono text-[12px] text-ink"
                      title={absolute(contact.handledAt)}
                    >
                      {absolute(contact.handledAt)} (
                      {relative(contact.handledAt)})
                    </dd>
                  </>
                ) : null}

                {handledBy ? (
                  <>
                    <dt className="text-ink-mute">Traité par</dt>
                    <dd className="text-ink">{handledBy}</dd>
                  </>
                ) : null}

                <dt className="text-ink-mute">Statut</dt>
                <dd>
                  <StatusBadge status={contact.status} />
                </dd>

                <dt className="text-ink-mute">Motif</dt>
                <dd>
                  <span className="scope-tag">{reason}</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Sidebar — actions */}
        <aside className="grid grid-cols-1 gap-[16px] lg:sticky lg:top-20 lg:self-start">
          <div className="adm-card">
            <div className="adm-card__head">
              <div className="adm-card__title">Actions</div>
            </div>
            <div className="adm-card__body flex flex-col gap-2">
              {contact.status !== "handled" ? (
                <button
                  type="button"
                  className="abtn abtn--primary w-full justify-center"
                  onClick={() =>
                    markHandled.mutate({
                      id: contact.id,
                      byUserId: adminUserId,
                    })
                  }
                  disabled={markHandled.isPending}
                >
                  <Check className="size-4" />
                  Marquer traité
                </button>
              ) : (
                <button
                  type="button"
                  className="abtn w-full justify-center"
                  onClick={() => markUnread.mutate(contact.id)}
                  disabled={markUnread.isPending}
                >
                  <MailOpen className="size-4" />
                  Marquer non lu
                </button>
              )}

              <button
                type="button"
                className="abtn w-full justify-center"
                onClick={() => markArchived.mutate(contact.id)}
                disabled={
                  contact.status === "archived" || markArchived.isPending
                }
              >
                <Archive className="size-4" />
                Archiver
              </button>

              <button
                type="button"
                className="abtn abtn--danger w-full justify-center"
                onClick={() => setConfirmDelete(true)}
                disabled={removeContact.isPending}
              >
                <Trash2 className="size-4" />
                Supprimer
              </button>

              <div className="my-1 h-px bg-paper-line" />

              <button
                type="button"
                className="abtn abtn--ghost w-full justify-center"
                onClick={onCopyEmail}
              >
                <Copy className="size-4" />
                Copier l&apos;email
              </button>

              <Link
                href={mailtoHref}
                className="abtn abtn--ghost w-full justify-center"
              >
                <Mail className="size-4" />
                Ouvrir mailto
                <ExternalLink className="ml-auto size-3 opacity-60" />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Supprimer ce message ?"
        description={`Le message « ${contact.subject} » sera définitivement supprimé.`}
        confirmLabel="Supprimer"
        confirmVariant="destructive"
        onConfirm={onConfirmDelete}
      />
    </>
  );
}
