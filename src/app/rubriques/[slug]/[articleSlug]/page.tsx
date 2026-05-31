import { cache } from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { ArticlesRepo } from "@/lib/db/repositories/articles";
import type {
  PublishedArticleSummary,
  PublishedArticleDetail,
} from "@/lib/db/repositories/articles";
import { absoluteUrl, SITE_NAME, TWITTER_HANDLE } from "@/lib/site";
import { Header } from "@/components/header";
import { Footer, NewsletterBlock } from "@/components/footer";
import {
  ArticleCard,
  ArticleMeta,
  Breadcrumbs,
  type ArticleCardItem,
} from "@/components/article-card";
import { Tag, Icon, Placeholder } from "@/components/atoms";
import { buildArticleToc } from "@/lib/article-toc";
import { formatDate } from "@/lib/dates";
import { buildFaqPage } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";

export const revalidate = 3600;

const loadPublishedView = cache((articleSlug: string) =>
  ArticlesRepo.getPublishedView(articleSlug),
);

function buildArticleHref(categorySlug: string, articleSlug: string): string {
  return `/rubriques/${categorySlug}/${articleSlug}`;
}

// export async function generateStaticParams() {
//   const routes = await ArticlesRepo.listPublishedRoutes();
//   return routes.map((r) => ({
//     slug: r.categorySlug,
//     articleSlug: r.articleSlug,
//   }));
// }

/**
 * Resolves an article URL. Tries the live (categorySlug, articleSlug) pair
 * first; if it doesn't match, looks up the redirect history and triggers a
 * 301 to the current canonical URL. Returns null only when nothing matches.
 */
async function resolveDetail(
  categorySlug: string,
  articleSlug: string,
): Promise<PublishedArticleDetail | null> {
  const detail = await loadPublishedView(articleSlug);
  if (detail && detail.categorySlug === categorySlug) return detail;

  const redirect = await ArticlesRepo.findHistoricalRoute(
    categorySlug,
    articleSlug,
  );
  if (redirect) {
    permanentRedirect(
      buildArticleHref(redirect.categorySlug, redirect.articleSlug),
    );
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; articleSlug: string }>;
}): Promise<Metadata> {
  const { slug, articleSlug } = await params;
  const detail = await resolveDetail(slug, articleSlug);
  if (!detail) return {};

  const {
    article,
    categoryName,
    categorySlug,
    authorName,
    coverUrl,
    coverAlt,
  } = detail;
  const description = article.metaDescription || article.seoExcerpt;
  const url = absoluteUrl(buildArticleHref(categorySlug, article.slug));
  const image = coverUrl ? absoluteUrl(coverUrl) : null;
  const ogImages = image
    ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: coverAlt ?? article.title,
        },
      ]
    : undefined;

  return {
    title: article.title,
    description,
    keywords:
      article.metaKeywords.length > 0 ? article.metaKeywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "fr_FR",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt?.toISOString(),
      authors: [authorName],
      section: categoryName,
      tags: article.metaKeywords,
      images: ogImages,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: article.title,
      description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      images: image ? [image] : undefined,
    },
  };
}

function formatLong(d: Date | null): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Returns a formatted "MAJ" string only if the article was meaningfully
 * updated — at least one full day after publication. Edits done within 24h
 * of publishing are treated as part of the publishing pass, not a real update.
 */
function meaningfulUpdate(
  published: Date | null,
  updated: Date | null,
): string | undefined {
  if (!published || !updated) return undefined;
  if (updated.getTime() - published.getTime() < ONE_DAY_MS) return undefined;
  return formatLong(updated);
}

