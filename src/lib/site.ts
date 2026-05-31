export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Maison·Calorie";
export const SITE_TAGLINE =
  process.env.NEXT_PUBLIC_SITE_TAGLINE ??
  "Le journal de la rénovation énergétique";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const TWITTER_HANDLE =
  process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "@maisoncalorie";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = SITE_URL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
