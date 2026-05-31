"use client";

import { notFound, useParams } from "next/navigation";

import { PageHeader } from "@/components/admin/shell/page-header";
import { AuthorForm } from "@/components/admin/forms/author-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthor } from "@/lib/admin/queries/use-authors";

export default function EditAuthorPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const { data, isLoading, isFetched } = useAuthor(id);

  if (isFetched && data === null) {
    notFound();
  }

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Auteurs", href: "/admin/auteurs" },
          { label: data ? data.name : "Édition" },
        ]}
        title={data ? data.name : "Édition"}
        subtitle={data ? data.slug : undefined}
      />
      {isLoading || !data ? (
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      ) : (
        <AuthorForm mode="edit" initial={data} />
      )}
    </>
  );
}
