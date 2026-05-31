"use client";

import { PageHeader } from "@/components/admin/shell/page-header";
import { ArticleForm } from "@/components/admin/forms/article-form";

export default function NewArticlePage() {
  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Articles", href: "/admin/articles" },
          { label: "Nouvel article" },
        ]}
        title="Nouvel article"
        subtitle="Rédigez un nouvel article éditorial."
      />
      <ArticleForm mode="create" />
    </>
  );
}
