import "server-only";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../client";
import {
  articleMedias,
  articles,
  medias,
  type Media,
  type MediaKind,
} from "../schema";
import { RepositoryError } from "../../errors";

export type MediaFilter = {
  q?: string;
  kind?: MediaKind | "all";
  sort?: "newest" | "oldest" | "filename" | "size";
};

export type MediaCreateInput = {
  kind: MediaKind;
  url: string;
  filename: string;
  alt?: string | null;
  caption?: string | null;
  sizeBytes?: number;
  width?: number | null;
  height?: number | null;
  pageCount?: number | null;
};

export type MediaUpdatePatch = Partial<{
  url: string;
  filename: string;
  alt: string | null;
  caption: string | null;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  pageCount: number | null;
}>;

export const MediasRepo = {
  async list(filter: MediaFilter = {}): Promise<Media[]> {
    const conditions = [];
    if (filter.kind && filter.kind !== "all") {
      conditions.push(eq(medias.kind, filter.kind));
    }
    if (filter.q) {
      const pattern = `%${filter.q}%`;
      const orClause = or(
        ilike(medias.filename, pattern),
        ilike(medias.alt, pattern),
        ilike(medias.caption, pattern),
      );
      if (orClause) conditions.push(orClause);
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (filter.sort) {
      case "filename":
        orderBy = asc(medias.filename);
        break;
      case "size":
        orderBy = desc(medias.sizeBytes);
        break;
      case "oldest":
        orderBy = asc(medias.createdAt);
        break;
      case "newest":
      default:
        orderBy = desc(medias.createdAt);
    }

    return db.select().from(medias).where(where).orderBy(orderBy);
  },

  async get(id: string): Promise<Media | null> {
    const rows = await db
      .select()
      .from(medias)
      .where(eq(medias.id, id))
      .limit(1);
    return rows[0] ?? null;
  },

  async create(input: MediaCreateInput): Promise<Media> {
    const [createdMedia] = await db
      .insert(medias)
      .values({
        kind: input.kind,
        url: input.url,
        filename: input.filename,
        alt: input.alt ?? null,
        caption: input.caption ?? null,
        sizeBytes: input.sizeBytes ?? 0,
        width: input.width ?? null,
        height: input.height ?? null,
        pageCount: input.pageCount ?? null,
      })
      .returning();
    return createdMedia;
  },

  async update(id: string, patch: MediaUpdatePatch): Promise<Media> {
    const [updated] = await db
      .update(medias)
      .set({
        ...(patch.url !== undefined && { url: patch.url }),
        ...(patch.filename !== undefined && { filename: patch.filename }),
        ...(patch.alt !== undefined && { alt: patch.alt }),
        ...(patch.caption !== undefined && { caption: patch.caption }),
        ...(patch.sizeBytes !== undefined && { sizeBytes: patch.sizeBytes }),
        ...(patch.width !== undefined && { width: patch.width }),
        ...(patch.height !== undefined && { height: patch.height }),
        ...(patch.pageCount !== undefined && { pageCount: patch.pageCount }),
      })
      .where(eq(medias.id, id))
      .returning();
    if (!updated) throw new RepositoryError("NOT_FOUND", { id });
    return updated;
  },

  async remove(id: string): Promise<void> {
    const usedAsCover = await db
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.coverMediaId, id));
    const usedAsAttached = await db
      .select({ id: articleMedias.articleId })
      .from(articleMedias)
      .where(eq(articleMedias.mediaId, id));
    const articleIds = [
      ...new Set([
        ...usedAsCover.map((r) => r.id),
        ...usedAsAttached.map((r) => r.id),
      ]),
    ];
    if (articleIds.length > 0) {
      throw new RepositoryError("MEDIA_IN_USE", { articleIds });
    }
    const result = await db
      .delete(medias)
      .where(eq(medias.id, id))
      .returning({ id: medias.id });
    if (result.length === 0) throw new RepositoryError("NOT_FOUND", { id });
  },
};

// keep `sql` import in case of future SQL fragments
void sql;
