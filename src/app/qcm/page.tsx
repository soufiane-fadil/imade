import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/article-card";
import { Tag, Icon } from "@/components/atoms";

export default function QCMLandingPage() {
  const passes = [
    {
      name: "Pass Découverte",
      price: 29,
      dur: "6 mois",
      tries: "1 tentative",
      cert: "Initiation",
      best: false,
      desc: "Pour découvrir le format. Une seule certification au choix.",
    },
    {
      name: "Pass Pro · QCM RGE",
      price: 49,
      dur: "12 mois",
      tries: "1 tentative",
      cert: "RGE Niv. 1",
      best: true,
      desc: "Le plus choisi. Donne accès aux outils de diagnostic Maison Calorie après réussite.",
    },
    {
      name: "Pack 3 Tentatives",
      price: 119,
      dur: "12 mois",
      tries: "3 tentatives",
      cert: "au choix",
      best: false,
      desc: "Pour repasser ou viser plusieurs certifications (PAC, Isolation, Solaire).",
    },
  ];
  return (
    <div className="mc-root" style={{ width: 1280 }}>
      <Header />
      <section style={{ padding: "20px 28px 0" }}>
        <Breadcrumbs trail={["Accueil", "QCM RGE"]} />
      </section>

      <section
        style={{
          padding: "40px 28px",
          borderBottom: "1px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 40,
        }}
      >
        <div>
          <Tag kind="signal">CERTIFICATION PRO</Tag>
          <h1
            className="h-display"
            style={{ fontSize: 80, margin: "14px 0 0" }}
          >
            30 questions.
            <br />
            <span
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              Une certification
            </span>
            <br />
            qui ouvre les portes du diagnostic.
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "var(--ink-3)",
              marginTop: 18,
              maxWidth: 620,
              lineHeight: 1.5,
            }}
          >
            Le QCM Maison Calorie certifie votre maîtrise des fondamentaux de la
            rénovation énergétique. Réussir le test, c’est obtenir l’accès aux{" "}
            <strong style={{ color: "var(--ink)" }}>
              outils de diagnostic en ligne
            </strong>{" "}
            et le droit d’apposer le label MC sur vos devis.
          </p>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <button className="btn btn--signal">
              Acheter un pass · 49 € <Icon.arrowR />
            </button>
            <Link href="/qcm/code" className="btn btn--ghost">
              J’ai déjà un code →
            </Link>
          </div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-mute)",
              marginTop: 14,
            }}
          >
            Paiement sécurisé · PayPal · Code envoyé par e-mail · Pas
            d’abonnement
          </div>
        </div>
        <div
          className="tick-frame gridpaper"
          style={{ padding: 24, position: "relative" }}
        >
          <span className="tick-bl"></span>
          <span className="tick-br"></span>
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ink-mute)",
            }}
          >
            EXTRAIT — Q. 12 / 30
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 22,
              lineHeight: 1.3,
              marginTop: 12,
              color: "var(--ink)",
            }}
          >
            « Pour une PAC air-eau installée en 2026 sur réseau radiateurs basse
            température, quel est le COP minimum imposé par le décret du 14
            avril ? »
          </div>
          <div style={{ marginTop: 16, display: "grid", gap: 6 }}>
            {["A · 2,8", "B · 3,2", "C · 3,5", "D · 3,8"].map((o, i) => (
              <div
                key={i}
                className="mono"
                style={{
                  fontSize: 12,
                  padding: "10px 12px",
                  border:
                    "1px solid " +
                    (i === 2 ? "var(--signal)" : "var(--paper-line)"),
                  background: i === 2 ? "rgba(229,72,27,0.08)" : "var(--paper)",
                  letterSpacing: "0.04em",
                  color: "var(--ink)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{o}</span>
                {i === 2 && (
                  <span style={{ color: "var(--signal)" }}>◉ Réponse</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{ padding: "40px 28px", borderBottom: "1px solid var(--ink)" }}
      >
        <div className="h-section" style={{ marginBottom: 20 }}>
          —— Comment ça marche
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
            borderTop: "1px solid var(--ink)",
            borderBottom: "1px solid var(--ink)",
          }}
        >
          {[
            [
              "01",
              "Choisir un pass",
              "Vous sélectionnez la certification visée et payez par PayPal.",
            ],
            [
              "02",
              "Recevoir le code",
              "Lien + code unique envoyés par e-mail. Valable 6 à 12 mois.",
            ],
            [
              "03",
              "Passer le QCM",
              "30 questions, 4 options. Vous pouvez revenir en arrière. Pas de chrono limite.",
            ],
            [
              "04",
              "Obtenir la certif.",
              "70 % de bonnes réponses suffisent. Attestation PDF immédiate.",
            ],
          ].map(([n, t, d], i) => (
            <div
              key={n}
              style={{
                padding: 20,
                borderRight: i < 3 ? "1px solid var(--paper-line)" : 0,
                position: "relative",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 36,
                  fontWeight: 600,
                  color: "var(--signal)",
                  letterSpacing: "-0.02em",
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  marginTop: 8,
                  letterSpacing: "-0.01em",
                }}
              >
                {t}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--ink-3)",
                  marginTop: 6,
                  lineHeight: 1.5,
                }}
              >
                {d}
              </p>
              {i < 3 && (
                <Icon.arrowR
                  style={{
                    width: 18,
                    height: 18,
                    position: "absolute",
                    right: -9,
                    top: 30,
                    background: "var(--paper)",
                    padding: 2,
                    color: "var(--ink-mute)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <section
        style={{ padding: "40px 28px", borderBottom: "1px solid var(--ink)" }}
      >
        <div className="h-section" style={{ marginBottom: 6 }}>
          —— Tarifs
        </div>
        <h2 className="h-title" style={{ fontSize: 40, margin: 0 }}>
          Achetez à l’unité, autant de fois que nécessaire.
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--ink-3)",
            marginTop: 8,
            maxWidth: 720,
          }}
        >
          Pas d’abonnement, pas de renouvellement caché. Un pass = un test. Vous
          pouvez en acheter plusieurs et les utiliser quand vous voulez.
        </p>

        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {passes.map((p, i) => (
            <div
              key={p.name}
              className="tick-frame"
              style={{
                padding: 24,
                background: p.best ? "var(--ink)" : "var(--paper)",
                color: p.best ? "var(--paper)" : "var(--ink)",
                position: "relative",
              }}
            >
              <span className="tick-bl"></span>
              <span className="tick-br"></span>
              {p.best && (
                <div
                  className="mono"
                  style={{
                    position: "absolute",
                    top: -1,
                    right: -1,
                    background: "var(--signal)",
                    color: "#fff",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                  }}
                >
                  ★ LE PLUS CHOISI
                </div>
              )}
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: p.best ? "var(--signal)" : "var(--ink-mute)",
                }}
              >
                OPTION 0{i + 1}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginTop: 6,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  marginTop: 10,
                }}
              >
                <div
                  className="h-display"
                  style={{
                    fontSize: 64,
                    color: p.best ? "var(--signal)" : "var(--ink)",
                  }}
                >
                  {p.price}
                  <span style={{ fontSize: 24 }}> €</span>
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: p.best ? "var(--paper-3)" : "var(--ink-mute)",
                  }}
                >
                  TTC
                </div>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: p.best ? "var(--paper-3)" : "var(--ink-3)",
                  marginTop: 8,
                  lineHeight: 1.45,
                }}
              >
                {p.desc}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "20px 0 0",
                  borderTop:
                    "1px solid " +
                    (p.best ? "var(--paper-3)" : "var(--paper-line)"),
                }}
              >
                {[
                  ["Validité", p.dur],
                  ["Tentatives", p.tries],
                  ["Certification", p.cert],
                  ["Attestation PDF", "Oui · QR code"],
                  [
                    "Outils diag MC",
                    i === 0 ? "Lecture seule" : "Accès complet",
                  ],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom:
                        "1px solid " +
                        (p.best ? "var(--paper-3)" : "var(--paper-line)"),
                      fontSize: 12,
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: p.best ? "var(--paper-3)" : "var(--ink-mute)",
                      }}
                    >
                      {k}
                    </span>
                    <span style={{ fontWeight: 500 }}>{v}</span>
                  </li>
                ))}
              </ul>
              <button
                className={"btn " + (p.best ? "btn--signal" : "btn--primary")}
                style={{
                  marginTop: 20,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                Payer avec PayPal <Icon.arrowR />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          padding: "40px 28px",
          borderBottom: "1px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
        }}
      >
        <div>
          <div className="h-section" style={{ marginBottom: 8 }}>
            —— Sans la certification
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Pas d’accès aux outils de diagnostic en ligne",
              "Pas de réalisation de DPE pour le compte de clients",
              "Pas d’achat des kits de mesure (caméra thermique, anémo., etc.)",
              "Pas d’apposition du label MC sur les devis",
            ].map((t) => (
              <li
                key={t}
                style={{
                  display: "grid",
                  gridTemplateColumns: "20px 1fr",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--paper-line)",
                  fontSize: 13,
                  color: "var(--ink-3)",
                }}
              >
                <Icon.cross
                  style={{ color: "var(--signal)", width: 18, height: 18 }}
                />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div
            className="h-section"
            style={{ marginBottom: 8, color: "var(--leaf)" }}
          >
            —— Avec la certification
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Accès complet aux outils MC (DPE, calculs thermiques, audit)",
              "Achat des kits matériel à tarif pro (–22 % en moyenne)",
              "Label MC sur vos devis et site web",
              "Inscription à l’annuaire public des certifiés",
              "Mises à jour réglementaires en avant-première",
            ].map((t) => (
              <li
                key={t}
                style={{
                  display: "grid",
                  gridTemplateColumns: "20px 1fr",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--paper-line)",
                  fontSize: 13,
                }}
              >
                <Icon.check
                  style={{ color: "var(--leaf)", width: 18, height: 18 }}
                />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        style={{
          padding: "40px 28px",
          borderBottom: "1px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 40,
        }}
      >
        <div>
          <div className="h-section">—— Questions fréquentes</div>
          <div className="h-title" style={{ fontSize: 32, marginTop: 6 }}>
            Tout ce qu’on nous demande avant d’acheter.
          </div>
        </div>
        <div>
          {[
            [
              "Combien de temps pour passer le QCM ?",
              "En moyenne 14 minutes. Pas de chrono limite — vous pouvez prendre votre temps.",
            ],
            [
              "Que se passe-t-il en cas d’échec ?",
              "Vous gardez l’accès aux corrections. Pour repasser, il faut acheter un nouveau pass (ou choisir le Pack 3 Tentatives).",
            ],
            [
              "Le code est-il transférable ?",
              "Non — le code est nominatif et lié à votre compte Maison Calorie.",
            ],
            [
              "Combien de temps pour recevoir le code ?",
              "Immédiatement après le paiement PayPal. Si rien n’arrive sous 5 minutes, contactez qcm@maison-calorie.fr.",
            ],
            [
              "La certification est-elle reconnue par l’État ?",
              "C’est une certification privée Maison Calorie, complémentaire du label RGE. Elle ne remplace pas la qualification officielle.",
            ],
          ].map(([q, a], i) => (
            <details
              key={i}
              style={{
                borderBottom: "1px solid var(--paper-line)",
                padding: "14px 0",
              }}
              open={i === 0}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {q}
                <span className="mono" style={{ color: "var(--signal)" }}>
                  +
                </span>
              </summary>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--ink-3)",
                  marginTop: 8,
                  lineHeight: 1.5,
                }}
              >
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
