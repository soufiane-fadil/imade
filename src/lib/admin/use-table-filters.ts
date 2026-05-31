"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Typed URL <-> state sync for list filters.
 *
 * Generic over a flat record of `string | number | undefined` values.
 *
 * - `filters` is derived from the current URL search params, falling back to
 *   `defaults` for any missing key. Numeric defaults coerce raw strings to
 *   numbers (NaN falls back to the default).
 * - `setFilters(patch)` writes the merged patch back to the URL via
 *   `router.replace` (no history pollution). Values that equal the default,
 *   are empty strings, or are `undefined` are removed from the URL.
 * - `reset()` clears every param controlled by this hook.
 */
export function useTableFilters<
  T extends Record<string, string | number | undefined>,
>(defaults: T) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const filters = useMemo(() => {
    const out: Record<string, string | number | undefined> = {};
    for (const key of Object.keys(defaults)) {
      const raw = search.get(key);
      const def = defaults[key];
      if (raw === null) {
        out[key] = def;
        continue;
      }
      if (typeof def === "number") {
        const num = Number(raw);
        out[key] = Number.isFinite(num) ? num : def;
      } else {
        out[key] = raw;
      }
    }
    return out as T;
  }, [defaults, search]);

  const setFilters = useCallback(
    (patch: Partial<T>) => {
      const params = new URLSearchParams(search.toString());
      for (const [key, value] of Object.entries(patch)) {
        const def = defaults[key];
        if (value === undefined || value === "" || value === def) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [defaults, pathname, router, search],
  );

  const reset = useCallback(() => {
    const params = new URLSearchParams(search.toString());
    for (const key of Object.keys(defaults)) {
      params.delete(key);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [defaults, pathname, router, search]);

  return { filters, setFilters, reset };
}
