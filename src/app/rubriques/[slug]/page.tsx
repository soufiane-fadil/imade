import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoriesRepo } from "@/lib/db/repositories/categories";
import { ArticlesRepo } from "@/lib/db/repositories/articles";
import { Header } from "@/components/header";
import { Footer, NewsletterBlock } from "@/components/footer";
import {
  ArticleCard,
  Breadcrumbs,
  type ArticleCardItem,
} from "@/components/article-card";
import { Tag, Icon } from "@/components/atoms";
import { QcmPromoBlock } from "@/components/qcm-promo";
import { formatDate } from "@/lib/dates";

export const revalidate = 3600;

const PAGE_SIZE = 10;

function parsePage(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export async function generateStaticParams() {
  const cats = await CategoriesRepo.listNav();
  return cats.map((c) => ({ slug: c.slug }));
}

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const cat = await CategoriesRepo.getBySlug(slug);
  if (!cat) notFound();

  const total = await ArticlesRepo.countPublishedInCategory(cat.id);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(parsePage(pageParam), totalPages);

  const articles = await ArticlesRepo.listPublishedInCategory(cat.id, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const items: { item: ArticleCardItem; href: string; key: string }[] =
    articles.map((a) => ({
      key: a.id,
      href: `/rubriques/${cat.slug}/${a.slug}`,
      item: {
        cat: cat.name,
        title: a.title,
        dek: a.seoExcerpt,
        author: a.authorName,
        date: formatDate(a.publishedAt),
        read: a.readingMinutes,
      },
    }));

  const pageHref = (n: number) =>
    n === 1 ? `/rubriques/${cat.slug}` : `/rubriques/${cat.slug}?page=${n}`;

  return (
    <div className="mc-root w-full max-w-[1280px] mx-auto">
      <Header active={slug} />
      <section className="px-4 md:px-7 pt-5">
        <Breadcrumbs
          trail={[{ label: "Accueil", href: "/" }, "Rubriques", cat.name]}
        />
      </section>
      <section className="px-4 md:px-7 pt-5 pb-7 border-b border-ink">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto] md:gap-6 md:items-end">
          <div>
            <Tag kind="signal">Rubrique</Tag>
            <h1 className="h-display text-4xl md:text-5xl lg:text-[64px] mt-2">
              {cat.name}.
            </h1>
            {cat.descriptionHtml ? (
              <div
                className="text-base text-ink-3 mt-2.5 max-w-[620px] leading-[1.45] [&_a]:text-plot [&_a]:border-b [&_a]:border-current [&_strong]:text-ink"
                dangerouslySetInnerHTML={{ __html: cat.descriptionHtml }}
              />
            ) : null}
          </div>
          <div className="mono text-[11px] text-ink-mute md:text-right">
            <div>
              {total} article{total > 1 ? "s" : ""} publié
              {total > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-7 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 border-b border-ink">
        <div>
          {items.length === 0 ? (
            <div className="mono text-[12px] text-ink-mute py-12 text-center">
              Aucun article publié dans cette rubrique pour le moment.
            </div>
          ) : (
            items.map((it) => (
              <ArticleCard
                key={it.key}
                item={it.item}
                href={it.href}
                kind="list"
              />
            ))
          )}
          {totalPages > 1 ? (
            <div className="mt-6 flex justify-between items-center">
              {page > 1 ? (
                <Link
                  href={pageHref(page - 1)}
                  className="btn btn--ghost btn--sm"
                >
                  <Icon.arrowL /> Précédent
                </Link>
              ) : (
                <span />
              )}
              <div className="mono text-[11px] text-ink-mute">
                Page {page} sur {totalPages}
              </div>
              {page < totalPages ? (
                <Link href={pageHref(page + 1)} className="btn btn--sm">
                  Suivant <Icon.arrowR />
                </Link>
              ) : (
                <span />
              )}
            </div>
          ) : null}
        </div>
        <aside>
          <QcmPromoBlock />
          <div className="mt-5">
            <NewsletterBlock compact />
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  );
}
