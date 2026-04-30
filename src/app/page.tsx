import Link from "next/link";
import { Header } from "@/components/header";
import { Footer, NewsletterBlock } from "@/components/footer";
import { Icon, Placeholder, Tag } from "@/components/atoms";
import { ArticleCard, ArticleMeta } from "@/components/article-card";
import { CATEGORIES, SAMPLE_ARTICLES } from "@/lib/data";

const TESTIMONIALS = [
  {
    who: "Hélène D.",
    role: "Propriétaire, Nantes",
    quote:
      "Avant Maison Calorie, je signais des devis sans rien comprendre. Aujourd’hui je sais lire un DPE et négocier.",
  },
  {
    who: "Mathieu R.",
    role: "Artisan RGE, Rennes",
    quote:
      "Le QCM m’a permis de monter en compétence sur les pompes à chaleur — bien plus utile qu’une formation sur PowerPoint.",
  },
  {
    who: "Sarah K.",
    role: "Copropriété, Lyon",
    quote:
      "Le dossier sur la VMC double flux nous a évité 8 000 € d’erreur. Les fiches PDF sont une mine.",
  },
];

const CAT_ICONS = [
  { c: CATEGORIES[0], n: 124, ic: <Icon.wall /> },
  { c: CATEGORIES[1], n: 87, ic: <Icon.pump /> },
  { c: CATEGORIES[2], n: 56, ic: <Icon.sun /> },
  { c: CATEGORIES[3], n: 41, ic: <Icon.vent /> },
  { c: CATEGORIES[4], n: 33, ic: <Icon.house /> },
  { c: CATEGORIES[5], n: 72, ic: <Icon.doc /> },
  { c: CATEGORIES[6], n: 64, ic: <Icon.bookmark /> },
  { c: CATEGORIES[7], n: 218, ic: <Icon.clock /> },
];

