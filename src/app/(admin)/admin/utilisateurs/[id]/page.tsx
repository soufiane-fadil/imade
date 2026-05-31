"use client";

import { use } from "react";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/shell/page-header";
import { UserForm } from "@/components/admin/forms/user-form";
import { useUser } from "@/lib/admin/queries/use-users";

export default function AdminUserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: user, isLoading } = useUser(id);

  if (isLoading) {
    return (
      <>
        <PageHeader
          breadcrumb={[
            { label: "Utilisateurs", href: "/admin/utilisateurs" },
            { label: "Chargement…" },
          ]}
          title="Chargement…"
        />
        <div className="mx-auto h-[300px] max-w-2xl animate-pulse rounded-lg bg-muted/60" />
      </>
    );
  }

  if (!user) {
    notFound();
  }

  const displayName =
    `${user.firstName} ${user.lastName}`.trim() || user.email;

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Utilisateurs", href: "/admin/utilisateurs" },
          { label: displayName },
        ]}
        title={displayName}
        subtitle={user.email}
      />
      <UserForm mode="edit" initial={user} />
    </>
  );
}
