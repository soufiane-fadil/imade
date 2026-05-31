import type { FaqItem } from "@/lib/db/schema";

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdObject
  | JsonLdValue[];

export type JsonLdObject = { [key: string]: JsonLdValue };

/**
 * Serializes a JSON-LD payload while escaping `<` to prevent breaking out of
 * the surrounding `<script>` tag via `</script>` in user-controlled strings.
 */
export function serializeJsonLd(data: JsonLdObject): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** schema.org FAQPage — returns null when faqs is empty. */
export function buildFaqPage(
  faqs: ReadonlyArray<FaqItem>,
): JsonLdObject | null {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

/** schema.org BreadcrumbList — items in order, leftmost first. */
export function buildBreadcrumbList(
  items: ReadonlyArray<{ name: string; url: string }>,
): JsonLdObject | null {
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** schema.org Article. */
export function buildArticle(input: {
  url: string;
  headline: string;
  description?: string;
  image?: string | null;
  authorName: string;
  publisherName: string;
  datePublished: Date | null;
  dateModified: Date | null;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    author: { "@type": "Person", name: input.authorName },
    publisher: {
      "@type": "Organization",
      name: input.publisherName,
    },
    ...(input.datePublished
      ? { datePublished: input.datePublished.toISOString() }
      : {}),
    ...(input.dateModified
      ? { dateModified: input.dateModified.toISOString() }
      : {}),
  };
}
