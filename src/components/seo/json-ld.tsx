import { serializeJsonLd, type JsonLdObject } from "@/lib/seo/json-ld";

/**
 * Renders a `<script type="application/ld+json">` block for the given
 * schema.org payload. Renders nothing when `data` is null — lets callers
 * pass the result of a builder directly without a guard.
 */
export function JsonLd({ data }: { data: JsonLdObject | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
