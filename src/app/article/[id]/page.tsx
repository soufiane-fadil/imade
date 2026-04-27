"use client";
import { useState } from "react";
import Link from "next/link";
import { SAMPLE_ARTICLES } from "@/lib/data";
import { Header } from "@/components/header";
import { Footer, NewsletterBlock } from "@/components/footer";
import { ArticleCard, ArticleMeta, Breadcrumbs } from "@/components/article-card";
import { Tag, Icon, Placeholder } from "@/components/atoms";
import { use } from "react";

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const a = SAMPLE_ARTICLES.find((x) => x.id === id) ?? SAMPLE_ARTICLES[0];
  const [activeSection, setActiveSection] = useState(0);

  const sections = ["Le décret en bref", "Pourquoi ce relèvement ?", "Impact sur la filière", "Que faire si projet en cours", "Calendrier d’application", "Ressources & PDF"];

  return (
    <div className="mc-root" style={{ width: 1280 }}>
      <Header active="pompes" />
      <section style={{ padding: "16px 28px 0" }}>
        <Breadcrumbs trail={["Accueil", "Rubriques", "Pompes à chaleur", "Décret du 14 avril 2026"]} />
      </section>

      <section style={{ padding: "24px 28px 28px", borderBottom: "1px solid var(--ink)" }}>
        <div style={{ maxWidth: 880 }}>
          <Tag kind="signal">{a.cat} · Décryptage</Tag>
          <h1 className="h-display" style={{ fontSize: 56, margin: "14px 0 0", maxWidth: 920 }}>{a.title}</h1>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, color: "var(--ink-2)", marginTop: 14, maxWidth: 720, lineHeight: 1.35, letterSpacing: "-0.01em" }}>{a.dek}</p>
        </div>
        <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center" }}>
          <ArticleMeta author={a.author} role="Journaliste senior · Pôle énergie" published="24 avr. 2026 · 06 h 40" updated="ce matin · 09 h 12" readMin={a.read} category={`N° ${a.id}`} />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn--ghost btn--sm"><Icon.bookmark /> Sauver</button>
            <button className="btn btn--ghost btn--sm"><Icon.doc /> PDF (4 p.)</button>
            <button className="btn btn--ghost btn--sm">Partager</button>
          </div>
        </div>
      </section>

      <section style={{ padding: "24px 28px", borderBottom: "1px solid var(--ink)" }}>
        <Placeholder caption="hero · pompe à chaleur, intervention chez les Lefranc, Indre-et-Loire" style={{ aspectRatio: "21/9" }} />
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-mute)", marginTop: 8, display: "flex", justifyContent: "space-between" }}>
          <span>Photo · Sophie Berthier pour Maison Calorie</span>
          <span>Fig. 01 — Unité Daikin Altherma 3 / coffret hydraulique</span>
        </div>
      </section>

      <section style={{ padding: "32px 28px", display: "grid", gridTemplateColumns: "200px 1fr 280px", gap: 32, borderBottom: "1px solid var(--ink)" }}>
        <aside style={{ position: "sticky", top: 100, alignSelf: "start" }}>
          <div className="h-section" style={{ marginBottom: 10 }}>—— Sommaire</div>
          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sections.map((t, i) => (
              <li key={t} onClick={() => setActiveSection(i)} style={{ cursor: "pointer", padding: "6px 0 6px 12px", borderLeft: "2px solid " + (i === activeSection ? "var(--signal)" : "var(--paper-line)"), color: i === activeSection ? "var(--ink)" : "var(--ink-3)", fontSize: 12, fontWeight: i === activeSection ? 600 : 400 }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", marginRight: 6 }}>0{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
          <div style={{ marginTop: 24, padding: 12, border: "1px solid var(--paper-line)", background: "var(--paper-2)" }}>
            <div className="lbl">Progression</div>
            <div style={{ height: 3, background: "var(--paper-3)", marginTop: 8, position: "relative" }}>
              <div style={{ width: "38%", height: "100%", background: "var(--signal)" }} />
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 6 }}>3 min restantes</div>
          </div>
        </aside>

        <article>
          <div className="tick-frame" style={{ padding: 16, marginBottom: 22, background: "var(--paper-2)" }}>
            <span className="tick-bl"></span><span className="tick-br"></span>
            <div className="lbl" style={{ marginBottom: 8 }}>L’ESSENTIEL · 30 SECONDES</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6, color: "var(--ink-2)" }}>
              <li>COP minimum imposé : <strong style={{ color: "var(--ink)" }}>3,5</strong> (vs 3,2 auparavant).</li>
              <li>Plafond MaPrimeRénov’ ramené à <strong style={{ color: "var(--ink)" }}>8 200 €</strong> (–10 %).</li>
              <li>Étude acoustique obligatoire si LDEN &gt; 65 dB(A).</li>
              <li>Date d’effet : <strong style={{ color: "var(--ink)" }}>1<sup>er</sup> octobre 2026</strong>.</li>
            </ul>
          </div>

          <div className="prose" data-density="comfortable">
            <p>Le décret n° 2026-412 du 14 avril rebat les cartes pour la filière des pompes à chaleur air-eau. <a href="#">Le seuil de COP minimum</a> passe de 3,2 à 3,5, le plafond MaPrimeRénov’ baisse de 10 200 à 8 200 €, et la pose en zone très bruyante (LDEN &gt; 65) est désormais soumise à étude d’impact acoustique.</p>
            <p>Concrètement, sur les <a href="#">312 modèles certifiés Eurovent</a> en mars 2026, près d’un tiers ne franchira plus la barre du nouveau seuil. Les fabricants ont jusqu’au 1<sup>er</sup> octobre pour mettre à jour leur gamme — passé cette date, la prime ne s’appliquera plus.</p>
            <h2>Pourquoi ce relèvement maintenant ?</h2>
            <p>Le ministère de la Transition écologique justifie la mesure par <a href="#">l’écart entre performance annoncée et performance terrain</a>, documenté par l’ADEME en novembre 2025. Sur 1 482 PAC instrumentées, le COP réel moyen ressort à 2,9 — soit 0,3 point sous l’étiquette constructeur.</p>
            <blockquote>« Si on veut que la prime serve à autre chose qu’à subventionner des produits médiocres, il fallait monter la barre. »</blockquote>
            <p>— déclarait Élise Tournier, sous-directrice DGEC, lors de l’audition du 11 mars. Une partie des poseurs RGE conteste cependant la précipitation du calendrier.</p>
            <h3>Ce que cela change pour un projet en cours</h3>
            <p>Si votre devis a été signé avant le <strong>14 avril 2026</strong>, vous restez éligible à l’ancien régime jusqu’au 30 septembre. Au-delà, c’est le nouveau plafond qui s’applique — voir notre <a href="#">simulateur MaPrimeRénov’ 2026</a>.</p>

            <figure style={{ margin: "20px 0" }}>
              <Placeholder caption="schéma · circuit hydraulique pac air-eau, basse température" style={{ aspectRatio: "16/9" }} />
              <figcaption className="mono" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-mute)", marginTop: 6 }}>
                Fig. 02 — Schéma hydraulique typique. Source : ADEME, retraitement MC.
              </figcaption>
            </figure>

            <p>Pour un acheteur particulier, deux scénarios se dessinent : ou bien revoir le devis avant signature, ou bien négocier une remise correspondant à l’écart de prime — entre 1 200 et 2 000 € selon les régions.</p>

            <div className="tick-frame" style={{ padding: 14, marginTop: 18 }}>
              <span className="tick-bl"></span><span className="tick-br"></span>
              <div className="lbl">Documents joints</div>
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {[
                  ["Décret n° 2026-412 (texte intégral)", "PDF · 184 Ko"],
                  ["Comparatif COP 18 modèles 2026", "XLSX · 92 Ko"],
                ].map(([n, s]) => (
                  <a key={n} href="#" style={{ display: "grid", gridTemplateColumns: "20px 1fr auto auto", gap: 10, alignItems: "center", padding: "8px 10px", border: "1px solid var(--paper-line)", textDecoration: "none", color: "var(--ink)", background: "var(--paper)" }}>
                    <Icon.doc />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{n}</span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)" }}>{s}</span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--signal)" }}>↓ TÉLÉCHARGER</span>
                  </a>
                ))}
              </div>
            </div>

            <h2>Calendrier d’application</h2>
            <p>Le texte prévoit une montée en charge progressive. Les chantiers ouverts avant le 1<sup>er</sup> octobre conservent l’ancien régime, à condition d’être achevés avant le 31 décembre 2026.</p>
          </div>

          <div className="tick-frame" style={{ marginTop: 28, padding: 18, display: "grid", gridTemplateColumns: "64px 1fr", gap: 16 }}>
            <span className="tick-bl"></span><span className="tick-br"></span>
            <Placeholder caption="LM" style={{ width: 64, height: 64 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Léa Marchand</div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-mute)", marginTop: 2 }}>JOURNALISTE SENIOR · 84 ARTICLES</div>
              <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 8, lineHeight: 1.5 }}>
                Couvre la filière chauffage et la réglementation thermique depuis 2018. Ancienne ingénieure thermicienne, lauréate du prix Albert-Londres environnement 2024.
              </p>
              <Link href="#" className="lnk" style={{ fontSize: 12 }}>Tous ses articles →</Link>
            </div>
          </div>
        </article>

        <aside>
          <div className="tick-frame" style={{ padding: 14 }}>
            <span className="tick-bl"></span><span className="tick-br"></span>
            <div className="h-section">—— Articles liés</div>
            <div style={{ marginTop: 10 }}>
              {SAMPLE_ARTICLES.slice(2, 6).map((it) => <ArticleCard key={it.id} item={it} kind="mini" />)}
            </div>
          </div>
          <div className="tick-frame" style={{ padding: 14, marginTop: 16 }}>
            <span className="tick-bl"></span><span className="tick-br"></span>
            <div className="h-section">—— Même rubrique</div>
            <div style={{ marginTop: 10 }}>
              {SAMPLE_ARTICLES.filter((x) => x.cat === "Pompes à chaleur").slice(0, 4).map((it) => <ArticleCard key={it.id} item={it} kind="mini" />)}
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 14, background: "var(--ink)", color: "var(--paper)", border: "1px solid var(--ink)" }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--signal)" }}>◉ DEVENIR PRO</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6, lineHeight: 1.2 }}>Auditer ce type d’installation chez les particuliers ?</div>
            <p style={{ fontSize: 12, color: "var(--paper-3)", marginTop: 6, lineHeight: 1.5 }}>Passez le QCM RGE pour accéder aux outils de diagnostic Maison Calorie.</p>
            <Link href="/qcm" className="btn btn--signal btn--sm" style={{ marginTop: 10 }}>Voir le QCM →</Link>
          </div>
        </aside>
      </section>

      <section style={{ padding: "32px 28px", borderBottom: "1px solid var(--ink)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 32 }}>
          <div className="h-section">—— En résumé</div>
          <div>
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
              {[
                "Le décret du 14 avril 2026 relève le COP minimum des PAC subventionnées à 3,5.",
                "Le plafond MaPrimeRénov’ est ramené à 8 200 € (–10 %).",
                "Une étude acoustique devient obligatoire au-delà de 65 dB(A) LDEN.",
                "Les fabricants ont jusqu’au 1ᵉʳ octobre pour mettre à jour leur gamme.",
                "Pour les chantiers en cours, négocier une remise de 1 200 à 2 000 €.",
              ].map((t, i) => (
                <li key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 12, paddingBottom: 12, borderBottom: "1px solid var(--paper-line)" }}>
                  <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: "var(--signal)", lineHeight: 1 }}>0{i + 1}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.45 }}>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 28px", borderBottom: "1px solid var(--ink)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 32 }}>
          <div>
            <div className="h-section">—— Commentaires</div>
            <div className="mono" style={{ fontSize: 32, fontWeight: 600, marginTop: 6, color: "var(--ink)" }}>27</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-mute)" }}>réponses · 14 abonnés</div>
          </div>
          <div>
            <div style={{ border: "1px solid var(--ink)", padding: 14, background: "var(--paper-2)" }}>
              <textarea className="field mono" rows={3} placeholder="Votre commentaire — soyez factuel, citez vos sources." style={{ fontFamily: "var(--mono)", fontSize: 12, resize: "vertical" }} />
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Markdown supporté · 1 200 caractères max</span>
                <button className="btn btn--primary btn--sm">Publier →</button>
              </div>
            </div>
            {[
              { who: "Mathieu R.", role: "Artisan RGE · Rennes", when: "il y a 2 h", up: 18, text: "Sur le terrain, le COP 3,5 est tenable sur radiateurs basse température neufs. Sur de l’ancien réseau acier, c’est une autre histoire — on va se retrouver à devoir changer les émetteurs aussi.", isAuthor: false },
              { who: "Julie P.", role: "Lectrice abonnée", when: "il y a 5 h", up: 11, text: "Excellent récap. Une question : les PAC géothermiques sont-elles concernées par les mêmes seuils ? L’article ne le précise pas.", isAuthor: false },
              { who: "Léa Marchand", role: "Auteure de l’article", when: "il y a 4 h", up: 22, isAuthor: true, text: "Bonjour Julie — non, le décret distingue PAC aérothermiques et géothermiques. Un article dédié à la géothermie sortira la semaine prochaine." },
            ].map((c, i) => (
              <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--paper-line)", marginLeft: c.isAuthor ? 24 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    <span style={{ color: "var(--ink)", fontWeight: 600 }}>{c.who}</span>
                    {c.isAuthor && <Tag kind="signal" style={{ marginLeft: 8 }}>AUTEUR</Tag>}
                    <span style={{ color: "var(--ink-mute)", marginLeft: 8 }}>{c.role}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)" }}>{c.when}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 6, lineHeight: 1.5 }}>{c.text}</p>
                <div className="mono" style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink-mute)", marginTop: 6, display: "flex", gap: 14 }}>
                  <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>↑ Utile · {c.up}</a>
                  <a href="#" style={{ color: "var(--ink-mute)", textDecoration: "none" }}>Répondre</a>
                  <a href="#" style={{ color: "var(--ink-mute)", textDecoration: "none" }}>Signaler</a>
                </div>
              </div>
            ))}
            <button className="btn btn--ghost btn--sm" style={{ marginTop: 12 }}>Voir 24 réponses de plus ↓</button>
          </div>
        </div>
      </section>

      <section style={{ padding: "36px 28px" }}><NewsletterBlock /></section>
      <Footer />
    </div>
  );
}
