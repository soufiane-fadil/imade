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
    <div
      className="mc-root"
      style={{ width: 1280, background: "var(--paper-2)" }}
    >
      <AccountHeader active="profile" />

      <section
        style={{
          padding: "24px 28px 0",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16,
          alignItems: "end",
        }}
      >
        <div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--signal)",
            }}
          >
            ◉ TABLEAU DE BORD · 27 AVRIL 2026
          </div>
          <h1
            className="h-display"
            style={{ fontSize: 56, margin: "6px 0 0", lineHeight: 1 }}
          >
            Votre espace
            <br />
            de membre.
          </h1>
          <p
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 16,
              color: "var(--ink-3)",
              maxWidth: 540,
              marginTop: 10,
              lineHeight: 1.45,
            }}
          >
            Vous êtes connecté en tant qu’<strong>artisan certifié RGE</strong>.
            Votre dernier passage de QCM date du 22 avril — un nouveau pass vous
            attend.
          </p>
        </div>
        <div
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
            textAlign: "right",
          }}
        >
          DERNIÈRE CONNEXION
          <br />
          <span
            style={{
              color: "var(--ink)",
              fontSize: 14,
              letterSpacing: 0,
              textTransform: "none",
              fontFamily: "var(--mono)",
            }}
          >
            26 avr. 2026 · 09h12 · Rennes
          </span>
        </div>
      </section>

      <section
        style={{
          padding: "20px 28px",
          marginTop: 24,
          borderTop: "1px solid var(--ink)",
          borderBottom: "1px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 0,
          background: "var(--paper)",
        }}
      >
        {[
          ["4", "Tests passés"],
          ["3", "Réussis"],
          ["25,0 / 30", "Score moyen"],
          ["3", "Certifications"],
          ["1", "Pass non utilisé"],
        ].map(([n, l], i) => (
          <div
            key={i}
            style={{
              padding: 12,
              borderRight: i < 4 ? "1px solid var(--paper-line)" : 0,
            }}
          >
            <div className="h-display" style={{ fontSize: 32 }}>
              {n}
            </div>
            <div className="lbl" style={{ marginTop: 4 }}>
              {l}
            </div>
          </div>
        ))}
      </section>

      <section
        style={{
          padding: "28px 28px",
          borderBottom: "1px solid var(--ink)",
          background: "var(--paper)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 16,
          }}
        >
          <div>
            <div className="h-section">—— Historique des tests</div>
            <div className="h-title" style={{ fontSize: 28, marginTop: 4 }}>
              Vos QCM passés
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn--ghost btn--sm">Exporter CSV</button>
            <Link href="/qcm/code" className="btn btn--primary btn--sm">
              Saisir un code <Icon.arrowR />
            </Link>
          </div>
        </div>
        <div style={{ border: "1px solid var(--ink)" }}>
          <div
            className="mono"
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1.2fr 0.7fr 1fr 0.8fr 100px",
              gap: 12,
              padding: "10px 14px",
              background: "var(--ink)",
              color: "var(--paper)",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
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
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1.2fr 0.7fr 1fr 0.8fr 100px",
                gap: 12,
                padding: "14px",
                borderBottom: "1px solid var(--paper-line)",
                alignItems: "center",
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 11, letterSpacing: "0.04em" }}
              >
                {t.id}
              </span>
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-mute)" }}
              >
                {t.date}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{t.cert}</span>
              <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>
                {t.score}
                <span style={{ color: "var(--ink-mute)" }}>/{t.total}</span>
              </span>
              <span>
                <Tag kind={t.status === "Réussi" ? "leaf" : "signal"}>
                  {t.status}
                </Tag>
              </span>
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-mute)" }}
              >
                {t.dur}
              </span>
              <Link
                href="/qcm/resultats"
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--ink)",
                  justifySelf: "end",
                }}
              >
                Détail →
              </Link>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            border: "1px dashed var(--signal)",
            background: "rgba(229,72,27,0.06)",
            padding: 16,
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 16,
            alignItems: "center",
          }}
        >
          <div>
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--signal)",
              }}
            >
              ◉ PASS NON UTILISÉ
            </div>
            <div className="h-title" style={{ fontSize: 22, marginTop: 4 }}>
              Code{" "}
              <span
                className="mono"
                style={{
                  background: "var(--ink)",
                  color: "var(--paper)",
                  padding: "2px 8px",
                }}
              >
                QCM-7H4K-9P2X-A1B6
              </span>{" "}
              — acheté le 25 avril.
            </div>
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 4 }}
            >
              Valable jusqu’au 25 octobre 2026 · Certification PAC Niv. 2
            </div>
          </div>
          <Link href="/qcm/code" className="btn btn--signal">
            Lancer le QCM <Icon.arrowR />
          </Link>
        </div>
      </section>

      <section
        style={{
          padding: "28px 28px",
          borderBottom: "1px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          background: "var(--paper)",
        }}
      >
        <div>
          <div className="h-section" style={{ marginBottom: 12 }}>
            —— Lectures sauvegardées
          </div>
          {SAMPLE_ARTICLES.slice(0, 4).map((it) => (
            <ArticleCard key={it.id} item={it} kind="mini" />
          ))}
        </div>
        <div>
          <div className="h-section" style={{ marginBottom: 12 }}>
            —— Mes commentaires récents
          </div>
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
            <div
              key={i}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid var(--paper-line)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--ink-mute)",
                }}
              >
                SUR — {c.on} · {c.when}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--ink-2)",
                  margin: "6px 0 0",
                  lineHeight: 1.45,
                }}
              >
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
