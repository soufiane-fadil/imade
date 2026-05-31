import { config } from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import {
  articleMedias,
  articles,
  authors,
  categories,
  contacts,
  medias,
  users,
} from "../src/lib/db/schema";
import { buildSeed } from "../src/lib/admin/seed";

config({ path: ".env.local" });
config({ path: ".env" });

const isoToDate = (iso: string | null): Date | null =>
  iso ? new Date(iso) : null;

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const client = postgres(url, { max: 1 });
  const db = drizzle(client);

  console.log("Resetting tables…");
  await db.execute(
    sql`TRUNCATE TABLE article_medias, articles, contacts, medias, authors, categories, users RESTART IDENTITY CASCADE`,
  );

  const seed = buildSeed();

  console.log(`Seeding ${seed.categories.length} categories…`);
  const catRows = await db
    .insert(categories)
    .values(
      seed.categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        descriptionHtml: c.descriptionHtml,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      })),
    )
    .returning({ id: categories.id });
  const catMap = new Map<string, string>(
    seed.categories.map((c, i) => [c.id, catRows[i].id]),
  );

  console.log(`Seeding ${seed.authors.length} authors…`);
  const authRows = await db
    .insert(authors)
    .values(
      seed.authors.map((a) => ({
        name: a.name,
        slug: a.slug,
        descriptionHtml: a.descriptionHtml,
        photoUrl: a.photoUrl,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
      })),
    )
    .returning({ id: authors.id });
  const authMap = new Map<string, string>(
    seed.authors.map((a, i) => [a.id, authRows[i].id]),
  );

  console.log(`Seeding ${seed.medias.length} medias…`);
  const medRows = await db
    .insert(medias)
    .values(
      seed.medias.map((m) => ({
        kind: m.kind,
        url: m.url,
        filename: m.filename,
        alt: m.alt,
        caption: m.caption,
        sizeBytes: m.sizeBytes,
        width: m.width,
        height: m.height,
        pageCount: m.pageCount,
        createdAt: new Date(m.createdAt),
      })),
    )
    .returning({ id: medias.id });
  const medMap = new Map<string, string>(
    seed.medias.map((m, i) => [m.id, medRows[i].id]),
  );

  console.log(`Seeding ${seed.users.length} users…`);
  const userRows = await db
    .insert(users)
    .values(
      seed.users.map((u) => ({
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        status: u.status,
        lastLoginAt: isoToDate(u.lastLoginAt),
        createdAt: new Date(u.createdAt),
      })),
    )
    .returning({ id: users.id });
  const userMap = new Map<string, string>(
    seed.users.map((u, i) => [u.id, userRows[i].id]),
  );

  console.log(`Seeding ${seed.articles.length} articles…`);
  const artRows = await db
    .insert(articles)
    .values(
      seed.articles.map((a) => {
        const catId = catMap.get(a.categoryId);
        const authId = authMap.get(a.authorId);
        if (!catId) throw new Error(`Missing category mapping for ${a.id}`);
        if (!authId) throw new Error(`Missing author mapping for ${a.id}`);
        return {
          title: a.title,
          slug: a.slug,
          seoExcerpt: a.seoExcerpt,
          metaDescription: a.metaDescription,
          metaKeywords: a.metaKeywords,
          contentHtml: a.contentHtml,
          coverMediaId: a.coverMediaId ? medMap.get(a.coverMediaId) : null,
          readingMinutes: a.readingMinutes,
          categoryId: catId,
          authorId: authId,
          faqs: a.faqs,
          status: a.status,
          publishedAt: isoToDate(a.publishedAt),
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
        };
      }),
    )
    .returning({ id: articles.id });
  const artMap = new Map<string, string>(
    seed.articles.map((a, i) => [a.id, artRows[i].id]),
  );

  const articleMediaLinks: {
    articleId: string;
    mediaId: string;
    position: number;
  }[] = [];
  for (const a of seed.articles) {
    const newArticleId = artMap.get(a.id);
    if (!newArticleId) continue;
    a.attachedMediaIds.forEach((oldMediaId, position) => {
      const newMediaId = medMap.get(oldMediaId);
      if (!newMediaId) return;
      articleMediaLinks.push({
        articleId: newArticleId,
        mediaId: newMediaId,
        position,
      });
    });
  }

  if (articleMediaLinks.length > 0) {
    console.log(`Linking ${articleMediaLinks.length} article ↔ media rows…`);
    await db.insert(articleMedias).values(articleMediaLinks);
  }

  console.log(`Seeding ${seed.contacts.length} contacts…`);
  await db.insert(contacts).values(
    seed.contacts.map((c) => ({
      name: c.name,
      email: c.email,
      subject: c.subject,
      message: c.message,
      status: c.status,
      createdAt: new Date(c.createdAt),
      handledAt: isoToDate(c.handledAt),
      handledByUserId: c.handledByUserId
        ? (userMap.get(c.handledByUserId) ?? null)
        : null,
    })),
  );

  console.log("Seed complete.");
  await client.end();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
