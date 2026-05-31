"use client";

import { PageHeader } from "@/components/admin/shell/page-header";
import { AuthorForm } from "@/components/admin/forms/author-form";

export default function NewAuthorPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Auteurs", href: "/admin/auteurs" },
          { label: "Nouvel" },
        ]}
        title="Nouvel auteur"
        subtitle="Ajouter une signature à la rédaction."
      />
      <AuthorForm mode="create" />
    </>
  );
}
