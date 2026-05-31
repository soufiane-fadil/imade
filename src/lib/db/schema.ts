import {
  pgEnum,
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  uuid,
  primaryKey,
  index,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const articleStatus = pgEnum("article_status", [
  "draft",
  "published",
  "archived",
]);

export const mediaKind = pgEnum("media_kind", ["image", "pdf"]);

export const userRole = pgEnum("user_role", ["admin", "editor", "reader"]);

export const userStatus = pgEnum("user_status", ["active", "suspended"]);

export const contactStatus = pgEnum("contact_status", [
  "unread",
  "handled",
  "archived",
]);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    descriptionHtml: text("description_html").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("categories_slug_idx").on(t.slug)],
);

export const authors = pgTable(
  "authors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    descriptionHtml: text("description_html").notNull().default(""),
    photoUrl: text("photo_url"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("authors_slug_idx").on(t.slug)],
);

export const medias = pgTable("medias", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: mediaKind("kind").notNull(),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  alt: text("alt"),
  caption: text("caption"),
  sizeBytes: integer("size_bytes").notNull().default(0),
  width: integer("width"),
  height: integer("height"),
  pageCount: integer("page_count"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    firstName: text("first_name").notNull().default(""),
    lastName: text("last_name").notNull().default(""),
    role: userRole("role").notNull().default("reader"),
    status: userStatus("status").notNull().default("active"),
    lastLoginAt: timestamp("last_login_at", {
      withTimezone: true,
      mode: "date",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("users_email_idx").on(t.email)],
);

export type FaqItem = { question: string; answer: string };

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    seoExcerpt: text("seo_excerpt").notNull().default(""),
    metaDescription: text("meta_description").notNull().default(""),
    metaKeywords: jsonb("meta_keywords")
      .$type<string[]>()
      .notNull()
      .default([]),
    contentHtml: text("content_html").notNull().default(""),
    coverMediaId: uuid("cover_media_id").references(
      (): AnyPgColumn => medias.id,
      { onDelete: "set null" },
    ),
    readingMinutes: integer("reading_minutes").notNull().default(1),
    categoryId: uuid("category_id")
      .notNull()
      .references((): AnyPgColumn => categories.id, { onDelete: "restrict" }),
    authorId: uuid("author_id")
      .notNull()
      .references((): AnyPgColumn => authors.id, { onDelete: "restrict" }),
    faqs: jsonb("faqs").$type<FaqItem[]>().notNull().default([]),
    status: articleStatus("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", {
      withTimezone: true,
      mode: "date",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("articles_slug_idx").on(t.slug),
    index("articles_status_idx").on(t.status),
    index("articles_category_idx").on(t.categoryId),
    index("articles_author_idx").on(t.authorId),
    index("articles_published_at_idx").on(t.publishedAt),
  ],
);

export const articleMedias = pgTable(
  "article_medias",
  {
    articleId: uuid("article_id")
      .notNull()
      .references((): AnyPgColumn => articles.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references((): AnyPgColumn => medias.id, { onDelete: "restrict" }),
    position: integer("position").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.articleId, t.mediaId] }),
    index("article_medias_article_idx").on(t.articleId),
    index("article_medias_media_idx").on(t.mediaId),
  ],
);

export const articleSlugHistory = pgTable(
  "article_slug_history",
  {
    categorySlug: text("category_slug").notNull(),
    articleSlug: text("article_slug").notNull(),
    articleId: uuid("article_id")
      .notNull()
      .references((): AnyPgColumn => articles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.categorySlug, t.articleSlug] }),
    index("article_slug_history_article_idx").on(t.articleId),
  ],
);

export const articleSlugHistoryRelations = relations(
  articleSlugHistory,
  ({ one }) => ({
    article: one(articles, {
      fields: [articleSlugHistory.articleId],
      references: [articles.id],
    }),
  }),
);

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: contactStatus("status").notNull().default("unread"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    handledAt: timestamp("handled_at", { withTimezone: true, mode: "date" }),
    handledByUserId: uuid("handled_by_user_id").references(
      (): AnyPgColumn => users.id,
      { onDelete: "set null" },
    ),
  },
  (t) => [
    index("contacts_status_idx").on(t.status),
    index("contacts_created_at_idx").on(t.createdAt),
  ],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  articles: many(articles),
}));

export const mediasRelations = relations(medias, ({ many }) => ({
  coverOf: many(articles, { relationName: "articleCover" }),
  attachedTo: many(articleMedias),
}));

export const usersRelations = relations(users, ({ many }) => ({
  handledContacts: many(contacts),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  author: one(authors, {
    fields: [articles.authorId],
    references: [authors.id],
  }),
  cover: one(medias, {
    fields: [articles.coverMediaId],
    references: [medias.id],
    relationName: "articleCover",
  }),
  attachedMedias: many(articleMedias),
}));

export const articleMediasRelations = relations(articleMedias, ({ one }) => ({
  article: one(articles, {
    fields: [articleMedias.articleId],
    references: [articles.id],
  }),
  media: one(medias, {
    fields: [articleMedias.mediaId],
    references: [medias.id],
  }),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  handledBy: one(users, {
    fields: [contacts.handledByUserId],
    references: [users.id],
  }),
}));

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Author = InferSelectModel<typeof authors>;
export type NewAuthor = InferInsertModel<typeof authors>;

export type Media = InferSelectModel<typeof medias>;
export type NewMedia = InferInsertModel<typeof medias>;

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Article = InferSelectModel<typeof articles>;
export type NewArticle = InferInsertModel<typeof articles>;

export type ArticleMedia = InferSelectModel<typeof articleMedias>;
export type NewArticleMedia = InferInsertModel<typeof articleMedias>;

export type Contact = InferSelectModel<typeof contacts>;
export type NewContact = InferInsertModel<typeof contacts>;

export type ArticleStatus = (typeof articleStatus.enumValues)[number];
export type MediaKind = (typeof mediaKind.enumValues)[number];
export type UserRole = (typeof userRole.enumValues)[number];
export type UserStatus = (typeof userStatus.enumValues)[number];
export type ContactStatus = (typeof contactStatus.enumValues)[number];
