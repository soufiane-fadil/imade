"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdminMutation } from "@/lib/admin/use-admin-mutation";
import { RepositoryError } from "@/lib/errors";

export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
  descriptionHtml: string;
  articleCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CategoryFilter = {
  q?: string;
  sort?: "name" | "newest" | "oldest";
};

export type CategoryCreateInput = {
  name: string;
  slug: string;
  descriptionHtml: string;
};

export type CategoryUpdatePatch = Partial<CategoryCreateInput>;

const KEY = ["categories"] as const;
const BASE = "/api/admin/categories";

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

function buildQuery(filter?: CategoryFilter): string {
  if (!filter) return "";
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  if (filter.sort) params.set("sort", filter.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useCategories(filter?: CategoryFilter) {
  return useQuery({
    queryKey: [...KEY, "list", filter ?? {}],
    queryFn: () => getJson<CategoryDto[]>(`${BASE}${buildQuery(filter)}`),
  });
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => getJson<CategoryDto>(`${BASE}/${id}`),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (input: CategoryCreateInput) =>
      sendJson<CategoryDto>(BASE, "POST", input).then((c) => c!),
    successMessage: (c) => `Catégorie « ${c.name} » créée`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: ({ id, patch }: { id: string; patch: CategoryUpdatePatch }) =>
      sendJson<CategoryDto>(`${BASE}/${id}`, "PATCH", patch).then((c) => c!),
    successMessage: (c) => `Catégorie « ${c.name} » mise à jour`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useRemoveCategory() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (id: string) =>
      sendJson(`${BASE}/${id}`, "DELETE").then(() => undefined),
    successMessage: "Catégorie supprimée",
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