export default function HomePage() {
  const a = SAMPLE_ARTICLES;
  return (
    <div className="mc-root">
      <Header />

      <section className="px-4 py-6 md:px-7 md:pt-8 md:pb-6 border-b border-ink">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-stretch">
          <div>
            <div className="mono text-[10px] tracking-[0.16em] uppercase text-signal mb-3">
              ◉ À la une — n° {a[0].id}
            </div>
            <h1 className="h-display text-4xl md:text-5xl lg:text-6xl xl:text-[64px] m-0 max-w-[720px]">
              {a[0].title}
            </h1>
            <p className="text-lg text-ink-3 mt-[14px] max-w-[620px] leading-[1.4]">
              {a[0].dek}
            </p>
            <div className="mt-[18px]">
              <ArticleMeta
                author={a[0].author}
                role="Journaliste senior"
                published={a[0].date}
                updated="ce matin"
                readMin={a[0].read}
                category={a[0].cat}
              />
            </div>
            <Link
              href={`/article/${a[0].id}`}
              className="btn btn--primary mt-[22px]"
            >
              Lire l’enquête <Icon.arrowR />
            </Link>
          </div>
          <div className="tick-frame relative min-h-[360px]">
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <Placeholder
              caption="reportage · pompe à chaleur en cours d’installation"
              className="h-full border-0"
            />
            <div className="mono absolute bottom-2 left-2 right-2 text-[9px] tracking-[0.08em] uppercase text-ink-mute flex justify-between bg-paper px-[6px] py-1 border border-paper-line">
              <span>Crédit · S. Berthier</span>
              <span>3 312 × 2 208 px · ƒ/4 · 1/250 s</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper px-4 py-8 md:px-7 md:py-11 border-b border-ink">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="mono text-[10px] tracking-[0.16em] uppercase text-signal">
              ◉ NOTRE OUTIL PRO
            </div>
            <h2 className="h-display text-3xl md:text-4xl lg:text-[56px] mt-[10px] mb-0">
              Le QCM <span className="text-signal">Maison Calorie</span>.
              <br />
              30 questions. 1 certification.
            </h2>
            <p className="text-[15px] text-paper-3 mt-[14px] max-w-[540px] leading-[1.5]">
              Devenez auditeur RGE certifié pour réaliser les diagnostics
              énergétiques chez les particuliers et accéder aux outils Maison
              Calorie. Pass à l’unité, sans abonnement.
            </p>
            <Link href="/qcm" className="btn btn--signal mt-[18px]">
              Voir les passes <Icon.arrowR />
            </Link>
          </div>
          <div className="border border-paper-3 p-6">
            <div className="mono text-[9px] tracking-[0.16em] uppercase text-paper-3">
              EXTRAIT — QUESTION 12 / 30
            </div>
            <div className="font-serif italic text-2xl leading-[1.25] mt-3">
              « Pour une PAC air-eau installée en 2026 sur réseau radiateurs
              basse température, quel est le COP minimum imposé par le décret du
              14 avril ? »
            </div>
            <div className="mt-4 grid gap-[6px]">
              {["A · 2,8", "B · 3,2", "C · 3,5", "D · 3,8"].map((o, i) => (
                <div
                  key={i}
                  className={`mono text-[11px] px-[10px] py-2 border border-paper-3 tracking-[0.04em] ${
                    i === 2 ? "text-signal" : "text-paper"
                  }`}
                >
                  {o}
                  {i === 2 ? " ◉" : ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 md:px-7 md:py-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_320px] gap-6 border-b border-ink">
        <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-section col-span-full flex justify-between items-baseline">
            <span>—— Derniers articles</span>
            <Link
              href="/rubriques/pompes"
              className="mono lnk text-[10px] border-b-0 text-ink"
            >
              Voir tous les articles →
            </Link>
          </div>
          {a.slice(1, 7).map((it) => (
            <ArticleCard key={it.id} item={it} kind="card" />
          ))}
        </div>

        <aside className="border-paper-line lg:border-l lg:pl-6 lg:sticky lg:top-[100px] lg:self-start">
          <div className="h-section mb-3">—— Les + lus cette semaine</div>
          {a.slice(0, 5).map((it, i) => (
            <Link
              key={it.id}
              href={`/article/${it.id}`}
              className="grid grid-cols-[20px_1fr] gap-[10px] py-[10px] border-b border-paper-line no-underline text-ink"
            >
              <span className="mono text-[22px] font-semibold text-signal leading-none">
                {i + 1}
              </span>
              <div>
                <div className="mono text-[9px] tracking-[0.08em] uppercase text-ink-mute">
                  {it.cat}
                </div>
                <div className="font-semibold text-[13px] leading-[1.25] tracking-[-0.01em] mt-[2px]">
                  {it.title}
                </div>
              </div>
            </Link>
          ))}

          <div className="mt-6 border border-ink bg-ink text-paper p-4">
            <div className="mono text-[9px] tracking-[0.16em] uppercase text-signal">
              ◉ Sponsorisé · Maison
            </div>
            <div className="text-lg font-bold tracking-[-0.02em] mt-[6px] leading-[1.15]">
              Devenez auditeur RGE certifié en 30 questions.
            </div>
            <div className="text-xs text-paper-3 mt-[6px]">
              Pass à 49 € — accès aux outils de diagnostic après réussite. 1 200
              pros déjà certifiés.
            </div>
            <Link href="/qcm" className="btn btn--signal btn--sm mt-3">
              Voir le QCM →
            </Link>
          </div>
        </aside>
      </section>

      <section className="px-4 py-6 md:px-7 md:py-9 border-b border-ink bg-paper-2">
        <div className="h-section mb-4">—— Dossier promu de la quinzaine</div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
          <Placeholder
            caption="schéma · stratigraphie murale"
            className="aspect-[4/3]"
          />
          <div>
            <Tag kind="signal">Dossier · 6 articles</Tag>
            <h2 className="h-title text-2xl md:text-3xl lg:text-[44px] mt-3 max-w-[560px]">
              Tout savoir sur l’isolation par l’extérieur — sans se faire
              arnaquer.
            </h2>
            <p className="text-[15px] text-ink-3 mt-3 max-w-[540px] leading-[1.5]">
              Six articles, vingt-deux fiches techniques, quatre tableurs de
              comparaison, un guide de devis annoté ligne par ligne. Réservé aux
              abonnés du bulletin.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn btn--primary">
                Ouvrir le dossier <Icon.arrowR />
              </button>
              <button className="btn btn--ghost">Aperçu PDF (12 p.)</button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 md:px-7 md:py-9 border-b border-ink">
        <div className="h-section mb-4">—— Naviguer par rubrique</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CAT_ICONS.map(({ c, n, ic }) => (
            <Link
              key={c.slug}
              href={`/rubriques/${c.slug}`}
              className="tick-frame p-[14px] no-underline text-ink flex flex-col gap-2 min-h-[100px]"
            >
              <span className="tick-bl"></span>
              <span className="tick-br"></span>
              <div className="flex justify-between items-start">
                <div className="w-7 h-7">{ic}</div>
                <span className="mono text-[10px] text-ink-mute">
                  {n} art.
                </span>
              </div>
              <div className="text-sm font-bold tracking-[-0.01em] mt-auto">
                {c.label}
              </div>
              <div className="mono text-[9px] tracking-[0.08em] uppercase text-signal">
                Explorer ↗
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 py-6 md:px-7 md:py-9 border-b border-ink">
        <div className="flex flex-wrap justify-between items-baseline gap-4 mb-5">
          <div>
            <div className="h-section">—— Ils nous lisent</div>
            <div className="h-title text-[32px] mt-[6px]">
              22 800 lecteurs · Note moyenne{" "}
              <span className="text-signal">4,8 / 5</span>
            </div>
          </div>
          <div className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute">
            Source : enquête lecteurs MC, mars 2026 · n=1 482
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <figure key={t.who} className="tick-frame p-5 m-0">
              <span className="tick-bl"></span>
              <span className="tick-br"></span>
              <div className="mono text-[22px] text-signal leading-none">
                “
              </div>
              <blockquote className="m-0 text-[15px] leading-[1.45] text-ink-2 tracking-[-0.01em]">
                {t.quote}
              </blockquote>
              <figcaption className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute mt-[14px] pt-[10px] border-t border-paper-line">
                <span className="text-ink">{t.who}</span> · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="px-4 py-6 md:px-7 md:py-9">
        <NewsletterBlock />
      </section>

      <Footer />
    </div>
  );
}
