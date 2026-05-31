"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdminMutation } from "@/lib/admin/use-admin-mutation";
import { RepositoryError } from "@/lib/errors";

export type AuthorDto = {
  id: string;
  name: string;
  slug: string;
  descriptionHtml: string;
  photoUrl: string | null;
  articleCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AuthorFilter = {
  q?: string;
  sort?: "name" | "newest" | "oldest";
};

export type AuthorCreateInput = {
  name: string;
  slug: string;
  descriptionHtml: string;
  photoUrl: string | null;
};

export type AuthorUpdatePatch = Partial<AuthorCreateInput>;

const KEY = ["authors"] as const;
const BASE = "/api/admin/authors";

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

function buildQuery(filter?: AuthorFilter): string {
  if (!filter) return "";
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  if (filter.sort) params.set("sort", filter.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useAuthors(filter?: AuthorFilter) {
  return useQuery({
    queryKey: [...KEY, "list", filter ?? {}],
    queryFn: () => getJson<AuthorDto[]>(`${BASE}${buildQuery(filter)}`),
  });
}

export function useAuthor(id: string | undefined) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => getJson<AuthorDto>(`${BASE}/${id}`),
    enabled: !!id,
  });
}

export function useCreateAuthor() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (input: AuthorCreateInput) =>
      sendJson<AuthorDto>(BASE, "POST", input).then((a) => a!),
    successMessage: (a) => `Auteur « ${a.name} » créé`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateAuthor() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: ({ id, patch }: { id: string; patch: AuthorUpdatePatch }) =>
      sendJson<AuthorDto>(`${BASE}/${id}`, "PATCH", patch).then((a) => a!),
    successMessage: (a) => `Auteur « ${a.name} » mis à jour`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useRemoveAuthor() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (id: string) =>
      sendJson(`${BASE}/${id}`, "DELETE").then(() => undefined),
    successMessage: "Auteur supprimé",
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
