"use client";

import { notFound, useParams } from "next/navigation";

import { PageHeader } from "@/components/admin/shell/page-header";
import { CategoryForm } from "@/components/admin/forms/category-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategory } from "@/lib/admin/queries/use-categories";

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const { data, isLoading, isFetched } = useCategory(id);

  if (isFetched && data === null) {
    notFound();
  }

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Catégories", href: "/admin/categories" },
          { label: data ? data.name : "Édition" },
        ]}
        title={data ? data.name : "Édition"}
        subtitle={data ? data.slug : undefined}
      />
      {isLoading || !data ? (
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <CategoryForm mode="edit" initial={data} />
      )}
    </>
  );
}
