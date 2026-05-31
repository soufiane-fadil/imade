import Link from "next/link";
import { AccountHeader } from "@/components/account-header";
import { Footer } from "@/components/footer";
import { ArticleCard } from "@/components/article-card";
import { Tag, Icon } from "@/components/atoms";
import { SAMPLE_ARTICLES } from "@/lib/data";

export default function ProfilePage() {
  const tests = [
    {
      id: "QCM-2026-04-22-A1",
      date: "22 avr. 2026",
      score: 27,
      total: 30,
      status: "Réussi",
      cert: "RGE Niv. 1",
      dur: "14 min 02 s",
    },
    {
      id: "QCM-2026-03-08-B7",
      date: "8 mars 2026",
      score: 24,
      total: 30,
      status: "Réussi",
      cert: "PAC Niv. 2",
      dur: "17 min 38 s",
    },
    {
      id: "QCM-2026-02-19-C3",
      date: "19 fév. 2026",
      score: 21,
      total: 30,
      status: "Échec",
      cert: "PAC Niv. 2",
      dur: "21 min 05 s",
    },
    {
      id: "QCM-2026-01-30-A4",
      date: "30 janv. 2026",
      score: 28,
      total: 30,
      status: "Réussi",
      cert: "Isolation Niv. 1",
      dur: "12 min 49 s",
    },
  ];
  return (
    <div className="mc-root w-full max-w-[1280px] mx-auto bg-paper-2">
      <AccountHeader active="profile" />

      <section className="px-4 pt-6 md:px-7 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
        <div>
          <div className="mono text-[10px] tracking-[0.16em] uppercase text-signal">
            ◉ TABLEAU DE BORD · 27 AVRIL 2026
          </div>
          <h1 className="h-display text-4xl md:text-5xl lg:text-[56px] mt-1.5 leading-none">
            Votre espace
            <br />
            de membre.
          </h1>
          <p className="font-serif italic text-[16px] text-ink-3 max-w-[540px] mt-2.5 leading-[1.45]">
            Vous êtes connecté en tant qu’<strong>artisan certifié RGE</strong>.
            Votre dernier passage de QCM date du 22 avril — un nouveau pass vous
            attend.
          </p>
        </div>
        <div className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute md:text-right">
          DERNIÈRE CONNEXION
          <br />
          <span className="text-ink text-[14px] tracking-normal normal-case font-mono">
            26 avr. 2026 · 09h12 · Rennes
          </span>
        </div>
      </section>

      <section className="px-4 py-5 md:px-7 mt-6 border-t border-b border-ink grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-paper">
        {[
          ["4", "Tests passés"],
          ["3", "Réussis"],
          ["25,0 / 30", "Score moyen"],
          ["3", "Certifications"],
          ["1", "Pass non utilisé"],
        ].map(([n, l], i) => (
          <div
            key={i}
            className={
              "p-3 border-b border-paper-line lg:border-b-0 " +
              (i < 4 ? "lg:border-r border-paper-line" : "")
            }
          >
            <div className="h-display text-[32px]">{n}</div>
            <div className="lbl mt-1">{l}</div>
          </div>
        ))}
      </section>

      <section className="px-4 py-7 md:px-7 border-b border-ink bg-paper">
        <div className="flex flex-wrap justify-between items-baseline gap-3 mb-4">
          <div>
            <div className="h-section">—— Historique des tests</div>
            <div className="h-title text-2xl md:text-[28px] mt-1">
              Vos QCM passés
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn--ghost btn--sm">Exporter CSV</button>
            <Link href="/qcm/code" className="btn btn--primary btn--sm">
              Saisir un code <Icon.arrowR />
            </Link>
          </div>
        </div>
        <div className="border border-ink overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[720px] md:min-w-0">
            <div
              className="mono px-3.5 py-2.5 bg-ink text-paper text-[10px] tracking-[0.08em] uppercase"
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1.2fr 0.7fr 1fr 0.8fr 100px",
                gap: 12,
              }}
            >
              <span>Code</span>
              <span>Date</span>
              <span>Certification</span>
              <span>Score</span>
              <span>Statut</span>
              <span>Durée</span>
              <span></span>
            </div>
            {tests.map((t) => (
              <div
                key={t.id}
                className="p-3.5 border-b border-paper-line items-center"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr 1.2fr 0.7fr 1fr 0.8fr 100px",
                  gap: 12,
                }}
              >
                <span className="mono text-[11px] tracking-[0.04em]">
                  {t.id}
                </span>
                <span className="mono text-[11px] text-ink-mute">{t.date}</span>
                <span className="text-[13px] font-medium">{t.cert}</span>
                <span className="mono text-[14px] font-semibold">
                  {t.score}
                  <span className="text-ink-mute">/{t.total}</span>
                </span>
                <span>
                  <Tag kind={t.status === "Réussi" ? "leaf" : "signal"}>
                    {t.status}
                  </Tag>
                </span>
                <span className="mono text-[11px] text-ink-mute">{t.dur}</span>
                <Link
                  href="/qcm/resultats"
                  className="mono text-[10px] tracking-[0.08em] uppercase text-ink no-underline border-b border-ink justify-self-end"
                >
                  Détail →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border border-dashed border-signal bg-signal/[0.06] p-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="mono text-[10px] tracking-[0.16em] uppercase text-signal">
              ◉ PASS NON UTILISÉ
            </div>
            <div className="h-title text-[22px] mt-1">
              Code{" "}
              <span className="mono bg-ink text-paper px-2 py-0.5">
                QCM-7H4K-9P2X-A1B6
              </span>{" "}
              — acheté le 25 avril.
            </div>
            <div className="mono text-[11px] text-ink-mute mt-1">
              Valable jusqu’au 25 octobre 2026 · Certification PAC Niv. 2
            </div>
          </div>
          <Link href="/qcm/code" className="btn btn--signal">
            Lancer le QCM <Icon.arrowR />
          </Link>
        </div>
      </section>

      <section className="px-4 py-7 md:px-7 border-b border-ink grid grid-cols-1 md:grid-cols-2 gap-8 bg-paper">
        <div>
          <div className="h-section mb-3">—— Lectures sauvegardées</div>
          {SAMPLE_ARTICLES.slice(0, 4).map((it) => (
            // TODO: switch profil page to Drizzle, then build a real href from category slug + article slug.
            <ArticleCard key={it.id} item={it} href="#" kind="mini" />
          ))}
        </div>
        <div>
          <div className="h-section mb-3">—— Mes commentaires récents</div>
          {[
            {
              on: "Pompes à chaleur air-eau : ce qui change…",
              when: "il y a 2 j",
              t: "Sur le terrain, le COP 3,5 est tenable sur radiateurs basse température neufs…",
            },
            {
              on: "MaPrimeRénov’ : la nouvelle grille 2026…",
              when: "il y a 1 sem.",
              t: "Attention au cumul avec les CEE — j’ai eu un dossier rejeté pour cette raison.",
            },
          ].map((c, i) => (
            <div key={i} className="py-3 border-b border-paper-line">
              <div className="mono text-[9px] tracking-[0.08em] uppercase text-ink-mute">
                SUR — {c.on} · {c.when}
              </div>
              <p className="text-[13px] text-ink-2 mt-1.5 leading-[1.45]">
                {c.t}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
