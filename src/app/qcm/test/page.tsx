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
    <div className="mc-root w-full max-w-[1280px] mx-auto min-h-[900px] bg-paper-2">
      <header className="bg-paper text-ink px-4 py-3 md:px-7 flex md:grid md:grid-cols-[1fr_auto_1fr] items-center border-b border-ink sticky top-0 z-[5] gap-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            aria-label="Ouvrir la liste des questions"
            onClick={() => setNavOpen(true)}
            className="mc-qcm-nav-toggle btn btn--sm btn--ghost px-2.5 py-2 text-base leading-none"
          >
            ☰
          </button>
          <span className="font-sans font-extrabold text-[18px] tracking-[-0.03em]">
            Maison<span className="text-signal">·</span>Calorie
          </span>
          <span className="mono hidden md:inline text-[9px] tracking-[0.18em] uppercase text-ink-mute">
            / Espace membre / QCM en cours
          </span>
        </div>
        <div className="mono hidden md:block text-[10px] tracking-[0.08em] uppercase text-ink-mute text-center">
          {answeredCount} / 30 répondues
        </div>
        <div className="flex items-center justify-end gap-3 md:gap-3.5 ml-auto md:ml-0">
          <span className="mono hidden md:inline text-[10px] tracking-[0.08em] uppercase text-ink-mute">
            Chronomètre
          </span>
          <span className="mono text-[16px] md:text-[18px] font-semibold text-signal">
            ⏱ {m}:{s}
          </span>
          <Link href="/profil" className="btn btn--ghost btn--sm">
            Quitter
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[320px_1fr] min-h-[calc(100vh-50px)]">
        <div
          className="mc-qcm-aside-backdrop"
          data-open={navOpen ? "true" : "false"}
          onClick={() => setNavOpen(false)}
          aria-hidden={!navOpen}
        />
        <aside
          className="mc-qcm-aside bg-paper lg:border-r border-ink py-5"
          data-open={navOpen ? "true" : "false"}
        >
          <div className="mc-qcm-aside-head flex items-center justify-between px-4 pb-3">
            <div className="h-section p-0">—— Liste des questions</div>
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setNavOpen(false)}
              className="mc-qcm-aside-close btn btn--sm btn--ghost px-2.5 py-1.5 text-[14px] leading-none"
            >
              ✕
            </button>
          </div>
          <ol className="list-none p-0 m-0 max-h-[480px] overflow-y-auto">
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
                    className={
                      "mono w-full text-left px-2.5 py-2 border-0 border-b border-paper-line text-[11px] tracking-[0.04em] cursor-pointer " +
                      (isCurrent
                        ? "bg-signal text-white"
                        : "bg-transparent text-ink")
                    }
                    style={{
                      display: "grid",
                      gridTemplateColumns: "14px 30px 1fr 14px",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <span
                      className={
                        "w-2 h-2 rounded-full inline-block " +
                        (answered ? "bg-leaf" : "bg-paper-3")
                      }
                    />
                    <span className={isCurrent ? "text-white" : "text-ink-mute"}>
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-[12px]">
                      {TOPICS[i % TOPICS.length]}
                    </span>
                    {isCurrent ? <Icon.arrowR /> : <span />}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="p-4 border-t border-paper-line mt-2">
            <div className="lbl">Avancement</div>
            <div className="mono text-[22px] font-semibold mt-1">
              {answeredCount}
              <span className="text-ink-mute">/30</span>
            </div>
            <div className="h-1 bg-paper-3 mt-2">
              <div
                className="h-full bg-signal"
                style={{ width: (answeredCount / 30) * 100 + "%" }}
              />
            </div>
          </div>
        </aside>

        <main className="p-6 md:p-12 lg:px-[60px] lg:py-10 max-w-[880px] w-full justify-self-center">
          <div className="mono text-[11px] tracking-[0.08em] uppercase text-signal flex flex-wrap gap-2 justify-between">
            <span>
              QUESTION {String(current + 1).padStart(2, "0")} / 30 · POMPES À
              CHALEUR
            </span>
            <button className="btn btn--ghost btn--sm">
              <Icon.bookmark /> Marquer pour relire
            </button>
          </div>
          <h2 className="h-title text-2xl md:text-3xl mt-3 leading-[1.2]">
            {Q.q}
          </h2>

          <div className="mt-7 grid gap-2.5">
            {Q.opts.map((opt, i) => {
              const isPicked = answers[current] === i;
              return (
                <label
                  key={i}
                  onClick={() => setAnswers({ ...answers, [current]: i })}
                  className={
                    "px-4 py-4 cursor-pointer border " +
                    (isPicked
                      ? "bg-ink text-paper border-ink"
                      : "bg-paper text-ink border-paper-line")
                  }
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 1fr 24px",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <span className="mono text-[14px] font-semibold tracking-[0.04em] w-7 h-7 border border-current flex items-center justify-center">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-[16px] font-medium tracking-[-0.01em]">
                    {opt}
                  </span>
                  {isPicked ? (
                    <Icon.check />
                  ) : (
                    <span className="w-4 h-4 border border-dashed border-current opacity-30" />
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-9 flex flex-wrap gap-3 justify-between items-center border-t border-paper-line pt-5">
            <button
              className="btn btn--ghost"
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
            >
              <Icon.arrowL /> Précédente
            </button>
            <div className="mono hidden md:block text-[10px] tracking-[0.08em] uppercase text-ink-mute">
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

          <div className="mt-6 p-3.5 bg-paper border border-dashed border-paper-line flex flex-wrap gap-3 justify-between items-center">
            <div className="mono text-[11px] tracking-[0.04em] text-ink-3">
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
