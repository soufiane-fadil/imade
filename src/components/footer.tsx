import Link from "next/link";
import { CATEGORIES } from "@/lib/data";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "3px double var(--ink)",
        marginTop: 48,
        background: "var(--paper)",
      }}
    >
      <div
        style={{
          padding: "32px 28px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1.4fr",
          gap: 28,
          borderBottom: "1px solid var(--paper-line)",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.04em",
            }}
          >
            Maison<span style={{ color: "var(--signal)" }}>·</span>Calorie
          </div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.16em",
              color: "var(--ink-mute)",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Édition n° 04 / 27 — Paris
          </div>
          <p
            style={{
              fontSize: 12,
              color: "var(--ink-3)",
              marginTop: 16,
              lineHeight: 1.5,
              maxWidth: 280,
            }}
          >
            Le journal indépendant de la rénovation énergétique en France.
            Articles, dossiers et certification professionnelle pour bâtir
            mieux, chauffer moins.
          </p>
        </div>
        <div>
          <div className="h-section">Rubriques</div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "12px 0 0",
              fontSize: 12,
              lineHeight: 2,
            }}
          >
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/rubriques/${c.slug}`}
                  className="lnk"
                  style={{ borderBottom: 0 }}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="h-section">Le QCM</div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "12px 0 0",
              fontSize: 12,
              lineHeight: 2,
            }}
          >
            <li>
              <Link href="/qcm" className="lnk" style={{ borderBottom: 0 }}>
                Présentation
              </Link>
            </li>
            <li>
              <Link href="/qcm" className="lnk" style={{ borderBottom: 0 }}>
                Tarifs &amp; passes
              </Link>
            </li>
            <li>
              <Link
                href="/qcm/code"
                className="lnk"
                style={{ borderBottom: 0 }}
              >
                Saisir un code
              </Link>
            </li>
            <li>
              <Link href="/qcm" className="lnk" style={{ borderBottom: 0 }}>
                Méthodologie
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="h-section">Maison</div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "12px 0 0",
              fontSize: 12,
              lineHeight: 2,
            }}
          >
            <li>
              <Link href="/" className="lnk" style={{ borderBottom: 0 }}>
                À propos
              </Link>
            </li>
            <li>
              <Link href="/contact" className="lnk" style={{ borderBottom: 0 }}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/" className="lnk" style={{ borderBottom: 0 }}>
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/" className="lnk" style={{ borderBottom: 0 }}>
                Politique RGPD
              </Link>
            </li>
            <li>
              <Link href="/" className="lnk" style={{ borderBottom: 0 }}>
                Charte éditoriale
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="h-section">Suivre</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginTop: 12,
            }}
          >
            {[
              ["LinkedIn", "/in/maison-calorie"],
              ["Twitter / X", "@maisoncalorie"],
              ["YouTube", "/c/maisoncalorie"],
              ["RSS", "/feed.xml"],
              ["Mastodon", "@mc@piaille.fr"],
            ].map(([k, v]) => (
              <a
                key={k}
                href="#"
                className="mono"
                style={{
                  fontSize: 11,
                  display: "flex",
                  justifyContent: "space-between",
                  textDecoration: "none",
                  color: "var(--ink)",
                  borderBottom: "1px dashed var(--paper-line)",
                  padding: "4px 0",
                }}
              >
                <span
                  style={{
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {k}
                </span>
                <span style={{ color: "var(--ink-mute)" }}>{v}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div
        className="mono"
        style={{
          padding: "12px 28px",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-mute)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          © 2026 SAS Maison Calorie · RCS Paris 912 448 211 · TVA FR 87 912 448
          211
        </span>
        <span>v 4.27.0 — Build #1042</span>
      </div>
    </footer>
  );
}

export function NewsletterBlock({ compact }: { compact?: boolean }) {
  return (
    <div
      style={{
        border: "1px solid var(--ink)",
        padding: compact ? 18 : 28,
        background: "var(--paper-2)",
        position: "relative",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--signal)",
        }}
      >
        ◉ Bulletin hebdomadaire
      </div>
      <div
        className="h-title"
        style={{ fontSize: compact ? 22 : 30, marginTop: 6, maxWidth: 520 }}
      >
        L’essentiel de la rénovation énergétique, chaque jeudi à 7 h.
      </div>
      <p
        style={{
          fontSize: 13,
          color: "var(--ink-3)",
          marginTop: 8,
          maxWidth: 540,
          lineHeight: 1.5,
        }}
      >
        14 200 abonnés — actualité MaPrimeRénov’, fiches techniques, baromètre
        RGE, et les enquêtes qui n’ont pas eu leur place dans le journal.
      </p>
      <div style={{ display: "flex", gap: 0, marginTop: 14, maxWidth: 540 }}>
        <input
          className="field mono"
          placeholder="prénom.nom@exemple.fr"
          style={{ borderRight: 0 }}
        />
        <button className="btn btn--signal">S’abonner →</button>
      </div>
      <div
        className="mono"
        style={{
          fontSize: 9,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-mute)",
          marginTop: 10,
        }}
      >
        Sans spam · Désinscription en 1 clic · Hébergé en France
      </div>
    </div>
  );
}
