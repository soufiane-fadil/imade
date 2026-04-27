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
    <div className="mc-root" style={{ width: 1280 }}>
      <Header active={slug} />
      <section style={{ padding: "20px 28px 0" }}>
        <Breadcrumbs trail={["Accueil", "Rubriques", cat.label]} />
      </section>
      <section
        style={{
          padding: "20px 28px 28px",
          borderBottom: "1px solid var(--ink)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 24,
            alignItems: "end",
          }}
        >
          <div>
            <Tag kind="signal">Rubrique</Tag>
            <h1
              className="h-display"
              style={{ fontSize: 64, margin: "8px 0 0" }}
            >
              {cat.label}.
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "var(--ink-3)",
                marginTop: 10,
                maxWidth: 620,
                lineHeight: 1.45,
              }}
            >
              Toute l’actualité, les enquêtes et les fiches techniques sur les{" "}
              {cat.label.toLowerCase()} en France métropolitaine. Mis à jour
              quotidiennement.
            </p>
          </div>
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-mute)",
              textAlign: "right",
            }}
          >
            <div>87 articles</div>
            <div>14 fiches PDF</div>
            <div>3 dossiers actifs</div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "12px 28px",
          borderBottom: "1px solid var(--paper-line)",
          display: "flex",
          gap: 16,
          alignItems: "center",
          background: "var(--paper-2)",
        }}
      >
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
        <span style={{ flex: 1 }} />
        <span className="lbl">Trier ▸</span>
        <select
          defaultValue="recent"
          className="mono"
          style={{
            background: "var(--paper)",
            border: "1px solid var(--ink)",
            padding: "6px 10px",
            fontSize: 11,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <option value="recent">Plus récent</option>
          <option value="read">Plus lu</option>
          <option value="long">Plus long</option>
        </select>
      </section>

      <section
        style={{
          padding: "24px 28px",
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 32,
          borderBottom: "1px solid var(--ink)",
        }}
      >
        <div>
          {articles.map((it) => (
            <ArticleCard key={it.id} item={it} kind="list" />
          ))}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button className="btn btn--ghost btn--sm">
              <Icon.arrowL /> Précédent
            </button>
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-mute)" }}
            >
              Page 1 sur 9
            </div>
            <button className="btn btn--sm">
              Suivant <Icon.arrowR />
            </button>
          </div>
        </div>
        <aside>
          <div className="tick-frame" style={{ padding: 16 }}>
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <div className="h-section">—— Sous-thèmes</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
              {subThemes.map(([t, n]) => (
                <li
                  key={t}
                  className="mono"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px dashed var(--paper-line)",
                    fontSize: 11,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  <Link
                    href="#"
                    style={{ color: "var(--ink)", textDecoration: "none" }}
                  >
                    {t}
                  </Link>
                  <span style={{ color: "var(--ink-mute)" }}>{n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="tick-frame" style={{ padding: 16, marginTop: 20 }}>
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <div className="h-section">—— Documents PDF récents</div>
            {docs.map(([n, s]) => (
              <a
                key={n}
                href="#"
                style={{
                  display: "grid",
                  gridTemplateColumns: "20px 1fr auto",
                  gap: 8,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--paper-line)",
                  textDecoration: "none",
                  color: "var(--ink)",
                  alignItems: "center",
                }}
              >
                <Icon.doc />
                <span
                  style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.25 }}
                >
                  {n}
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 10, color: "var(--ink-mute)" }}
                >
                  {s}
                </span>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <NewsletterBlock compact />
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  );
}
