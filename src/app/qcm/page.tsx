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
    <div className="mc-root w-full max-w-[1280px] mx-auto">
      <Header />
      <section className="px-4 pt-5 md:px-7">
        <Breadcrumbs trail={["Accueil", "QCM RGE"]} />
      </section>

      <section className="px-4 py-8 md:px-7 md:py-10 border-b border-ink grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-10">
        <div>
          <Tag kind="signal">CERTIFICATION PRO</Tag>
          <h1 className="h-display text-4xl md:text-6xl lg:text-[80px] mt-3.5">
            30 questions.
            <br />
            <span className="font-serif italic font-normal">
              Une certification
            </span>
            <br />
            qui ouvre les portes du diagnostic.
          </h1>
          <p className="text-[17px] text-ink-3 mt-4 max-w-[620px] leading-[1.5]">
            Le QCM Maison Calorie certifie votre maîtrise des fondamentaux de la
            rénovation énergétique. Réussir le test, c’est obtenir l’accès aux{" "}
            <strong className="text-ink">
              outils de diagnostic en ligne
            </strong>{" "}
            et le droit d’apposer le label MC sur vos devis.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button className="btn btn--signal">
              Acheter un pass · 49 € <Icon.arrowR />
            </button>
            <Link href="/qcm/code" className="btn btn--ghost">
              J’ai déjà un code →
            </Link>
          </div>
          <div className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute mt-3.5">
            Paiement sécurisé · PayPal · Code envoyé par e-mail · Pas
            d’abonnement
          </div>
        </div>
        <div className="tick-frame gridpaper p-6 relative">
          <span className="tick-bl"></span>
          <span className="tick-br"></span>
          <div className="mono text-[10px] tracking-[0.16em] uppercase text-ink-mute">
            EXTRAIT — Q. 12 / 30
          </div>
          <div className="font-serif italic text-[22px] leading-[1.3] mt-3 text-ink">
            « Pour une PAC air-eau installée en 2026 sur réseau radiateurs basse
            température, quel est le COP minimum imposé par le décret du 14
            avril ? »
          </div>
          <div className="mt-4 grid gap-1.5">
            {["A · 2,8", "B · 3,2", "C · 3,5", "D · 3,8"].map((o, i) => (
              <div
                key={i}
                className={
                  "mono text-[12px] px-3 py-2.5 border tracking-[0.04em] text-ink flex justify-between " +
                  (i === 2
                    ? "border-signal bg-signal/[0.08]"
                    : "border-paper-line bg-paper")
                }
              >
                <span>{o}</span>
                {i === 2 && <span className="text-signal">◉ Réponse</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-7 md:py-10 border-b border-ink">
        <div className="h-section mb-5">—— Comment ça marche</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b border-ink">
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
              className={
                "p-5 relative " +
                (i < 3 ? "lg:border-r border-paper-line" : "")
              }
            >
              <div className="mono text-[36px] font-semibold text-signal tracking-[-0.02em]">
                {n}
              </div>
              <div className="text-[17px] font-bold mt-2 tracking-[-0.01em]">
                {t}
              </div>
              <p className="text-[13px] text-ink-3 mt-1.5 leading-[1.5]">{d}</p>
              {i < 3 && (
                <Icon.arrowR className="hidden lg:block w-[18px] h-[18px] absolute -right-[9px] top-[30px] bg-paper p-0.5 text-ink-mute" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-8 md:px-7 md:py-10 border-b border-ink">
        <div className="h-section mb-1.5">—— Tarifs</div>
        <h2 className="h-title text-3xl md:text-4xl m-0">
          Achetez à l’unité, autant de fois que nécessaire.
        </h2>
        <p className="text-[14px] text-ink-3 mt-2 max-w-[720px]">
          Pas d’abonnement, pas de renouvellement caché. Un pass = un test. Vous
          pouvez en acheter plusieurs et les utiliser quand vous voulez.
        </p>

        <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
          {passes.map((p, i) => (
            <div
              key={p.name}
              className={
                "tick-frame p-6 relative " +
                (p.best ? "bg-ink text-paper" : "bg-paper text-ink")
              }
            >
              <span className="tick-bl"></span>
              <span className="tick-br"></span>
              {p.best && (
                <div className="mono absolute -top-px -right-px bg-signal text-white text-[10px] tracking-[0.16em] uppercase px-2.5 py-1">
                  ★ LE PLUS CHOISI
                </div>
              )}
              <div
                className={
                  "mono text-[10px] tracking-[0.16em] uppercase " +
                  (p.best ? "text-signal" : "text-ink-mute")
                }
              >
                OPTION 0{i + 1}
              </div>
              <div className="text-[22px] font-bold tracking-[-0.02em] mt-1.5">
                {p.name}
              </div>
              <div className="flex items-baseline gap-1 mt-2.5">
                <div
                  className={
                    "h-display text-[64px] " +
                    (p.best ? "text-signal" : "text-ink")
                  }
                >
                  {p.price}
                  <span className="text-[24px]"> €</span>
                </div>
                <div
                  className={
                    "mono text-[11px] " +
                    (p.best ? "text-paper-3" : "text-ink-mute")
                  }
                >
                  TTC
                </div>
              </div>
              <p
                className={
                  "text-[13px] mt-2 leading-[1.45] " +
                  (p.best ? "text-paper-3" : "text-ink-3")
                }
              >
                {p.desc}
              </p>
              <ul
                className={
                  "list-none p-0 mt-5 border-t " +
                  (p.best ? "border-paper-3" : "border-paper-line")
                }
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
                    className={
                      "flex justify-between py-2 text-[12px] border-b " +
                      (p.best ? "border-paper-3" : "border-paper-line")
                    }
                  >
                    <span
                      className={
                        "mono text-[10px] tracking-[0.06em] uppercase " +
                        (p.best ? "text-paper-3" : "text-ink-mute")
                      }
                    >
                      {k}
                    </span>
                    <span className="font-medium">{v}</span>
                  </li>
                ))}
              </ul>
              <button
                className={
                  "btn mt-5 w-full justify-center " +
                  (p.best ? "btn--signal" : "btn--primary")
                }
              >
                Payer avec PayPal <Icon.arrowR />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-8 md:px-7 md:py-10 border-b border-ink grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        <div>
          <div className="h-section mb-2">—— Sans la certification</div>
          <ul className="list-none p-0 m-0">
            {[
              "Pas d’accès aux outils de diagnostic en ligne",
              "Pas de réalisation de DPE pour le compte de clients",
              "Pas d’achat des kits de mesure (caméra thermique, anémo., etc.)",
              "Pas d’apposition du label MC sur les devis",
            ].map((t) => (
              <li
                key={t}
                className="grid grid-cols-[20px_1fr] gap-2.5 py-2.5 border-b border-paper-line text-[13px] text-ink-3"
              >
                <Icon.cross className="text-signal w-[18px] h-[18px]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="h-section mb-2 text-leaf">
            —— Avec la certification
          </div>
          <ul className="list-none p-0 m-0">
            {[
              "Accès complet aux outils MC (DPE, calculs thermiques, audit)",
              "Achat des kits matériel à tarif pro (–22 % en moyenne)",
              "Label MC sur vos devis et site web",
              "Inscription à l’annuaire public des certifiés",
              "Mises à jour réglementaires en avant-première",
            ].map((t) => (
              <li
                key={t}
                className="grid grid-cols-[20px_1fr] gap-2.5 py-2.5 border-b border-paper-line text-[13px]"
              >
                <Icon.check className="text-leaf w-[18px] h-[18px]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-8 md:px-7 md:py-10 border-b border-ink grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 lg:gap-10">
        <div>
          <div className="h-section">—— Questions fréquentes</div>
          <div className="h-title text-2xl md:text-[32px] mt-1.5">
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
              className="border-b border-paper-line py-3.5"
              open={i === 0}
            >
              <summary className="cursor-pointer text-[15px] font-semibold tracking-[-0.01em] flex justify-between">
                {q}
                <span className="mono text-signal">+</span>
              </summary>
              <p className="text-[13px] text-ink-3 mt-2 leading-[1.5]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
