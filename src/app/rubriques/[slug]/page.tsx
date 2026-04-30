import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, SAMPLE_ARTICLES } from "@/lib/data";
import { Header } from "@/components/header";
import { Footer, NewsletterBlock } from "@/components/footer";
import { ArticleCard, Breadcrumbs } from "@/components/article-card";
import { Tag, Icon } from "@/components/atoms";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();
  const articles = SAMPLE_ARTICLES;
  const subThemes: [string, number][] = [
    ["Air-eau", 24],
    ["Air-air", 18],
    ["Géothermie", 9],
    ["Hybride gaz", 7],
    ["Solaire-thermique", 6],
    ["Maintenance", 12],
    ["Bruit", 5],
    ["Subventions", 14],
  ];
  const docs: [string, string][] = [
    ["Décret PAC du 14 avr. 2026", "184 ko"],
    ["Grille MaPrimeRénov’ Q2", "92 ko"],
    ["Comparatif COP 18 modèles", "1,2 Mo"],
  ];
  return (
    <div className="mc-root w-full max-w-[1280px] mx-auto">
      <Header active={slug} />
      <section className="px-4 md:px-7 pt-5">
        <Breadcrumbs trail={["Accueil", "Rubriques", cat.label]} />
      </section>
      <section className="px-4 md:px-7 pt-5 pb-7 border-b border-ink">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto] md:gap-6 md:items-end">
          <div>
            <Tag kind="signal">Rubrique</Tag>
            <h1 className="h-display text-4xl md:text-5xl lg:text-[64px] mt-2">
              {cat.label}.
            </h1>
            <p className="text-base text-ink-3 mt-2.5 max-w-[620px] leading-[1.45]">
              Toute l’actualité, les enquêtes et les fiches techniques sur les{" "}
              {cat.label.toLowerCase()} en France métropolitaine. Mis à jour
              quotidiennement.
            </p>
          </div>
          <div className="mono text-[11px] text-ink-mute md:text-right">
            <div>87 articles</div>
            <div>14 fiches PDF</div>
            <div>3 dossiers actifs</div>
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
          {articles.map((it) => (
            <ArticleCard key={it.id} item={it} kind="list" />
          ))}
          <div className="mt-6 flex justify-between items-center">
            <button className="btn btn--ghost btn--sm">
              <Icon.arrowL /> Précédent
            </button>
            <div className="mono text-[11px] text-ink-mute">Page 1 sur 9</div>
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
              {subThemes.map(([t, n]) => (
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
          <div className="tick-frame p-4 mt-5">
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <div className="h-section">—— Documents PDF récents</div>
            {docs.map(([n, s]) => (
              <a
                key={n}
                href="#"
                className="grid grid-cols-[20px_1fr_auto] gap-2 py-2.5 border-b border-paper-line no-underline text-ink items-center"
              >
                <Icon.doc />
                <span className="text-xs font-medium leading-[1.25]">{n}</span>
                <span className="mono text-[10px] text-ink-mute">{s}</span>
              </a>
            ))}
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
