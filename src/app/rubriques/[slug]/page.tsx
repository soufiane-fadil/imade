import { notFound } from "next/navigation";
import Link from "next/link";
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
import { formatDate } from "@/lib/dates";

export const revalidate = 3600;

export async function generateStaticParams() {
  const cats = await CategoriesRepo.listNav();
  return cats.map((c) => ({ slug: c.slug }));
}

const SUB_THEMES: ReadonlyArray<[string, number]> = [
  ["Air-eau", 24],
  ["Air-air", 18],
  ["Géothermie", 9],
  ["Hybride gaz", 7],
  ["Solaire-thermique", 6],
  ["Maintenance", 12],
  ["Bruit", 5],
  ["Subventions", 14],
];

const DOCS: ReadonlyArray<[string, string]> = [
  ["Décret PAC du 14 avr. 2026", "184 ko"],
  ["Grille MaPrimeRénov’ Q2", "92 ko"],
  ["Comparatif COP 18 modèles", "1,2 Mo"],
];

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await CategoriesRepo.getBySlug(slug);
  if (!cat) notFound();

  const articles = await ArticlesRepo.listPublishedInCategory(cat.id);

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

  return (
    <div className="mc-root w-full max-w-[1280px] mx-auto">
      <Header active={slug} />
      <section className="px-4 md:px-7 pt-5">
        <Breadcrumbs trail={["Accueil", "Rubriques", cat.name]} />
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
              {articles.length} article{articles.length > 1 ? "s" : ""} publié
              {articles.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-7 py-3 border-b border-paper-line flex flex-wrap gap-2 md:gap-4 items-center bg-paper-2">
        <span className="lbl">Filtrer ▸</span>
        {[
          "Tous",
          "Décryptages",
          "Enquêtes",
          "Fiches techniques",
          "Tribunes",
          "Actualités",
        ].map((t, i) => (
          <button
            key={t}
            className={"btn btn--sm " + (i === 0 ? "" : "btn--ghost")}
          >
            {t}
          </button>
        ))}
        <span className="hidden md:block flex-1" />
        <span className="lbl">Trier ▸</span>
        <select
          defaultValue="recent"
          className="mono bg-paper border border-ink px-2.5 py-1.5 text-[11px] tracking-[0.04em] uppercase"
        >
          <option value="recent">Plus récent</option>
          <option value="read">Plus lu</option>
          <option value="long">Plus long</option>
        </select>
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
          <div className="mt-6 flex justify-between items-center">
            <button className="btn btn--ghost btn--sm">
              <Icon.arrowL /> Précédent
            </button>
            <div className="mono text-[11px] text-ink-mute">Page 1 sur 1</div>
            <button className="btn btn--sm">
              Suivant <Icon.arrowR />
            </button>
          </div>
        </div>
        <aside>
          <div className="tick-frame p-4">
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <div className="h-section">—— Sous-thèmes</div>
            <ul className="list-none p-0 mt-3 mb-0 mx-0">
              {SUB_THEMES.map(([t, n]) => (
                <li
                  key={t}
                  className="mono flex justify-between py-1.5 border-b border-dashed border-paper-line text-[11px] tracking-[0.04em] uppercase"
                >
                  <Link href="#" className="text-ink no-underline">
                    {t}
                  </Link>
                  <span className="text-ink-mute">{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <NewsletterBlock compact />
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  );
}
