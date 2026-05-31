/**
 * "20 oct. 2026" — short French date.
 * Accepts a Date (server-side), an ISO string (admin DTOs come back as JSON),
 * or null. Returns "—" for null/invalid input.
 */
export function formatDate(d: Date | string | null | undefined): string {
  if (d === null || d === undefined) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) {
    return typeof d === "string" ? d : "—";
  }
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
