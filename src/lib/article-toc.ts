import { slugify } from "@/lib/admin/utils";

export type TocEntry = { id: string; text: string };

export type TocResult = {
  entries: TocEntry[];
  html: string;
};

/**
 * Extracts an in-page table of contents from `<h2>` headings of the article
 * HTML and rewrites each `<h2>` with an `id` so anchor links resolve.
 * Returns the original HTML untouched when no `<h2>` is found.
 */
export function buildArticleToc(html: string): TocResult {
  const entries: TocEntry[] = [];
  const usedIds = new Set<string>();

  const newHtml = html.replace(
    /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi,
    (_, attrs: string | undefined, content: string) => {
      const text = content.replace(/<[^>]*>/g, "").trim();
      if (!text) return `<h2${attrs ?? ""}>${content}</h2>`;
      const baseId = slugify(text) || "section";
      let id = baseId;
      let i = 2;
      while (usedIds.has(id)) {
        id = `${baseId}-${i++}`;
      }
      usedIds.add(id);
      entries.push({ id, text });
      const attrString = attrs ? attrs.replace(/\sid="[^"]*"/i, "") : "";
      return `<h2 id="${id}"${attrString}>${content}</h2>`;
    },
  );

  return { entries, html: newHtml };
}
