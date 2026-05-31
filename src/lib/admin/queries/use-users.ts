"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdminMutation } from "@/lib/admin/use-admin-mutation";
import { RepositoryError } from "@/lib/errors";

export type UserRole = "admin" | "editor" | "reader";
export type UserStatus = "active" | "suspended";

export type UserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
};

export type UserFilter = {
  q?: string;
  role?: UserRole | "all";
  status?: UserStatus | "all";
  sort?: "newest" | "oldest" | "name";
};

export type UserCreateInput = {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string | null;
};

export type UserUpdatePatch = Partial<UserCreateInput>;

const KEY = ["users"] as const;
const BASE = "/api/admin/users";

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

function buildQuery(filter?: UserFilter): string {
  if (!filter) return "";
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  if (filter.role) params.set("role", filter.role);
  if (filter.status) params.set("status", filter.status);
  if (filter.sort) params.set("sort", filter.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useUsers(filter?: UserFilter) {
  return useQuery({
    queryKey: [...KEY, "list", filter ?? {}],
    queryFn: () => getJson<UserDto[]>(`${BASE}${buildQuery(filter)}`),
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => getJson<UserDto>(`${BASE}/${id}`),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (input: UserCreateInput) =>
      sendJson<UserDto>(BASE, "POST", input).then((u) => u!),
    successMessage: (u) => `Utilisateur ${u.email} créé`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UserUpdatePatch }) =>
      sendJson<UserDto>(`${BASE}/${id}`, "PATCH", patch).then((u) => u!),
    successMessage: (u) => `Utilisateur ${u.email} mis à jour`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useRemoveUser() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (id: string) =>
      sendJson(`${BASE}/${id}`, "DELETE").then(() => undefined),
    successMessage: "Utilisateur supprimé",
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (id: string) =>
      sendJson<UserDto>(`${BASE}/${id}`, "PATCH", {
        status: "suspended",
      }).then((u) => u!),
    successMessage: (u) => `${u.email} suspendu`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useReactivateUser() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (id: string) =>
      sendJson<UserDto>(`${BASE}/${id}`, "PATCH", {
        status: "active",
      }).then((u) => u!),
    successMessage: (u) => `${u.email} réactivé`,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
