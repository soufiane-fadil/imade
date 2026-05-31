import "server-only";
import { and, asc, count, desc, eq, ilike, ne, or, sql } from "drizzle-orm";
import { db } from "../client";
import {
  articleSlugHistory,
  articles,
  categories,
  type Category,
} from "../schema";
import { RepositoryError } from "../../errors";

export type CategoryWithCount = Category & { articleCount: number };

export type CategoryFilter = {
  q?: string;
  sort?: "name" | "newest" | "oldest";
};

export type CategoryCreateInput = {
  name: string;
  slug: string;
  descriptionHtml: string;
};

export type CategoryUpdatePatch = Partial<CategoryCreateInput>;

async function countArticlesIn(categoryId: string): Promise<number> {
  const [{ value }] = await db
    .select({ value: count(articles.id) })
    .from(articles)
    .where(eq(articles.categoryId, categoryId));
  return value;
}

async function assertSlugAvailable(
  slug: string,
  excludeId?: string,
): Promise<void> {
  const rows = await db
    .select({ id: categories.id })
    .from(categories)
    .where(
      excludeId
        ? and(eq(categories.slug, slug), ne(categories.id, excludeId))
        : eq(categories.slug, slug),
    )
    .limit(1);
  if (rows.length > 0) {
    // TODO: je veux un message compréhensible
    throw new RepositoryError("SLUG_TAKEN", { slug });
  }
}

export type CategoryNav = { id: string; slug: string; name: string };

export const CategoriesRepo = {
  /** Lightweight projection for headers/footers/navs (no JOIN, no count). */
  async listNav(limit?: number): Promise<CategoryNav[]> {
    const base = db
      .select({
        id: categories.id,
        slug: categories.slug,
        name: categories.name,
      })
      .from(categories)
      .orderBy(asc(categories.name));
    return limit ? base.limit(limit) : base;
  },

  async list(filter: CategoryFilter = {}): Promise<CategoryWithCount[]> {
    const where = filter.q
      ? or(
          ilike(categories.name, `%${filter.q}%`),
          ilike(categories.slug, `%${filter.q}%`),
        )
      : undefined;

    let orderBy;
    switch (filter.sort) {
      case "name":
        orderBy = asc(categories.name);
        break;
      case "oldest":
        orderBy = asc(categories.createdAt);
        break;
      case "newest":
      default:
        orderBy = desc(categories.createdAt);
    }

    return db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        descriptionHtml: categories.descriptionHtml,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        articleCount: count(articles.id),
      })
      .from(categories)
      .leftJoin(articles, eq(articles.categoryId, categories.id))
      .where(where)
      .groupBy(categories.id)
      .orderBy(orderBy);
  },

  async get(id: string): Promise<CategoryWithCount | null> {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    const cat = rows[0];
    if (!cat) return null;
    return { ...cat, articleCount: await countArticlesIn(cat.id) };
  },

  async getBySlug(slug: string): Promise<CategoryWithCount | null> {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    const cat = rows[0];
    if (!cat) return null;
    return { ...cat, articleCount: await countArticlesIn(cat.id) };
  },

  async create(input: CategoryCreateInput): Promise<CategoryWithCount> {
    await assertSlugAvailable(input.slug);
    const [created] = await db
      .insert(categories)
      .values({
        name: input.name,
        slug: input.slug,
        descriptionHtml: input.descriptionHtml,
      })
      .returning();
    return { ...created, articleCount: 0 };
  },

  async update(
    id: string,
    patch: CategoryUpdatePatch,
  ): Promise<CategoryWithCount> {
    if (patch.slug) await assertSlugAvailable(patch.slug, id);

    const [existing] = await db
      .select({ slug: categories.slug })
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    if (!existing) throw new RepositoryError("NOT_FOUND", { id });

    const slugChanged =
      patch.slug !== undefined && patch.slug !== existing.slug;

    if (slugChanged) {
      const affected = await db
        .select({ id: articles.id, slug: articles.slug })
        .from(articles)
        .where(eq(articles.categoryId, id));
      if (affected.length > 0) {
        await db
          .insert(articleSlugHistory)
          .values(
            affected.map((a) => ({
              categorySlug: existing.slug,
              articleSlug: a.slug,
              articleId: a.id,
            })),
          )
          .onConflictDoUpdate({
            target: [
              articleSlugHistory.categorySlug,
              articleSlugHistory.articleSlug,
            ],
            set: {
              articleId: sql`excluded.article_id`,
              createdAt: new Date(),
            },
          });
      }
    }

    const [updated] = await db
      .update(categories)
      .set({
        ...(patch.name !== undefined && { name: patch.name }),
        ...(patch.slug !== undefined && { slug: patch.slug }),
        ...(patch.descriptionHtml !== undefined && {
          descriptionHtml: patch.descriptionHtml,
        }),
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();
    if (!updated) throw new RepositoryError("NOT_FOUND", { id });
    return { ...updated, articleCount: await countArticlesIn(id) };
  },

  async remove(id: string): Promise<void> {
    const articleCount = await countArticlesIn(id);
    if (articleCount > 0) {
      throw new RepositoryError("CATEGORY_HAS_ARTICLES", {
        count: articleCount,
      });
    }
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });
    if (result.length === 0) throw new RepositoryError("NOT_FOUND", { id });
  },
};
