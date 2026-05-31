import "server-only";
import { and, asc, count, desc, eq, ilike, ne, or } from "drizzle-orm";
import { db } from "../client";
import { articles, authors, type Author } from "../schema";
import { RepositoryError } from "../../errors";

export type AuthorWithCount = Author & { articleCount: number };

export type AuthorFilter = {
  q?: string;
  sort?: "name" | "newest" | "oldest";
};

export type AuthorCreateInput = {
  name: string;
  slug: string;
  descriptionHtml: string;
  photoUrl: string | null;
};

export type AuthorUpdatePatch = Partial<AuthorCreateInput>;

async function countArticlesBy(authorId: string): Promise<number> {
  const [{ value }] = await db
    .select({ value: count(articles.id) })
    .from(articles)
    .where(eq(articles.authorId, authorId));
  return value;
}

async function assertSlugAvailable(
  slug: string,
  excludeId?: string,
): Promise<void> {
  const rows = await db
    .select({ id: authors.id })
    .from(authors)
    .where(
      excludeId
        ? and(eq(authors.slug, slug), ne(authors.id, excludeId))
        : eq(authors.slug, slug),
    )
    .limit(1);
  if (rows.length > 0) throw new RepositoryError("SLUG_TAKEN", { slug });
}

export const AuthorsRepo = {
  async list(filter: AuthorFilter = {}): Promise<AuthorWithCount[]> {
    const where = filter.q
      ? or(
          ilike(authors.name, `%${filter.q}%`),
          ilike(authors.slug, `%${filter.q}%`),
        )
      : undefined;

    let orderBy;
    switch (filter.sort) {
      case "name":
        orderBy = asc(authors.name);
        break;
      case "oldest":
        orderBy = asc(authors.createdAt);
        break;
      case "newest":
      default:
        orderBy = desc(authors.createdAt);
    }

    return db
      .select({
        id: authors.id,
        name: authors.name,
        slug: authors.slug,
        descriptionHtml: authors.descriptionHtml,
        photoUrl: authors.photoUrl,
        createdAt: authors.createdAt,
        updatedAt: authors.updatedAt,
        articleCount: count(articles.id),
      })
      .from(authors)
      .leftJoin(articles, eq(articles.authorId, authors.id))
      .where(where)
      .groupBy(authors.id)
      .orderBy(orderBy);
  },

  async get(id: string): Promise<AuthorWithCount | null> {
    const rows = await db
      .select()
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);
    const author = rows[0];
    if (!author) return null;
    return { ...author, articleCount: await countArticlesBy(author.id) };
  },

  async getBySlug(slug: string): Promise<AuthorWithCount | null> {
    const rows = await db
      .select()
      .from(authors)
      .where(eq(authors.slug, slug))
      .limit(1);
    const author = rows[0];
    if (!author) return null;
    return { ...author, articleCount: await countArticlesBy(author.id) };
  },

  async create(input: AuthorCreateInput): Promise<AuthorWithCount> {
    await assertSlugAvailable(input.slug);
    const [createdAuthor] = await db
      .insert(authors)
      .values({
        name: input.name,
        slug: input.slug,
        descriptionHtml: input.descriptionHtml,
        photoUrl: input.photoUrl,
      })
      .returning();
    return { ...createdAuthor, articleCount: 0 };
  },

  async update(id: string, patch: AuthorUpdatePatch): Promise<AuthorWithCount> {
    if (patch.slug) await assertSlugAvailable(patch.slug, id);
    const [updated] = await db
      .update(authors)
      .set({
        ...(patch.name !== undefined && { name: patch.name }),
        ...(patch.slug !== undefined && { slug: patch.slug }),
        ...(patch.descriptionHtml !== undefined && {
          descriptionHtml: patch.descriptionHtml,
        }),
        ...(patch.photoUrl !== undefined && { photoUrl: patch.photoUrl }),
        updatedAt: new Date(),
      })
      .where(eq(authors.id, id))
      .returning();
    if (!updated) throw new RepositoryError("NOT_FOUND", { id });
    return { ...updated, articleCount: await countArticlesBy(id) };
  },

  async remove(id: string): Promise<void> {
    const articleCount = await countArticlesBy(id);
    if (articleCount > 0) {
      throw new RepositoryError("AUTHOR_HAS_ARTICLES", { count: articleCount });
    }
    const result = await db
      .delete(authors)
      .where(eq(authors.id, id))
      .returning({ id: authors.id });
    if (result.length === 0) throw new RepositoryError("NOT_FOUND", { id });
  },
};
