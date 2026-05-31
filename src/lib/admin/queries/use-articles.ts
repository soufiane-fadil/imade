"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdminMutation } from "@/lib/admin/use-admin-mutation";
import { RepositoryError } from "@/lib/errors";

export type ArticleStatus = "draft" | "published" | "archived";

export type ArticleSortKey =
  | "newest"
  | "oldest"
  | "title"
  | "publishedDesc"
  | "publishedAsc";

export type ArticleFilter = {
  q?: string;
  status?: ArticleStatus | "all";
  categoryId?: string;
  authorId?: string;
  sort?: ArticleSortKey;
  page?: number;
  pageSize?: number;
};

export type ArticleDto = {
  id: string;
  title: string;
  slug: string;
  seoExcerpt: string;
  metaDescription: string;
  metaKeywords: string[];
  contentHtml: string;
  coverMediaId: string | null;
  attachedMediaIds: string[];
  readingMinutes: number;
  categoryId: string;
  authorId: string;
  faqs: Array<{ question: string; answer: string }>;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArticleListResult = {
  items: ArticleDto[];
  total: number;
  page: number;
  pageSize: number;
};

export type ArticleCreateInput = Omit<
  ArticleDto,
  "id" | "publishedAt" | "createdAt" | "updatedAt"
>;
export type ArticleUpdatePatch = Partial<ArticleCreateInput>;

const KEY = ["articles"] as const;
const BASE = "/api/admin/articles";

async function parseError(res: Response): Promise<Error> {
  let body: { code?: string; message?: string; details?: unknown } = {};
  try {
    body = await res.json();
  } catch {
    /* ignore */
  }
  if (body.code) {
    return new RepositoryError(
      body.code,
      (body.details as Record<string, unknown>) ?? {},
    );
  }
  return new Error(body.message ?? `HTTP ${res.status}`);
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw await parseError(res);
  return res.json() as Promise<T>;
}

async function sendJson<T>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T | null> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return null;
  return res.json() as Promise<T>;
}

function buildQuery(filter?: ArticleFilter): string {
  if (!filter) return "";
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  if (filter.status) params.set("status", filter.status);
  if (filter.categoryId) params.set("categoryId", filter.categoryId);
  if (filter.authorId) params.set("authorId", filter.authorId);
  if (filter.sort) params.set("sort", filter.sort);
  if (filter.page !== undefined) params.set("page", String(filter.page));
  if (filter.pageSize !== undefined)
    params.set("pageSize", String(filter.pageSize));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useArticles(filter?: ArticleFilter) {
  return useQuery({
    queryKey: [...KEY, "list", filter ?? {}],
    queryFn: () => getJson<ArticleListResult>(`${BASE}${buildQuery(filter)}`),
  });
}

export function useArticle(id: string | undefined) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => getJson<ArticleDto>(`${BASE}/${id}`),
    enabled: !!id,
  });
}

export function useCreateArticle() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (input: ArticleCreateInput) =>
      sendJson<ArticleDto>(BASE, "POST", input).then((a) => a!),
    successMessage: (a) => `Article « ${a.title} » créé`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateArticle() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: ({ id, patch }: { id: string; patch: ArticleUpdatePatch }) =>
      sendJson<ArticleDto>(`${BASE}/${id}`, "PATCH", patch).then((a) => a!),
    successMessage: (a) => `Article « ${a.title} » mis à jour`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useRemoveArticle() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (id: string) =>
      sendJson(`${BASE}/${id}`, "DELETE").then(() => undefined),
    successMessage: "Article supprimé",
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useBulkSetStatus() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: ArticleStatus }) =>
      sendJson<ArticleDto[]>(`${BASE}/bulk-status`, "POST", {
        ids,
        status,
      }).then((a) => a!),
    successMessage: (updated, vars) =>
      `${updated.length} article(s) → ${vars.status}`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
