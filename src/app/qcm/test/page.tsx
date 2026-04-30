"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/atoms";

const QCM_QUESTIONS = [
  {
    q: "Pour une PAC air-eau installée en 2026 sur réseau radiateurs basse température, quel est le COP minimum imposé par le décret du 14 avril ?",
    opts: ["2,8", "3,2", "3,5", "3,8"],
    correct: 2,
  },
  {
    q: "Quelle laine d’isolation présente le meilleur déphasage thermique pour des combles aménagés ?",
    opts: ["Laine de verre", "Laine de roche", "Laine de bois", "Polyuréthane"],
    correct: 2,
  },
  {
    q: "Le seuil DPE pour qualifier un logement de « passoire thermique » est :",
    opts: ["Classe E", "Classe F", "Classe G", "Classe F ou G"],
    correct: 3,
  },
  {
    q: "Pour bénéficier de MaPrimeRénov’ Sérénité, quel gain énergétique minimum est exigé après travaux ?",
    opts: ["25 %", "35 %", "45 %", "55 %"],
    correct: 1,
  },
];

const TOPICS = [
  "Décret PAC",
  "Isolation combles",
  "Passoire DPE",
  "MaPrimeRénov’",
  "Étanchéité",
  "VMC",
  "Solaire",
  "Triple vitrage",
  "RE2026",
  "CEE",
];

