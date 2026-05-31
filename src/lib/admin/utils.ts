import { ulid as ulidGen } from "ulid";

export function ulid(): string {
  return ulidGen();
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function readingMinutesFromHtml(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(wordCount / 220));
}

export function isUniqueSlug<T extends { slug: string; id?: string }>(
  slug: string,
  existing: T[],
  excludeId?: string,
): boolean {
  return !existing.some((e) => {
    if (e.slug !== slug) return false;
    if (excludeId !== undefined && e.id === excludeId) return false;
    return true;
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}
