"use client";

import { PageHeader } from "@/components/admin/shell/page-header";
import { UserForm } from "@/components/admin/forms/user-form";

export default function AdminUserCreatePage() {
  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Utilisateurs", href: "/admin/utilisateurs" },
          { label: "Nouveau" },
        ]}
        title="Nouvel utilisateur"
        subtitle="Créer un compte d'accès au back-office."
      />
      <UserForm mode="create" />
    </>
  );
}