export default function QCMTestPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({
    0: 2,
    1: 2,
    3: 1,
  });
  const [current, setCurrent] = useState(2);
  const [seconds, setSeconds] = useState(847);
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  const Q = QCM_QUESTIONS[current % QCM_QUESTIONS.length];
  const answeredCount = Object.keys(answers).length;

  return (
    <div
      className="mc-root"
      style={{ width: 1280, minHeight: 900, background: "var(--paper-2)" }}
    >
      <header
        style={{
          background: "var(--paper)",
          color: "var(--ink)",
          padding: "12px 28px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          borderBottom: "1px solid var(--ink)",
          position: "sticky",
          top: 0,
          zIndex: 5,
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            type="button"
            aria-label="Ouvrir la liste des questions"
            onClick={() => setNavOpen(true)}
            className="mc-qcm-nav-toggle btn btn--sm btn--ghost"
            style={{ padding: "8px 10px", fontSize: 16, lineHeight: 1 }}
          >
            ☰
          </button>
          <span
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "-0.03em",
            }}
          >
            Maison<span style={{ color: "var(--signal)" }}>·</span>Calorie
          </span>
          <span
            className="mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-mute)",
            }}
          >
            / Espace membre / QCM en cours
          </span>
        </div>
        <div
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
            textAlign: "center",
          }}
        >
          {answeredCount} / 30 répondues
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 14,
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-mute)",
            }}
          >
            Chronomètre
          </span>
          <span
            className="mono"
            style={{ fontSize: 18, fontWeight: 600, color: "var(--signal)" }}
          >
            ⏱ {m}:{s}
          </span>
          <Link href="/profil" className="btn btn--ghost btn--sm">
            Quitter
          </Link>
        </div>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          minHeight: "calc(100vh - 50px)",
        }}
      >
        <div
          className="mc-qcm-aside-backdrop"
          data-open={navOpen ? "true" : "false"}
          onClick={() => setNavOpen(false)}
          aria-hidden={!navOpen}
        />
        <aside
          className="mc-qcm-aside"
          data-open={navOpen ? "true" : "false"}
          style={{
            background: "var(--paper)",
            borderRight: "1px solid var(--ink)",
            padding: "20px 0",
          }}
        >
          <div
            className="mc-qcm-aside-head"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px 12px",
            }}
          >
            <div className="h-section" style={{ padding: 0 }}>
              —— Liste des questions
            </div>
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setNavOpen(false)}
              className="mc-qcm-aside-close btn btn--sm btn--ghost"
              style={{ padding: "6px 10px", fontSize: 14, lineHeight: 1 }}
            >
              ✕
            </button>
          </div>
          <ol
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              maxHeight: 480,
              overflowY: "auto",
            }}
          >
            {Array.from({ length: 30 }).map((_, i) => {
              const answered = answers[i] != null;
              const isCurrent = i === current;
              return (
                <li key={i}>
                  <button
                    onClick={() => {
                      setCurrent(i);
                      setNavOpen(false);
                    }}
                    className="mono"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "14px 30px 1fr 14px",
                      gap: 8,
                      alignItems: "center",
                      width: "100%",
                      padding: "8px 10px",
                      textAlign: "left",
                      background: isCurrent ? "var(--signal)" : "transparent",
                      color: isCurrent ? "#fff" : "var(--ink)",
                      border: 0,
                      borderBottom: "1px solid var(--paper-line)",
                      fontSize: 11,
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: answered ? "var(--leaf)" : "var(--paper-3)",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{ color: isCurrent ? "#fff" : "var(--ink-mute)" }}
                    >
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 12 }}>
                      {TOPICS[i % TOPICS.length]}
                    </span>
                    {isCurrent ? <Icon.arrowR /> : <span />}
                  </button>
                </li>
              );
            })}
          </ol>
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid var(--paper-line)",
              marginTop: 8,
            }}
          >
            <div className="lbl">Avancement</div>
            <div
              className="mono"
              style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}
            >
              {answeredCount}
              <span style={{ color: "var(--ink-mute)" }}>/30</span>
            </div>
            <div
              style={{ height: 4, background: "var(--paper-3)", marginTop: 8 }}
            >
              <div
                style={{
                  width: (answeredCount / 30) * 100 + "%",
                  height: "100%",
                  background: "var(--signal)",
                }}
              />
            </div>
          </div>
        </aside>

        <main
          style={{
            padding: "40px 60px",
            maxWidth: 880,
            justifySelf: "center",
            width: "100%",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--signal)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              QUESTION {String(current + 1).padStart(2, "0")} / 30 · POMPES À
              CHALEUR
            </span>
            <button className="btn btn--ghost btn--sm">
              <Icon.bookmark /> Marquer pour relire
            </button>
          </div>
          <h2
            className="h-title"
            style={{ fontSize: 32, marginTop: 12, lineHeight: 1.2 }}
          >
            {Q.q}
          </h2>

          <div style={{ marginTop: 28, display: "grid", gap: 10 }}>
            {Q.opts.map((opt, i) => {
              const isPicked = answers[current] === i;
              return (
                <label
                  key={i}
                  onClick={() => setAnswers({ ...answers, [current]: i })}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 1fr 24px",
                    gap: 14,
                    alignItems: "center",
                    padding: "16px 18px",
                    cursor: "pointer",
                    background: isPicked ? "var(--ink)" : "var(--paper)",
                    color: isPicked ? "var(--paper)" : "var(--ink)",
                    border:
                      "1px solid " +
                      (isPicked ? "var(--ink)" : "var(--paper-line)"),
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      width: 28,
                      height: 28,
                      border: "1px solid currentColor",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {opt}
                  </span>
                  {isPicked ? (
                    <Icon.check />
                  ) : (
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        border: "1px dashed currentColor",
                        opacity: 0.3,
                      }}
                    />
                  )}
                </label>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 36,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid var(--paper-line)",
              paddingTop: 20,
            }}
          >
            <button
              className="btn btn--ghost"
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
            >
              <Icon.arrowL /> Précédente
            </button>
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-mute)",
              }}
            >
              Astuce : <span className="kbd">←</span>{" "}
              <span className="kbd">→</span> pour naviguer ·{" "}
              <span className="kbd">A-D</span> pour répondre
            </div>
            {current === 29 ? (
              <Link href="/qcm/resultats" className="btn btn--signal">
                Soumettre le test <Icon.arrowR />
              </Link>
            ) : (
              <button
                className="btn btn--primary"
                onClick={() => setCurrent(Math.min(29, current + 1))}
              >
                Suivante <Icon.arrowR />
              </button>
            )}
          </div>

          <div
            style={{
              marginTop: 24,
              padding: 14,
              background: "var(--paper)",
              border: "1px dashed var(--paper-line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "var(--ink-3)",
              }}
            >
              Vous pouvez soumettre dès que vous le souhaitez. Toute question
              non répondue compte comme une erreur.
            </div>
            <Link href="/qcm/resultats" className="btn btn--signal btn--sm">
              Terminer maintenant →
            </Link>
          </div>
        </main>
      </section>
    </div>
  );
}
