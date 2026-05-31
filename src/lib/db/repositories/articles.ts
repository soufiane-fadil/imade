import "server-only";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  ne,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { db } from "../client";
import {
  articleMedias,
  articleSlugHistory,
  articles,
  authors,
  categories,
  medias,
  type Article,
  type ArticleStatus,
  type FaqItem,
} from "../schema";
import { RepositoryError } from "../../errors";

export type ArticleSortKey =
  | "newest"
  | "oldest"
  | "title"
  | "publishedDesc"
  | "publishedAsc";

export type ArticleFilter = {
  q?: string;
  status?: ArticleStatus | "all";
  categoryId?: string;
  authorId?: string;
  sort?: ArticleSortKey;
  page?: number;
  pageSize?: number;
};

export type ArticleWithMedia = Article & { attachedMediaIds: string[] };

export type ArticleListResult = {
  items: ArticleWithMedia[];
  total: number;
  page: number;
  pageSize: number;
};

export type ArticleCreateInput = {
  title: string;
  slug: string;
  seoExcerpt: string;
  metaDescription: string;
  metaKeywords: string[];
  contentHtml: string;
  coverMediaId: string | null;
  attachedMediaIds: string[];
  readingMinutes: number;
  categoryId: string;
  authorId: string;
  faqs: FaqItem[];
  status: ArticleStatus;
};

export type ArticleUpdatePatch = Partial<ArticleCreateInput>;

const DEFAULT_PAGE_SIZE = 20;

async function assertSlugAvailable(
  slug: string,
  excludeId?: string,
): Promise<void> {
  const rows = await db
    .select({ id: articles.id })
    .from(articles)
    .where(
      excludeId
        ? and(eq(articles.slug, slug), ne(articles.id, excludeId))
        : eq(articles.slug, slug),
    )
    .limit(1);
  if (rows.length > 0) throw new RepositoryError("SLUG_TAKEN", { slug });
}

async function assertCategoryExists(categoryId: string): Promise<void> {
  const rows = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);
  if (rows.length === 0)
    throw new RepositoryError("CATEGORY_NOT_FOUND", { categoryId });
}

async function assertAuthorExists(authorId: string): Promise<void> {
  const rows = await db
    .select({ id: authors.id })
    .from(authors)
    .where(eq(authors.id, authorId))
    .limit(1);
  if (rows.length === 0)
    throw new RepositoryError("AUTHOR_NOT_FOUND", { authorId });
}

async function loadAttachedMedia(articleId: string): Promise<string[]> {
  const rows = await db
    .select({ id: articleMedias.mediaId })
    .from(articleMedias)
    .where(eq(articleMedias.articleId, articleId))
    .orderBy(asc(articleMedias.position));
  return rows.map((r) => r.id);
}

async function replaceAttachedMedia(
  articleId: string,
  mediaIds: string[],
): Promise<void> {
  await db.delete(articleMedias).where(eq(articleMedias.articleId, articleId));
  if (mediaIds.length === 0) return;
  await db.insert(articleMedias).values(
    mediaIds.map((mediaId, position) => ({
      articleId,
      mediaId,
      position,
    })),
  );
}

function buildWhere(filter: ArticleFilter): SQL | undefined {
  const conditions: SQL[] = [];
  if (filter.status && filter.status !== "all") {
    conditions.push(eq(articles.status, filter.status));
  }
  if (filter.categoryId) {
    conditions.push(eq(articles.categoryId, filter.categoryId));
  }
  if (filter.authorId) {
    conditions.push(eq(articles.authorId, filter.authorId));
  }
  if (filter.q) {
    const pattern = `%${filter.q}%`;
    const orClause = or(
      ilike(articles.title, pattern),
      ilike(articles.seoExcerpt, pattern),
      ilike(articles.slug, pattern),
    );
    if (orClause) conditions.push(orClause);
  }
  return conditions.length > 0 ? and(...conditions) : undefined;
}

