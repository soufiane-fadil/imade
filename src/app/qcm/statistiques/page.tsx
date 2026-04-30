import Link from "next/link";
import { AccountHeader } from "@/components/account-header";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/atoms";

export default function QCMStatsPage() {
  const sessions = [
    { d: "30 jan.", score: 28, dur: 12.8 },
    { d: "19 fév.", score: 21, dur: 21.1 },
    { d: "8 mar.", score: 24, dur: 17.6 },
    { d: "22 avr.", score: 27, dur: 14.0 },
    { d: "27 avr.", score: 27, dur: 14.1 },
  ];
  const cats = [
    { c: "Pompes à chaleur", mine: 92, cohort: 71, n: 12 },
    { c: "Isolation", mine: 80, cohort: 76, n: 10 },
    { c: "Solaire", mine: 100, cohort: 64, n: 4 },
    { c: "Réglementation", mine: 50, cohort: 58, n: 4 },
  ];
  const themesWeak = [
    { theme: "Décrets PAC 2026", taux: "50 %", delta: "−18 pts", q: 2 },
    { theme: "CEE & cumuls aides", taux: "60 %", delta: "−12 pts", q: 5 },
    {
      theme: "VMC double-flux — débits réglementaires",
      taux: "67 %",
      delta: "−7 pts",
      q: 3,
    },
  ];
  const themesStrong = [
    {
      theme: "Solaire — autoconsommation",
      taux: "100 %",
      delta: "+36 pts",
      q: 4,
    },
    { theme: "PAC air-eau — circuits", taux: "100 %", delta: "+29 pts", q: 6 },
    {
      theme: "Isolation — laine de bois",
      taux: "92 %",
      delta: "+16 pts",
      q: 4,
    },
  ];

  const W = 720,
    H = 220,
    P = 28;
  const xs = sessions.map(
    (_, i) => P + i * ((W - 2 * P) / (sessions.length - 1)),
  );
  const ys = sessions.map((s) => H - P - (s.score / 30) * (H - 2 * P));
  const path = xs
    .map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`)
    .join(" ");

  return (
    <div className="mc-root w-full max-w-[1280px] mx-auto bg-paper-2">
      <AccountHeader active="profile#tests" />

      <section className="px-4 pt-5 md:px-7">
        <div className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute flex flex-wrap gap-2 items-center">
          <Link
            href="/profil"
            className="lnk text-ink-mute border-transparent"
          >
            Mon espace
          </Link>
          <span className="text-paper-line">/</span>
          <Link
            href="/profil"
            className="lnk text-ink-mute border-transparent"
          >
            Mes QCM
          </Link>
          <span className="text-paper-line">/</span>
          <Link
            href="/qcm/resultats"
            className="lnk text-ink-mute border-transparent"
          >
            Session du 27 avril
          </Link>
          <span className="text-paper-line">/</span>
          <span className="text-ink border-b border-ink">
            Statistiques détaillées
          </span>
        </div>
      </section>

      <section className="px-4 py-6 md:px-7 md:py-8 border-b border-ink grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <div className="mono text-[10px] tracking-[0.16em] uppercase text-signal">
            ◉ STATISTIQUES — TOUTES SESSIONS CONFONDUES
          </div>
          <h1 className="h-display text-4xl md:text-5xl lg:text-[64px] mt-2 leading-none">
            Vous progressez,
            <br />
            <span className="text-signal">+6 points</span> en 4 mois.
          </h1>
          <p className="font-serif italic text-[16px] text-ink-3 max-w-[640px] mt-3 leading-[1.5]">
            5 sessions passées entre janvier et avril 2026. Score moyen{" "}
            <strong>25,4 / 30</strong> — au-dessus de la moyenne du cohorte (
            <strong>21,8 / 30</strong>). Vous êtes dans le{" "}
            <strong>top 12 %</strong> des candidats RGE.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn--ghost btn--sm">Exporter PDF</button>
          <Link href="/qcm" className="btn btn--primary btn--sm">
            Acheter un nouveau pass <Icon.arrowR />
          </Link>
        </div>
      </section>

      <section className="border-b border-ink grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 bg-paper">
        {[
          ["25,4 / 30", "Score moyen", "↑ +1,2 vs cohorte"],
          ["90 %", "Meilleure session", "27 avril 2026"],
          ["14 min", "Durée moyenne", "−4 min vs cohorte"],
          ["12 %", "Rang dans la cohorte", "top 12 % des pros"],
          ["4 / 5", "Sessions réussies", "≥ 21 / 30 requis"],
        ].map(([n, l, d], i) => (
          <div
            key={i}
            className={
              "px-5 py-5 border-b border-paper-line lg:border-b-0 " +
              (i < 4 ? "lg:border-r border-paper-line" : "")
            }
          >
            <div className="h-display text-[36px] leading-none tracking-[-0.03em]">
              {n}
            </div>
            <div className="lbl mt-1.5">{l}</div>
            <div className="mono text-[10px] text-signal mt-1 tracking-[0.04em]">
              {d}
            </div>
          </div>
        ))}
      </section>

      <section className="px-4 py-7 md:px-7 md:py-8 border-b border-ink grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 bg-paper">
        <div>
          <div className="h-section">—— Progression dans le temps</div>
          <div className="h-title text-2xl md:text-[24px] mt-1">
            Score sur 30, 5 dernières sessions.
          </div>

          <div className="gridpaper mt-5 border border-ink p-4 md:px-[18px] md:py-4 relative bg-paper">
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
              {[0, 10, 21, 30].map((v) => {
                const y = H - P - (v / 30) * (H - 2 * P);
                return (
                  <g key={v}>
                    <line
                      x1={P}
                      x2={W - P}
                      y1={y}
                      y2={y}
                      stroke="var(--paper-line)"
                      strokeDasharray={v === 21 ? "4 4" : "0"}
                      strokeWidth="1"
                    />
                    <text
                      x={P - 4}
                      y={y + 3}
                      fontSize="10"
                      fontFamily="var(--mono)"
                      textAnchor="end"
                      fill="var(--ink-mute)"
                    >
                      {v}
                    </text>
                    {v === 21 && (
                      <text
                        x={W - P + 4}
                        y={y + 3}
                        fontSize="9"
                        fontFamily="var(--mono)"
                        fill="var(--signal)"
                      >
                        SEUIL
                      </text>
                    )}
                  </g>
                );
              })}
              <path d={path} fill="none" stroke="var(--ink)" strokeWidth="2" />
              {sessions.map((s, i) => (
                <g key={i}>
                  <circle
                    cx={xs[i]}
                    cy={ys[i]}
                    r="5"
                    fill="var(--paper)"
                    stroke="var(--ink)"
                    strokeWidth="2"
                  />
                  <text
                    x={xs[i]}
                    y={ys[i] - 12}
                    fontSize="11"
                    fontFamily="var(--mono)"
                    fontWeight="600"
                    textAnchor="middle"
                    fill="var(--ink)"
                  >
                    {s.score}
                  </text>
                  <text
                    x={xs[i]}
                    y={H - 8}
                    fontSize="10"
                    fontFamily="var(--mono)"
                    textAnchor="middle"
                    fill="var(--ink-mute)"
                  >
                    {s.d}
                  </text>
                </g>
              ))}
              <circle
                cx={xs[xs.length - 1]}
                cy={ys[ys.length - 1]}
                r="9"
                fill="none"
                stroke="var(--signal)"
                strokeWidth="1.5"
              />
            </svg>
            <div className="mono text-[10px] tracking-[0.06em] text-ink-mute flex justify-between mt-2">
              <span>Janvier 2026</span>
              <span>Avril 2026</span>
            </div>
          </div>

          <div className="mono text-[11px] text-ink-3 mt-2.5 flex flex-wrap gap-3.5">
            <span>
              <span className="inline-block w-2.5 h-0.5 bg-ink align-middle"></span>{" "}
              Votre score
            </span>
            <span>
              <span className="inline-block w-2.5 h-0 border-t-[1.5px] border-dashed border-signal align-middle"></span>{" "}
              Seuil de réussite (21 / 30)
            </span>
            <span className="md:ml-auto text-ink-mute tracking-[0.04em] uppercase text-[10px]">
              Source : 5 passages QCM RGE
            </span>
          </div>
        </div>

        <div className="border border-ink p-5 md:p-[22px] bg-ink text-paper">
          <div className="mono text-[10px] tracking-[0.16em] uppercase text-signal">
            ◉ POSITIONNEMENT
          </div>
          <div className="font-serif text-[22px] mt-2 leading-[1.25]">
            Vous êtes dans le{" "}
            <span className="h-display text-5xl md:text-[80px] text-signal leading-none block mt-1.5">
              TOP 12 %
            </span>
          </div>
          <div className="mono text-[11px] text-paper-3 mt-1.5 tracking-[0.04em]">
            sur 1 200 candidats certifiés RGE en 2026.
          </div>

          <div className="mt-5">
            <div className="mono text-[9px] tracking-[0.12em] uppercase text-paper-3 mb-2">
              DISTRIBUTION DES SCORES — COHORTE
            </div>
            <div className="flex gap-[3px] items-end h-20">
              {[8, 14, 22, 31, 38, 46, 64, 78, 92, 88, 72, 54, 41].map(
                (v, i, a) => {
                  const x = (i / (a.length - 1)) * 30;
                  const isMe = Math.abs(x - 27) < 1.2;
                  return (
                    <div
                      key={i}
                      className={
                        "flex-1 relative " +
                        (isMe ? "bg-signal" : "bg-paper-3")
                      }
                      style={{ height: v + "%" }}
                    >
                      {isMe && (
                        <div className="mono absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-signal whitespace-nowrap tracking-[0.08em]">
                          VOUS · 27
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
            <div className="mono flex justify-between mt-1.5 text-[9px] text-paper-3 tracking-[0.06em]">
              <span>0</span>
              <span>15</span>
              <span>30</span>
            </div>
          </div>

          <div className="border-t border-paper-3 mt-5 pt-4 grid grid-cols-2 gap-3.5">
            {[
              ["Médiane cohorte", "21,8 / 30"],
              ["Votre score moyen", "25,4 / 30"],
              ["Écart-type", "4,1"],
              ["Vous y êtes", "+3,6 σ"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="mono text-[9px] tracking-[0.1em] uppercase text-paper-3">
                  {k}
                </div>
                <div className="mono text-[16px] font-semibold mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-7 md:px-7 md:py-8 border-b border-ink bg-paper">
        <div className="flex flex-wrap justify-between items-baseline gap-3">
          <div>
            <div className="h-section">—— Maîtrise par thème</div>
            <div className="h-title text-2xl md:text-[24px] mt-1">
              Vous, vs la cohorte certifiée RGE.
            </div>
          </div>
          <div className="mono text-[10px] text-ink-mute tracking-[0.06em] uppercase flex gap-3.5">
            <span>
              <span className="inline-block w-3 h-1.5 bg-ink align-middle"></span>{" "}
              Vous
            </span>
            <span>
              <span className="inline-block w-3 h-1.5 bg-paper-line align-middle"></span>{" "}
              Cohorte
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          {cats.map((c) => (
            <div
              key={c.c}
              className="grid grid-cols-1 md:grid-cols-[220px_1fr_80px] gap-4 items-center py-2 border-b border-dashed border-paper-line"
            >
              <div>
                <div className="text-[14px] font-semibold">{c.c}</div>
                <div className="mono text-[10px] text-ink-mute tracking-[0.04em] mt-0.5">
                  {c.n} questions
                </div>
              </div>
              <div className="relative h-7">
                <div className="absolute inset-0 bg-paper-2 border border-paper-line"></div>
                <div
                  className="absolute left-0 top-1 bottom-1 bg-paper-line"
                  style={{ width: c.cohort + "%" }}
                ></div>
                <div
                  className={
                    "absolute left-0 top-2 bottom-2 " +
                    (c.mine >= c.cohort ? "bg-ink" : "bg-signal")
                  }
                  style={{ width: c.mine + "%" }}
                ></div>
                <span
                  className="mono absolute top-1 text-[11px] font-semibold text-ink"
                  style={{
                    left: c.mine + "%",
                    transform: "translateX(4px)",
                  }}
                >
                  {c.mine}%
                </span>
                <span
                  className="mono absolute bottom-0 text-[9px] text-ink-mute"
                  style={{
                    left: c.cohort + "%",
                    transform: "translateX(4px)",
                  }}
                >
                  {c.cohort}% cohorte
                </span>
              </div>
              <div
                className={
                  "mono text-[14px] font-semibold text-right " +
                  (c.mine >= c.cohort ? "text-leaf" : "text-signal")
                }
              >
                {c.mine - c.cohort >= 0 ? "+" : ""}
                {c.mine - c.cohort} pts
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-7 md:px-7 md:py-8 border-b border-ink grid grid-cols-1 md:grid-cols-2 gap-8 bg-paper">
        <div>
          <div className="h-section">—— Points faibles à retravailler</div>
          <div className="font-serif italic text-[14px] text-ink-3 mt-1">
            Thèmes où votre taux de bonnes réponses est en-dessous de la
            cohorte.
          </div>
          <div className="mt-3.5 border border-ink">
            {themesWeak.map((t, i) => (
              <div
                key={t.theme}
                className={
                  "px-4 py-3.5 grid grid-cols-[1fr_70px_80px] gap-2.5 items-center " +
                  (i < themesWeak.length - 1
                    ? "border-b border-paper-line"
                    : "")
                }
              >
                <div>
                  <div className="text-[14px] font-medium">{t.theme}</div>
                  <div className="mono text-[10px] text-ink-mute tracking-[0.04em] mt-0.5">
                    {t.q} questions au total
                  </div>
                </div>
                <div className="mono text-[16px] font-semibold text-ink">
                  {t.taux}
                </div>
                <div className="mono text-[12px] font-semibold text-signal text-right">
                  {t.delta}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3.5">
            <Link href="/rubriques/pompes" className="btn btn--ghost btn--sm">
              Lire les articles liés <Icon.arrowR />
            </Link>
          </div>
        </div>

        <div>
          <div className="h-section">—— Vos points forts</div>
          <div className="font-serif italic text-[14px] text-ink-3 mt-1">
            Thèmes où vous dépassez la moyenne — votre signature d’expert.
          </div>
          <div className="mt-3.5 border border-ink">
            {themesStrong.map((t, i) => (
              <div
                key={t.theme}
                className={
                  "px-4 py-3.5 grid grid-cols-[1fr_70px_80px] gap-2.5 items-center " +
                  (i < themesStrong.length - 1
                    ? "border-b border-paper-line"
                    : "")
                }
              >
                <div>
                  <div className="text-[14px] font-medium">{t.theme}</div>
                  <div className="mono text-[10px] text-ink-mute tracking-[0.04em] mt-0.5">
                    {t.q} questions au total
                  </div>
                </div>
                <div className="mono text-[16px] font-semibold text-ink">
                  {t.taux}
                </div>
                <div className="mono text-[12px] font-semibold text-leaf text-right">
                  {t.delta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-7 md:px-7 md:py-8 border-b border-ink bg-paper-2">
        <div className="h-section">—— Gestion du temps</div>
        <div className="h-title text-2xl md:text-[24px] mt-1">
          Vous allez plus vite que la moyenne.
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 border border-ink bg-paper">
          {[
            ["28 sec", "Temps moyen / question", "−10 sec vs cohorte (38 s)"],
            [
              "1 min 12",
              "Question la plus longue",
              "Q.18 — Décret PAC du 14 avril",
            ],
            [
              "8 sec",
              "Question la plus rapide",
              "Q.04 — Solaire autoconsommation",
            ],
          ].map(([n, l, d], i) => (
            <div
              key={i}
              className={
                "px-5 py-5 border-b border-paper-line md:border-b-0 " +
                (i < 2 ? "md:border-r border-paper-line" : "")
              }
            >
              <div className="h-display text-[38px] leading-none">{n}</div>
              <div className="lbl mt-1.5">{l}</div>
              <div className="mono text-[10px] text-ink-mute tracking-[0.04em] mt-1.5">
                {d}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-9 md:px-7 bg-ink text-paper grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <div className="mono text-[10px] tracking-[0.16em] uppercase text-signal">
            ◉ NOTRE RECOMMANDATION
          </div>
          <div className="h-display text-2xl md:text-[32px] mt-2 leading-[1.1]">
            Tentez la{" "}
            <span className="text-signal">certification PAC niveau 3</span>.
          </div>
          <div className="text-[14px] text-paper-3 mt-2 max-w-[720px] leading-[1.5]">
            Avec <strong>92 % de réussite</strong> sur les pompes à chaleur et
            un <strong>+29 pts</strong> vs la cohorte, vous êtes prêt pour le
            palier supérieur. Pass à 79 € — examen 60 questions, certification
            valable 3 ans.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/qcm" className="btn btn--signal">
            Acheter le pass Niv. 3 <Icon.arrowR />
          </Link>
          <button className="btn btn--ghost border-paper-3 text-paper">
            Voir le programme
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
