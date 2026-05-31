"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdminMutation } from "@/lib/admin/use-admin-mutation";
import { RepositoryError } from "@/lib/errors";

export type ContactStatus = "unread" | "handled" | "archived";

export type ContactDto = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  handledAt: string | null;
  handledByUserId: string | null;
};

export type ContactFilter = {
  q?: string;
  status?: ContactStatus | "all";
  sort?: "newest" | "oldest";
};

export type ContactCreateInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: ContactStatus;
};

const KEY = ["contacts"] as const;
const BASE = "/api/admin/contacts";

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

function buildQuery(filter?: ContactFilter): string {
  if (!filter) return "";
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  if (filter.status) params.set("status", filter.status);
  if (filter.sort) params.set("sort", filter.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useContacts(filter?: ContactFilter) {
  return useQuery({
    queryKey: [...KEY, "list", filter ?? {}],
    queryFn: () => getJson<ContactDto[]>(`${BASE}${buildQuery(filter)}`),
  });
}

export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => getJson<ContactDto>(`${BASE}/${id}`),
    enabled: !!id,
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (input: ContactCreateInput) =>
      sendJson<ContactDto>(BASE, "POST", input).then((c) => c!),
    successMessage: "Contact enregistré",
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useRemoveContact() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (id: string) =>
      sendJson(`${BASE}/${id}`, "DELETE").then(() => undefined),
    successMessage: "Contact supprimé",
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useMarkHandled() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: ({ id, byUserId }: { id: string; byUserId: string }) =>
      sendJson<ContactDto>(`${BASE}/${id}`, "PATCH", {
        action: "mark-handled",
        byUserId,
      }).then((c) => c!),
    successMessage: "Message marqué traité",
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useMarkArchived() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (id: string) =>
      sendJson<ContactDto>(`${BASE}/${id}`, "PATCH", {
        action: "mark-archived",
      }).then((c) => c!),
    successMessage: "Message archivé",
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useMarkUnread() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (id: string) =>
      sendJson<ContactDto>(`${BASE}/${id}`, "PATCH", {
        action: "mark-unread",
      }).then((c) => c!),
    successMessage: "Message remis en non lu",
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