function buildOrderBy(sortKey: ArticleSortKey | undefined): SQL {
  switch (sortKey) {
    case "title":
      return asc(articles.title);
    case "oldest":
      return asc(articles.createdAt);
    case "publishedAsc":
      return asc(articles.publishedAt);
    case "publishedDesc":
      return desc(articles.publishedAt);
    case "newest":
    default:
      return desc(articles.createdAt);
  }
}

export type PublishedArticleSummary = {
  id: string;
  slug: string;
  title: string;
  seoExcerpt: string;
  readingMinutes: number;
  publishedAt: Date | null;
  categoryName: string;
  categorySlug: string;
  authorName: string;
  coverUrl: string | null;
  coverAlt: string | null;
};

export type PublishedArticleDetail = {
  article: Article;
  attachedMediaIds: string[];
  categoryName: string;
  categorySlug: string;
  authorName: string;
  coverUrl: string | null;
  coverAlt: string | null;
};

export type PublishedListOptions = {
  excludeArticleId?: string;
  limit?: number;
};

export const ArticlesRepo = {
  async listPublishedInCategory(
    categoryId: string,
    opts: PublishedListOptions = {},
  ): Promise<PublishedArticleSummary[]> {
    const conditions = [
      eq(articles.status, "published"),
      eq(articles.categoryId, categoryId),
    ];
    if (opts.excludeArticleId) {
      conditions.push(ne(articles.id, opts.excludeArticleId));
    }
    const base = db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        seoExcerpt: articles.seoExcerpt,
        readingMinutes: articles.readingMinutes,
        publishedAt: articles.publishedAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorName: authors.name,
        coverUrl: medias.url,
        coverAlt: medias.alt,
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .leftJoin(medias, eq(medias.id, articles.coverMediaId))
      .where(and(...conditions))
      .orderBy(desc(articles.publishedAt));
    return opts.limit ? base.limit(opts.limit) : base;
  },

  async listPublishedOutsideCategory(
    categoryId: string,
    opts: PublishedListOptions = {},
  ): Promise<PublishedArticleSummary[]> {
    const conditions = [
      eq(articles.status, "published"),
      ne(articles.categoryId, categoryId),
    ];
    if (opts.excludeArticleId) {
      conditions.push(ne(articles.id, opts.excludeArticleId));
    }
    const base = db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        seoExcerpt: articles.seoExcerpt,
        readingMinutes: articles.readingMinutes,
        publishedAt: articles.publishedAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorName: authors.name,
        coverUrl: medias.url,
        coverAlt: medias.alt,
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .leftJoin(medias, eq(medias.id, articles.coverMediaId))
      .where(and(...conditions))
      .orderBy(desc(articles.publishedAt));
    return opts.limit ? base.limit(opts.limit) : base;
  },

  async getPublishedView(slug: string): Promise<PublishedArticleDetail | null> {
    const rows = await db
      .select({
        article: articles,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorName: authors.name,
        coverUrl: medias.url,
        coverAlt: medias.alt,
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .leftJoin(medias, eq(medias.id, articles.coverMediaId))
      .where(eq(articles.slug, slug))
      .limit(1);
    const row = rows[0];
    if (!row || row.article.status !== "published") return null;
    return {
      article: row.article,
      attachedMediaIds: await loadAttachedMedia(row.article.id),
      categoryName: row.categoryName,
      categorySlug: row.categorySlug,
      authorName: row.authorName,
      coverUrl: row.coverUrl,
      coverAlt: row.coverAlt,
    };
  },

  async listPublishedSlugs(): Promise<string[]> {
    const rows = await db
      .select({ slug: articles.slug })
      .from(articles)
      .where(eq(articles.status, "published"));
    return rows.map((r) => r.slug);
  },

  /** N random published articles, excluding any IDs the caller already showed elsewhere. */
  async listRandomPublished(
    limit: number,
    excludeIds: string[] = [],
  ): Promise<PublishedArticleSummary[]> {
    const conditions = [eq(articles.status, "published")];
    if (excludeIds.length > 0) {
      conditions.push(sql`${articles.id} NOT IN ${excludeIds}`);
    }
    return db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        seoExcerpt: articles.seoExcerpt,
        readingMinutes: articles.readingMinutes,
        publishedAt: articles.publishedAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorName: authors.name,
        coverUrl: medias.url,
        coverAlt: medias.alt,
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .leftJoin(medias, eq(medias.id, articles.coverMediaId))
      .where(and(...conditions))
      .orderBy(sql`random()`)
      .limit(limit);
  },

  /** Latest published articles across all categories, sorted by publishedAt desc. */
  async listLatestPublished(limit: number): Promise<PublishedArticleSummary[]> {
    return db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        seoExcerpt: articles.seoExcerpt,
        readingMinutes: articles.readingMinutes,
        publishedAt: articles.publishedAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorName: authors.name,
        coverUrl: medias.url,
        coverAlt: medias.alt,
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .leftJoin(medias, eq(medias.id, articles.coverMediaId))
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  },

  /**
   * Looks up an old (categorySlug, articleSlug) combination in the redirect
   * history. Returns the current live slugs to redirect to, or null if not
   * found or the target article is no longer published.
   */
  async findHistoricalRoute(
    categorySlug: string,
    articleSlug: string,
  ): Promise<{ categorySlug: string; articleSlug: string } | null> {
    const rows = await db
      .select({
        currentCategorySlug: categories.slug,
        currentArticleSlug: articles.slug,
        status: articles.status,
      })
      .from(articleSlugHistory)
      .innerJoin(articles, eq(articleSlugHistory.articleId, articles.id))
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .where(
        and(
          eq(articleSlugHistory.categorySlug, categorySlug),
          eq(articleSlugHistory.articleSlug, articleSlug),
        ),
      )
      .limit(1);
    const r = rows[0];
    if (!r || r.status !== "published") return null;
    return {
      categorySlug: r.currentCategorySlug,
      articleSlug: r.currentArticleSlug,
    };
  },

  /** (categorySlug, articleSlug) pairs for every published article — for generateStaticParams. */
  async listPublishedRoutes(): Promise<
    { categorySlug: string; articleSlug: string }[]
  > {
    return db
      .select({
        categorySlug: categories.slug,
        articleSlug: articles.slug,
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.status, "published"));
  },

  async list(filter: ArticleFilter = {}): Promise<ArticleListResult> {
    const where = buildWhere(filter);
    const page = filter.page ?? 1;
    const pageSize = filter.pageSize ?? DEFAULT_PAGE_SIZE;

    const [{ total }] = await db
      .select({ total: count(articles.id) })
      .from(articles)
      .where(where);

    const rows = await db
      .select()
      .from(articles)
      .where(where)
      .orderBy(buildOrderBy(filter.sort))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return {
      items: rows.map((r) => ({ ...r, attachedMediaIds: [] as string[] })),
      total,
      page,
      pageSize,
    };
  },

  async get(id: string): Promise<ArticleWithMedia | null> {
    const rows = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);
    const article = rows[0];
    if (!article) return null;
    return { ...article, attachedMediaIds: await loadAttachedMedia(id) };
  },

  async getBySlug(slug: string): Promise<ArticleWithMedia | null> {
    const rows = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);
    const article = rows[0];
    if (!article) return null;
    return {
      ...article,
      attachedMediaIds: await loadAttachedMedia(article.id),
    };
  },

  async create(input: ArticleCreateInput): Promise<ArticleWithMedia> {
    await assertSlugAvailable(input.slug);
    await assertCategoryExists(input.categoryId);
    await assertAuthorExists(input.authorId);

    const now = new Date();
    const [created] = await db
      .insert(articles)
      .values({
        title: input.title,
        slug: input.slug,
        seoExcerpt: input.seoExcerpt,
        metaDescription: input.metaDescription,
        metaKeywords: input.metaKeywords,
        contentHtml: input.contentHtml,
        coverMediaId: input.coverMediaId,
        readingMinutes: input.readingMinutes,
        categoryId: input.categoryId,
        authorId: input.authorId,
        faqs: input.faqs,
        status: input.status,
        publishedAt: input.status === "published" ? now : null,
      })
      .returning();

    await replaceAttachedMedia(created.id, input.attachedMediaIds);

    return { ...created, attachedMediaIds: [...input.attachedMediaIds] };
  },

  async update(
    id: string,
    patch: ArticleUpdatePatch,
  ): Promise<ArticleWithMedia> {
    if (patch.slug) await assertSlugAvailable(patch.slug, id);
    if (patch.categoryId) await assertCategoryExists(patch.categoryId);
    if (patch.authorId) await assertAuthorExists(patch.authorId);

    const existingRows = await db
      .select({
        article: articles,
        categorySlug: categories.slug,
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.id, id))
      .limit(1);
    const existingRow = existingRows[0];
    if (!existingRow) throw new RepositoryError("NOT_FOUND", { id });
    const current = existingRow.article;
    const currentCategorySlug = existingRow.categorySlug;

    const slugChanged = patch.slug !== undefined && patch.slug !== current.slug;
    const categoryChanged =
      patch.categoryId !== undefined && patch.categoryId !== current.categoryId;

    if (slugChanged || categoryChanged) {
      await db
        .insert(articleSlugHistory)
        .values({
          categorySlug: currentCategorySlug,
          articleSlug: current.slug,
          articleId: id,
        })
        .onConflictDoUpdate({
          target: [
            articleSlugHistory.categorySlug,
            articleSlugHistory.articleSlug,
          ],
          set: { articleId: id, createdAt: new Date() },
        });
    }

    let publishedAt = current.publishedAt;
    if (
      patch.status !== undefined &&
      patch.status === "published" &&
      publishedAt === null
    ) {
      publishedAt = new Date();
    }

    const [updated] = await db
      .update(articles)
      .set({
        ...(patch.title !== undefined && { title: patch.title }),
        ...(patch.slug !== undefined && { slug: patch.slug }),
        ...(patch.seoExcerpt !== undefined && { seoExcerpt: patch.seoExcerpt }),
        ...(patch.metaDescription !== undefined && {
          metaDescription: patch.metaDescription,
        }),
        ...(patch.metaKeywords !== undefined && {
          metaKeywords: patch.metaKeywords,
        }),
        ...(patch.contentHtml !== undefined && {
          contentHtml: patch.contentHtml,
        }),
        ...(patch.coverMediaId !== undefined && {
          coverMediaId: patch.coverMediaId,
        }),
        ...(patch.readingMinutes !== undefined && {
          readingMinutes: patch.readingMinutes,
        }),
        ...(patch.categoryId !== undefined && {
          categoryId: patch.categoryId,
        }),
        ...(patch.authorId !== undefined && { authorId: patch.authorId }),
        ...(patch.faqs !== undefined && { faqs: patch.faqs }),
        ...(patch.status !== undefined && { status: patch.status }),
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();

    if (patch.attachedMediaIds !== undefined) {
      await replaceAttachedMedia(id, patch.attachedMediaIds);
    }

    return { ...updated, attachedMediaIds: await loadAttachedMedia(id) };
  },

  async remove(id: string): Promise<void> {
    const result = await db
      .delete(articles)
      .where(eq(articles.id, id))
      .returning({ id: articles.id });
    if (result.length === 0) throw new RepositoryError("NOT_FOUND", { id });
  },

  async setStatus(ids: string[], status: ArticleStatus): Promise<Article[]> {
    if (ids.length === 0) return [];
    const now = new Date();
    const updated = await db
      .update(articles)
      .set({
        status,
        publishedAt:
          status === "published"
            ? sql`COALESCE(${articles.publishedAt}, ${now})`
            : articles.publishedAt,
        updatedAt: now,
      })
      .where(inArray(articles.id, ids))
      .returning();
    return updated;
  },
};
