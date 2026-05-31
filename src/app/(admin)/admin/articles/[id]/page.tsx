"use client";

import { use } from "react";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/shell/page-header";
import { ArticleForm } from "@/components/admin/forms/article-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticle } from "@/lib/admin/queries/use-articles";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function EditArticlePage({ params }: PageProps) {
  const { id } = use(params);
  const { data, isLoading, isFetched } = useArticle(id);

  if (isFetched && data === null) {
    notFound();
  }

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Articles", href: "/admin/articles" },
          { label: data ? data.title : "Édition" },
        ]}
        title={data ? data.title : "Édition"}
        subtitle={data ? data.slug : undefined}
      />
      {isLoading || !data ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      ) : (
        <ArticleForm mode="edit" initial={data} />
      )}
    </>
  );
}
