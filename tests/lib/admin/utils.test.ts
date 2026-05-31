import { describe, expect, it } from "vitest";
import {
  slugify,
  readingMinutesFromHtml,
  isUniqueSlug,
} from "@/lib/admin/utils";

describe("slugify", () => {
  it("lowercases and removes diacritics", () => {
    expect(slugify("Pompes à chaleur")).toBe("pompes-a-chaleur");
    expect(slugify("Réglementation")).toBe("reglementation");
  });

  it("collapses whitespace and special chars", () => {
    expect(slugify("Aides &  financement!")).toBe("aides-financement");
    expect(slugify("  Léa  Marchand  ")).toBe("lea-marchand");
  });

  it("strips leading/trailing dashes", () => {
    expect(slugify("---hello---")).toBe("hello");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
    expect(slugify("   ")).toBe("");
  });
});

describe("readingMinutesFromHtml", () => {
  it("returns at least 1 minute", () => {
    expect(readingMinutesFromHtml("<p>Court</p>")).toBe(1);
  });

  it("rounds based on 220 words per minute", () => {
    const html = "<p>" + "mot ".repeat(440) + "</p>";
    expect(readingMinutesFromHtml(html)).toBe(2);
  });

  it("strips html tags before counting", () => {
    const html = "<p><strong>un deux trois</strong></p>";
    expect(readingMinutesFromHtml(html)).toBe(1);
  });
});

describe("isUniqueSlug", () => {
  it("returns true if slug is absent from existing list", () => {
    expect(isUniqueSlug("new", [{ slug: "old" }, { slug: "other" }])).toBe(
      true,
    );
  });

  it("returns false if slug exists", () => {
    expect(isUniqueSlug("old", [{ slug: "old" }])).toBe(false);
  });

  it("ignores excluded id (for edits)", () => {
    expect(isUniqueSlug("same", [{ slug: "same", id: "1" }], "1")).toBe(true);
    expect(isUniqueSlug("same", [{ slug: "same", id: "1" }], "2")).toBe(false);
  });
});
