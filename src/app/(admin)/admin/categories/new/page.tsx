"use client";

import { PageHeader } from "@/components/admin/shell/page-header";
import { CategoryForm } from "@/components/admin/forms/category-form";

export default function NewCategoryPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Catégories", href: "/admin/categories" },
          { label: "Nouvelle" },
        ]}
        title="Nouvelle catégorie"
        subtitle="Créer une nouvelle rubrique éditoriale."
      />
      <CategoryForm mode="create" />
    </>
  );
}
