"use client";
import { useState } from "react";
import Link from "next/link";
import { SAMPLE_ARTICLES } from "@/lib/data";
import { Header } from "@/components/header";
import { Footer, NewsletterBlock } from "@/components/footer";
import {
  ArticleCard,
  ArticleMeta,
  Breadcrumbs,
} from "@/components/article-card";
import { Tag, Icon, Placeholder } from "@/components/atoms";
import { use } from "react";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const a = SAMPLE_ARTICLES.find((x) => x.id === id) ?? SAMPLE_ARTICLES[0];
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    "Le décret en bref",
    "Pourquoi ce relèvement ?",
    "Impact sur la filière",
    "Que faire si projet en cours",
    "Calendrier d’application",
    "Ressources & PDF",
  ];

  return (
    <div className="mc-root w-full max-w-[1280px] mx-auto">
      <Header active="pompes" />
      <section className="px-4 md:px-7 pt-4">
        <Breadcrumbs
          trail={[
            "Accueil",
            "Rubriques",
            "Pompes à chaleur",
            "Décret du 14 avril 2026",
          ]}
        />
      </section>

      <section className="px-4 md:px-7 pt-6 pb-7 border-b border-ink">
        <div className="max-w-[880px]">
          <Tag kind="signal">{a.cat} · Décryptage</Tag>
          <h1 className="h-display text-3xl md:text-5xl lg:text-[56px] mt-3.5 max-w-[920px]">
            {a.title}
          </h1>
          <p className="font-serif italic text-lg md:text-xl lg:text-[22px] text-ink-2 mt-3.5 max-w-[720px] leading-snug tracking-tight">
            {a.dek}
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto] md:gap-5 md:items-center">
          <ArticleMeta
            author={a.author}
            role="Journaliste senior · Pôle énergie"
            published="24 avr. 2026 · 06 h 40"
            updated="ce matin · 09 h 12"
            readMin={a.read}
            category={`N° ${a.id}`}
          />
          <div className="flex flex-wrap gap-2">
            <button className="btn btn--ghost btn--sm">
              <Icon.bookmark /> Sauver
            </button>
            <button className="btn btn--ghost btn--sm">
              <Icon.doc /> PDF (4 p.)
            </button>
            <button className="btn btn--ghost btn--sm">Partager</button>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-7 py-6 border-b border-ink">
        <Placeholder
          caption="hero · pompe à chaleur, intervention chez les Lefranc, Indre-et-Loire"
          className="aspect-[21/9]"
        />
        <div className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute mt-2 flex flex-col md:flex-row md:justify-between gap-1">
          <span>Photo · Sophie Berthier pour Maison Calorie</span>
          <span>Fig. 01 — Unité Daikin Altherma 3 / coffret hydraulique</span>
        </div>
      </section>

      <section className="px-4 md:px-7 py-8 grid grid-cols-1 lg:grid-cols-[200px_1fr_280px] gap-8 border-b border-ink">
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <div className="h-section mb-2.5">—— Sommaire</div>
          <ol className="list-none p-0 m-0">
            {sections.map((t, i) => (
              <li
                key={t}
                onClick={() => setActiveSection(i)}
                className={
                  "cursor-pointer py-1.5 pl-3 border-l-2 text-xs " +
                  (i === activeSection
                    ? "border-signal text-ink font-semibold"
                    : "border-paper-line text-ink-3 font-normal")
                }
              >
                <span className="mono text-[10px] text-ink-mute mr-1.5">
                  0{i + 1}
                </span>
                {t}
              </li>
            ))}
          </ol>
          <div className="mt-6 p-3 border border-paper-line bg-paper-2">
            <div className="lbl">Progression</div>
            <div className="h-[3px] bg-paper-3 mt-2 relative">
              <div className="w-[38%] h-full bg-signal" />
            </div>
            <div className="mono text-[10px] text-ink-mute mt-1.5">
              3 min restantes
            </div>
          </div>
        </aside>

        <article>
          <div className="tick-frame p-4 mb-5 bg-paper-2">
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <div className="lbl mb-2">L’ESSENTIEL · 30 SECONDES</div>
            <ul className="m-0 pl-[18px] text-[13px] leading-[1.6] text-ink-2">
              <li>
                COP minimum imposé : <strong className="text-ink">3,5</strong>{" "}
                (vs 3,2 auparavant).
              </li>
              <li>
                Plafond MaPrimeRénov’ ramené à{" "}
                <strong className="text-ink">8 200 €</strong> (–10 %).
              </li>
              <li>Étude acoustique obligatoire si LDEN &gt; 65 dB(A).</li>
              <li>
                Date d’effet :{" "}
                <strong className="text-ink">
                  1<sup>er</sup> octobre 2026
                </strong>
                .
              </li>
            </ul>
          </div>

          <div className="prose" data-density="comfortable">
            <p>
              Le décret n° 2026-412 du 14 avril rebat les cartes pour la filière
              des pompes à chaleur air-eau.{" "}
              <a href="#">Le seuil de COP minimum</a> passe de 3,2 à 3,5, le
              plafond MaPrimeRénov’ baisse de 10 200 à 8 200 €, et la pose en
              zone très bruyante (LDEN &gt; 65) est désormais soumise à étude
              d’impact acoustique.
            </p>
            <p>
              Concrètement, sur les{" "}
              <a href="#">312 modèles certifiés Eurovent</a> en mars 2026, près
              d’un tiers ne franchira plus la barre du nouveau seuil. Les
              fabricants ont jusqu’au 1<sup>er</sup> octobre pour mettre à jour
              leur gamme — passé cette date, la prime ne s’appliquera plus.
            </p>
            <h2>Pourquoi ce relèvement maintenant ?</h2>
            <p>
              Le ministère de la Transition écologique justifie la mesure par{" "}
              <a href="#">
                l’écart entre performance annoncée et performance terrain
              </a>
              , documenté par l’ADEME en novembre 2025. Sur 1 482 PAC
              instrumentées, le COP réel moyen ressort à 2,9 — soit 0,3 point
              sous l’étiquette constructeur.
            </p>
            <blockquote>
              « Si on veut que la prime serve à autre chose qu’à subventionner
              des produits médiocres, il fallait monter la barre. »
            </blockquote>
            <p>
              — déclarait Élise Tournier, sous-directrice DGEC, lors de
              l’audition du 11 mars. Une partie des poseurs RGE conteste
              cependant la précipitation du calendrier.
            </p>
            <h3>Ce que cela change pour un projet en cours</h3>
            <p>
              Si votre devis a été signé avant le <strong>14 avril 2026</strong>
              , vous restez éligible à l’ancien régime jusqu’au 30 septembre.
              Au-delà, c’est le nouveau plafond qui s’applique — voir notre{" "}
              <a href="#">simulateur MaPrimeRénov’ 2026</a>.
            </p>

            <figure className="my-5">
              <Placeholder
                caption="schéma · circuit hydraulique pac air-eau, basse température"
                className="aspect-[16/9]"
              />
              <figcaption className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute mt-1.5">
                Fig. 02 — Schéma hydraulique typique. Source : ADEME,
                retraitement MC.
              </figcaption>
            </figure>

            <p>
              Pour un acheteur particulier, deux scénarios se dessinent : ou
              bien revoir le devis avant signature, ou bien négocier une remise
              correspondant à l’écart de prime — entre 1 200 et 2 000 € selon
              les régions.
            </p>

            <div className="tick-frame p-3.5 mt-[18px]">
              <span className="tick-bl"></span>
              <span className="tick-br"></span>
              <div className="lbl">Documents joints</div>
              <div className="mt-2.5 grid gap-2">
                {[
                  ["Décret n° 2026-412 (texte intégral)", "PDF · 184 Ko"],
                  ["Comparatif COP 18 modèles 2026", "XLSX · 92 Ko"],
                ].map(([n, s]) => (
                  <a
                    key={n}
                    href="#"
                    className="grid grid-cols-[20px_1fr_auto] md:grid-cols-[20px_1fr_auto_auto] gap-2.5 items-center px-2.5 py-2 border border-paper-line no-underline text-ink bg-paper"
                  >
                    <Icon.doc />
                    <span className="text-[13px] font-medium">{n}</span>
                    <span className="mono text-[10px] text-ink-mute">{s}</span>
                    <span className="mono text-[10px] text-signal hidden md:inline">
                      ↓ TÉLÉCHARGER
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <h2>Calendrier d’application</h2>
            <p>
              Le texte prévoit une montée en charge progressive. Les chantiers
              ouverts avant le 1<sup>er</sup> octobre conservent l’ancien
              régime, à condition d’être achevés avant le 31 décembre 2026.
            </p>
          </div>

          <div className="tick-frame mt-7 p-[18px] grid grid-cols-[64px_1fr] gap-4">
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <Placeholder caption="LM" className="w-16 h-16" />
            <div>
              <div className="text-base font-bold">Léa Marchand</div>
              <div className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute mt-0.5">
                JOURNALISTE SENIOR · 84 ARTICLES
              </div>
              <p className="text-xs text-ink-3 mt-2 leading-[1.5]">
                Couvre la filière chauffage et la réglementation thermique
                depuis 2018. Ancienne ingénieure thermicienne, lauréate du prix
                Albert-Londres environnement 2024.
              </p>
              <Link href="#" className="lnk text-xs">
                Tous ses articles →
              </Link>
            </div>
          </div>
        </article>

        <aside>
          <div className="tick-frame p-3.5">
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <div className="h-section">—— Articles liés</div>
            <div className="mt-2.5">
              {SAMPLE_ARTICLES.slice(2, 6).map((it) => (
                <ArticleCard key={it.id} item={it} kind="mini" />
              ))}
            </div>
          </div>
          <div className="tick-frame p-3.5 mt-4">
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <div className="h-section">—— Même rubrique</div>
            <div className="mt-2.5">
              {SAMPLE_ARTICLES.filter((x) => x.cat === "Pompes à chaleur")
                .slice(0, 4)
                .map((it) => (
                  <ArticleCard key={it.id} item={it} kind="mini" />
                ))}
            </div>
          </div>
          <div className="mt-4 p-3.5 bg-ink text-paper border border-ink">
            <div className="mono text-[9px] tracking-[0.16em] uppercase text-signal">
              ◉ DEVENIR PRO
            </div>
            <div className="text-base font-bold mt-1.5 leading-tight">
              Auditer ce type d’installation chez les particuliers ?
            </div>
            <p className="text-xs text-paper-3 mt-1.5 leading-[1.5]">
              Passez le QCM RGE pour accéder aux outils de diagnostic Maison
              Calorie.
            </p>
            <Link href="/qcm" className="btn btn--signal btn--sm mt-2.5">
              Voir le QCM →
            </Link>
          </div>
        </aside>
      </section>

      <section className="px-4 md:px-7 py-8 border-b border-ink">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-8">
          <div className="h-section">—— En résumé</div>
          <div>
            <ol className="list-none p-0 m-0 grid gap-3">
              {[
                "Le décret du 14 avril 2026 relève le COP minimum des PAC subventionnées à 3,5.",
                "Le plafond MaPrimeRénov’ est ramené à 8 200 € (–10 %).",
                "Une étude acoustique devient obligatoire au-delà de 65 dB(A) LDEN.",
                "Les fabricants ont jusqu’au 1ᵉʳ octobre pour mettre à jour leur gamme.",
                "Pour les chantiers en cours, négocier une remise de 1 200 à 2 000 €.",
              ].map((t, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[32px_1fr] gap-3 pb-3 border-b border-paper-line"
                >
                  <span className="mono text-[22px] font-semibold text-signal leading-none">
                    0{i + 1}
                  </span>
                  <span className="text-sm leading-[1.45]">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-7 py-8 border-b border-ink">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-8">
          <div>
            <div className="h-section">—— Commentaires</div>
            <div className="mono text-2xl md:text-[32px] font-semibold mt-1.5 text-ink">
              27
            </div>
            <div className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute">
              réponses · 14 abonnés
            </div>
          </div>
          <div>
            <div className="border border-ink p-3.5 bg-paper-2">
              <textarea
                className="field mono font-mono text-xs resize-y"
                rows={3}
                placeholder="Votre commentaire — soyez factuel, citez vos sources."
              />
              <div className="mt-2.5 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <span className="mono text-[10px] text-ink-mute tracking-[0.06em] uppercase">
                  Markdown supporté · 1 200 caractères max
                </span>
                <button className="btn btn--primary btn--sm">Publier →</button>
              </div>
            </div>
            {[
              {
                who: "Mathieu R.",
                role: "Artisan RGE · Rennes",
                when: "il y a 2 h",
                up: 18,
                text: "Sur le terrain, le COP 3,5 est tenable sur radiateurs basse température neufs. Sur de l’ancien réseau acier, c’est une autre histoire — on va se retrouver à devoir changer les émetteurs aussi.",
                isAuthor: false,
              },
              {
                who: "Julie P.",
                role: "Lectrice abonnée",
                when: "il y a 5 h",
                up: 11,
                text: "Excellent récap. Une question : les PAC géothermiques sont-elles concernées par les mêmes seuils ? L’article ne le précise pas.",
                isAuthor: false,
              },
              {
                who: "Léa Marchand",
                role: "Auteure de l’article",
                when: "il y a 4 h",
                up: 22,
                isAuthor: true,
                text: "Bonjour Julie — non, le décret distingue PAC aérothermiques et géothermiques. Un article dédié à la géothermie sortira la semaine prochaine.",
              },
            ].map((c, i) => (
              <div
                key={i}
                className={
                  "py-4 border-b border-paper-line " +
                  (c.isAuthor ? "ml-3 md:ml-6" : "")
                }
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
                  <div className="mono text-[11px] tracking-[0.04em] uppercase">
                    <span className="text-ink font-semibold">{c.who}</span>
                    {c.isAuthor && (
                      <span className="ml-2">
                        <Tag kind="signal">AUTEUR</Tag>
                      </span>
                    )}
                    <span className="text-ink-mute ml-2">{c.role}</span>
                  </div>
                  <span className="mono text-[10px] text-ink-mute">
                    {c.when}
                  </span>
                </div>
                <p className="text-sm text-ink-2 mt-1.5 leading-[1.5]">
                  {c.text}
                </p>
                <div className="mono text-[10px] tracking-[0.04em] uppercase text-ink-mute mt-1.5 flex gap-3.5">
                  <a href="#" className="text-ink no-underline">
                    ↑ Utile · {c.up}
                  </a>
                  <a href="#" className="text-ink-mute no-underline">
                    Répondre
                  </a>
                  <a href="#" className="text-ink-mute no-underline">
                    Signaler
                  </a>
                </div>
              </div>
            ))}
            <button className="btn btn--ghost btn--sm mt-3">
              Voir 24 réponses de plus ↓
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-7 py-9">
        <NewsletterBlock />
      </section>
      <Footer />
    </div>
  );
}
