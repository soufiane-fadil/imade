"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdminMutation } from "@/lib/admin/use-admin-mutation";
import { RepositoryError } from "@/lib/errors";

export type MediaKind = "image" | "pdf";

export type MediaDto = {
  id: string;
  kind: MediaKind;
  url: string;
  filename: string;
  alt: string | null;
  caption: string | null;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  pageCount: number | null;
  createdAt: string;
};

export type MediaFilter = {
  q?: string;
  kind?: MediaKind | "all";
  sort?: "newest" | "oldest" | "filename" | "size";
};

export type MediaCreateInput = {
  kind: MediaKind;
  url: string;
  filename: string;
  alt?: string | null;
  caption?: string | null;
  sizeBytes?: number;
  width?: number | null;
  height?: number | null;
  pageCount?: number | null;
};

export type MediaUpdatePatch = Partial<{
  url: string;
  filename: string;
  alt: string | null;
  caption: string | null;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  pageCount: number | null;
}>;

const KEY = ["medias"] as const;
const BASE = "/api/admin/medias";

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

function buildQuery(filter?: MediaFilter): string {
  if (!filter) return "";
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  if (filter.kind) params.set("kind", filter.kind);
  if (filter.sort) params.set("sort", filter.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useMedias(filter?: MediaFilter) {
  return useQuery({
    queryKey: [...KEY, "list", filter ?? {}],
    queryFn: () => getJson<MediaDto[]>(`${BASE}${buildQuery(filter)}`),
  });
}

export function useMedia(id: string | undefined) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => getJson<MediaDto>(`${BASE}/${id}`),
    enabled: !!id,
  });
}

export function useCreateMedia() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (input: MediaCreateInput) =>
      sendJson<MediaDto>(BASE, "POST", input).then((m) => m!),
    successMessage: (m) => `Média « ${m.filename} » ajouté`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateMedia() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: ({ id, patch }: { id: string; patch: MediaUpdatePatch }) =>
      sendJson<MediaDto>(`${BASE}/${id}`, "PATCH", patch).then((m) => m!),
    successMessage: (m) => `Média « ${m.filename} » mis à jour`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useRemoveMedia() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (id: string) =>
      sendJson(`${BASE}/${id}`, "DELETE").then(() => undefined),
    successMessage: "Média supprimé",
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
