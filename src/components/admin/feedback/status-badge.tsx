import { cn } from "@/lib/utils";

type StatusVariant = {
  className: string;
  label: string;
};

const STATUS_MAP: Record<string, StatusVariant> = {
  published: { className: "adm-badge--pub", label: "Publié" },
  draft: { className: "adm-badge--draft", label: "Brouillon" },
  archived: { className: "adm-badge--draft", label: "Archivé" },
  unread: { className: "adm-badge--new", label: "Non lu" },
  handled: { className: "adm-badge--pub", label: "Traité" },
  active: { className: "adm-badge--pub", label: "Actif" },
  suspended: { className: "adm-badge--new", label: "Suspendu" },
  admin: { className: "adm-badge--admin", label: "Admin" },
  editor: { className: "adm-badge--admin", label: "Éditeur" },
  reader: { className: "adm-badge--admin", label: "Lecteur" },
};

type StatusBadgeProps = {
  status: string;
  label?: string;
  className?: string;
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant = STATUS_MAP[status];
  return (
    <span
      className={cn(
        "adm-badge",
        variant?.className ?? "adm-badge--draft",
        className,
      )}
    >
      {label ?? variant?.label ?? status}
    </span>
  );
}