function toCardItem(r: PublishedArticleSummary): ArticleCardItem {
  return {
    cat: r.categoryName,
    title: r.title,
    dek: r.seoExcerpt,
    author: r.authorName,
    date: formatDate(r.publishedAt),
    read: r.readingMinutes,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; articleSlug: string }>;
}) {
  const { slug, articleSlug } = await params;

  const detail = await resolveDetail(slug, articleSlug);
  if (!detail) notFound();
  const { article, categoryName, categorySlug, authorName } = detail;

  const [related, others] = await Promise.all([
    ArticlesRepo.listPublishedInCategory(article.categoryId, {
      excludeArticleId: article.id,
      limit: 4,
    }),
    ArticlesRepo.listPublishedOutsideCategory(article.categoryId, {
      excludeArticleId: article.id,
      limit: 4,
    }),
  ]);

  const { entries: tocEntries, html: contentHtmlWithIds } = buildArticleToc(
    article.contentHtml,
  );

  return (
    <div className="mc-root w-full max-w-[1280px] mx-auto">
      <JsonLd data={buildFaqPage(article.faqs)} />
      <Header active={categorySlug} />
      <section className="px-4 md:px-7 pt-4">
        <Breadcrumbs
          trail={["Accueil", "Rubriques", categoryName, article.title]}
        />
      </section>

      <section className="px-4 md:px-7 pt-6 pb-7 border-b border-ink">
        <div className="max-w-[880px]">
          <Tag kind="signal">{categoryName}</Tag>
          <h1 className="h-display text-3xl md:text-5xl lg:text-[56px] mt-3.5 max-w-[920px]">
            {article.title}
          </h1>
          {article.seoExcerpt ? (
            <p className="font-serif italic text-lg md:text-xl lg:text-[22px] text-ink-2 mt-3.5 max-w-[720px] leading-snug tracking-tight">
              {article.seoExcerpt}
            </p>
          ) : null}
        </div>
        <div className="mt-5 flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto] md:gap-5 md:items-center">
          <ArticleMeta
            author={authorName}
            role="Pôle énergie"
            published={formatLong(article.publishedAt)}
            updated={meaningfulUpdate(article.publishedAt, article.updatedAt)}
            readMin={article.readingMinutes}
            category={categoryName}
          />
          <div className="flex flex-wrap gap-2">
            <button className="btn btn--ghost btn--sm">
              <Icon.bookmark /> Sauver
            </button>
            <button className="btn btn--ghost btn--sm">Partager</button>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-7 py-6 border-b border-ink">
        <Placeholder
          caption={`hero · ${categoryName}`}
          className="aspect-[21/9]"
        />
        <div className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute mt-2 flex flex-col md:flex-row md:justify-between gap-1">
          <span>Photo · {SITE_NAME}</span>
          <span>{categoryName}</span>
        </div>
      </section>

      <section className="px-4 md:px-7 py-8 grid grid-cols-1 lg:grid-cols-[200px_1fr_280px] gap-8 border-b border-ink">
        {tocEntries.length > 0 ? (
          <aside className="lg:sticky lg:top-[100px] lg:self-start">
            <div className="h-section mb-2.5">—— Sommaire</div>
            <ol className="list-none p-0 m-0">
              {tocEntries.map((entry, i) => (
                <li
                  key={entry.id}
                  className="border-l-2 border-paper-line py-1.5 pl-3 text-xs text-ink-3 hover:border-signal hover:text-ink"
                >
                  <a
                    href={`#${entry.id}`}
                    className="no-underline text-inherit flex items-baseline gap-1.5"
                  >
                    <span className="mono text-[10px] text-ink-mute">
                      0{i + 1}
                    </span>
                    {entry.text}
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        ) : (
          <div className="hidden lg:block" />
        )}

        <article>
          <div
            className="prose"
            data-density="comfortable"
            dangerouslySetInnerHTML={{ __html: contentHtmlWithIds }}
          />

          {article.faqs.length > 0 ? (
            <section className="mt-10">
              <div className="h-section mb-4">—— FAQ</div>
              <div className="grid gap-4">
                {article.faqs.map((f, i) => (
                  <details
                    key={i}
                    className="tick-frame p-4 bg-paper-2 [&_summary]:cursor-pointer"
                  >
                    <span className="tick-bl"></span>
                    <span className="tick-br"></span>
                    <summary className="text-base font-semibold list-none">
                      {f.question}
                    </summary>
                    <p className="text-sm text-ink-2 mt-2 leading-[1.55]">
                      {f.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <aside>
          {related.length > 0 ? (
            <div className="tick-frame p-3.5">
              <span className="tick-bl"></span>
              <span className="tick-br"></span>
              <div className="h-section">—— Articles liés</div>
              <div className="mt-2.5">
                {related.map((r) => (
                  <ArticleCard
                    key={r.id}
                    item={toCardItem(r)}
                    href={buildArticleHref(r.categorySlug, r.slug)}
                    kind="mini"
                  />
                ))}
              </div>
            </div>
          ) : null}
          {others.length > 0 ? (
            <div className="tick-frame p-3.5 mt-4">
              <span className="tick-bl"></span>
              <span className="tick-br"></span>
              <div className="h-section">—— À découvrir aussi</div>
              <div className="mt-2.5">
                {others.map((r) => (
                  <ArticleCard
                    key={r.id}
                    item={toCardItem(r)}
                    href={buildArticleHref(r.categorySlug, r.slug)}
                    kind="mini"
                  />
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-4 p-3.5 bg-ink text-paper border border-ink">
            <div className="mono text-[9px] tracking-[0.16em] uppercase text-signal">
              ◉ DEVENIR PRO
            </div>
            <div className="text-base font-bold mt-1.5 leading-tight">
              Passez la certification {SITE_NAME}
            </div>
            <Link href="/qcm" className="btn btn--signal btn--sm mt-2.5">
              Voir le QCM →
            </Link>
          </div>
        </aside>
      </section>

      <section className="px-4 md:px-7 py-9">
        <NewsletterBlock />
      </section>
      <Footer />
    </div>
  );
}
