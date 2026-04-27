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
    <div
      className="mc-root"
      style={{ width: 1280, background: "var(--paper-2)" }}
    >
      <AccountHeader active="profile#tests" />

      <section style={{ padding: "20px 28px 0" }}>
        <div
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <Link
            href="/profil"
            className="lnk"
            style={{ color: "var(--ink-mute)", borderColor: "transparent" }}
          >
            Mon espace
          </Link>
          <span style={{ color: "var(--paper-line)" }}>/</span>
          <Link
            href="/profil"
            className="lnk"
            style={{ color: "var(--ink-mute)", borderColor: "transparent" }}
          >
            Mes QCM
          </Link>
          <span style={{ color: "var(--paper-line)" }}>/</span>
          <Link
            href="/qcm/resultats"
            className="lnk"
            style={{ color: "var(--ink-mute)", borderColor: "transparent" }}
          >
            Session du 27 avril
          </Link>
          <span style={{ color: "var(--paper-line)" }}>/</span>
          <span
            style={{
              color: "var(--ink)",
              borderBottom: "1px solid var(--ink)",
            }}
          >
            Statistiques détaillées
          </span>
        </div>
      </section>

      <section
        style={{
          padding: "24px 28px 32px",
          borderBottom: "1px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 24,
          alignItems: "flex-end",
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
            ◉ STATISTIQUES — TOUTES SESSIONS CONFONDUES
          </div>
          <h1
            className="h-display"
            style={{ fontSize: 64, margin: "8px 0 0", lineHeight: 1 }}
          >
            Vous progressez,
            <br />
            <span style={{ color: "var(--signal)" }}>+6 points</span> en 4 mois.
          </h1>
          <p
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 16,
              color: "var(--ink-3)",
              maxWidth: 640,
              marginTop: 12,
              lineHeight: 1.5,
            }}
          >
            5 sessions passées entre janvier et avril 2026. Score moyen{" "}
            <strong>25,4 / 30</strong> — au-dessus de la moyenne du cohorte (
            <strong>21,8 / 30</strong>). Vous êtes dans le{" "}
            <strong>top 12 %</strong> des candidats RGE.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn--ghost btn--sm">Exporter PDF</button>
          <Link href="/qcm" className="btn btn--primary btn--sm">
            Acheter un nouveau pass <Icon.arrowR />
          </Link>
        </div>
      </section>

      <section
        style={{
          padding: "0",
          borderBottom: "1px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          background: "var(--paper)",
        }}
      >
        {[
          ["25,4 / 30", "Score moyen", "↑ +1,2 vs cohorte"],
          ["90 %", "Meilleure session", "27 avril 2026"],
          ["14 min", "Durée moyenne", "−4 min vs cohorte"],
          ["12 %", "Rang dans la cohorte", "top 12 % des pros"],
          ["4 / 5", "Sessions réussies", "≥ 21 / 30 requis"],
        ].map(([n, l, d], i) => (
          <div
            key={i}
            style={{
              padding: "20px 22px",
              borderRight: i < 4 ? "1px solid var(--paper-line)" : 0,
            }}
          >
            <div
              className="h-display"
              style={{ fontSize: 36, lineHeight: 1, letterSpacing: "-0.03em" }}
            >
              {n}
            </div>
            <div className="lbl" style={{ marginTop: 6 }}>
              {l}
            </div>
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--signal)",
                marginTop: 4,
                letterSpacing: "0.04em",
              }}
            >
              {d}
            </div>
          </div>
        ))}
      </section>

      <section
        style={{
          padding: "32px 28px",
          borderBottom: "1px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 32,
          background: "var(--paper)",
        }}
      >
        <div>
          <div className="h-section">—— Progression dans le temps</div>
          <div className="h-title" style={{ fontSize: 24, marginTop: 4 }}>
            Score sur 30, 5 dernières sessions.
          </div>

          <div
            className="gridpaper"
            style={{
              marginTop: 20,
              border: "1px solid var(--ink)",
              padding: "16px 18px",
              position: "relative",
              background: "var(--paper)",
            }}
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              width="100%"
              style={{ display: "block" }}
            >
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
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.06em",
                color: "var(--ink-mute)",
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <span>Janvier 2026</span>
              <span>Avril 2026</span>
            </div>
          </div>

          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              marginTop: 10,
              display: "flex",
              gap: 14,
            }}
          >
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 2,
                  background: "var(--ink)",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              Votre score
            </span>
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 0,
                  borderTop: "1.5px dashed var(--signal)",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              Seuil de réussite (21 / 30)
            </span>
            <span
              style={{
                marginLeft: "auto",
                color: "var(--ink-mute)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontSize: 10,
              }}
            >
              Source : 5 passages QCM RGE
            </span>
          </div>
        </div>

        <div
          style={{
            border: "1px solid var(--ink)",
            padding: 22,
            background: "var(--ink)",
            color: "var(--paper)",
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
            ◉ POSITIONNEMENT
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 22,
              marginTop: 8,
              lineHeight: 1.25,
            }}
          >
            Vous êtes dans le{" "}
            <span
              className="h-display"
              style={{
                fontSize: 80,
                color: "var(--signal)",
                lineHeight: 1,
                display: "block",
                marginTop: 6,
              }}
            >
              TOP 12 %
            </span>
          </div>
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--paper-3)",
              marginTop: 6,
              letterSpacing: "0.04em",
            }}
          >
            sur 1 200 candidats certifiés RGE en 2026.
          </div>

          <div style={{ marginTop: 22 }}>
            <div
              className="mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--paper-3)",
                marginBottom: 8,
              }}
            >
              DISTRIBUTION DES SCORES — COHORTE
            </div>
            <div
              style={{
                display: "flex",
                gap: 3,
                alignItems: "flex-end",
                height: 80,
              }}
            >
              {[8, 14, 22, 31, 38, 46, 64, 78, 92, 88, 72, 54, 41].map(
                (v, i, a) => {
                  const x = (i / (a.length - 1)) * 30;
                  const isMe = Math.abs(x - 27) < 1.2;
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: v + "%",
                        background: isMe ? "var(--signal)" : "var(--paper-3)",
                        position: "relative",
                      }}
                    >
                      {isMe && (
                        <div
                          className="mono"
                          style={{
                            position: "absolute",
                            top: -16,
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: 9,
                            color: "var(--signal)",
                            whiteSpace: "nowrap",
                            letterSpacing: "0.08em",
                          }}
                        >
                          VOUS · 27
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
            <div
              className="mono"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
                fontSize: 9,
                color: "var(--paper-3)",
                letterSpacing: "0.06em",
              }}
            >
              <span>0</span>
              <span>15</span>
              <span>30</span>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--paper-3)",
              marginTop: 22,
              paddingTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {[
              ["Médiane cohorte", "21,8 / 30"],
              ["Votre score moyen", "25,4 / 30"],
              ["Écart-type", "4,1"],
              ["Vous y êtes", "+3,6 σ"],
            ].map(([k, v]) => (
              <div key={k}>
                <div
                  className="mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--paper-3)",
                  }}
                >
                  {k}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "32px 28px",
          borderBottom: "1px solid var(--ink)",
          background: "var(--paper)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div>
            <div className="h-section">—— Maîtrise par thème</div>
            <div className="h-title" style={{ fontSize: 24, marginTop: 4 }}>
              Vous, vs la cohorte certifiée RGE.
            </div>
          </div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--ink-mute)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              display: "flex",
              gap: 14,
            }}
          >
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 6,
                  background: "var(--ink)",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              Vous
            </span>
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 6,
                  background: "var(--paper-line)",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              Cohorte
            </span>
          </div>
        </div>

        <div style={{ marginTop: 22, display: "grid", gap: 16 }}>
          {cats.map((c) => (
            <div
              key={c.c}
              style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr 80px",
                gap: 16,
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px dashed var(--paper-line)",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.c}</div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: "var(--ink-mute)",
                    letterSpacing: "0.04em",
                    marginTop: 2,
                  }}
                >
                  {c.n} questions
                </div>
              </div>
              <div style={{ position: "relative", height: 28 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--paper-2)",
                    border: "1px solid var(--paper-line)",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 4,
                    bottom: 4,
                    width: c.cohort + "%",
                    background: "var(--paper-line)",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 8,
                    bottom: 8,
                    width: c.mine + "%",
                    background:
                      c.mine >= c.cohort ? "var(--ink)" : "var(--signal)",
                  }}
                ></div>
                <span
                  className="mono"
                  style={{
                    position: "absolute",
                    left: c.mine + "%",
                    top: 4,
                    transform: "translateX(4px)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {c.mine}%
                </span>
                <span
                  className="mono"
                  style={{
                    position: "absolute",
                    left: c.cohort + "%",
                    bottom: 0,
                    transform: "translateX(4px)",
                    fontSize: 9,
                    color: "var(--ink-mute)",
                  }}
                >
                  {c.cohort}% cohorte
                </span>
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: c.mine >= c.cohort ? "var(--leaf)" : "var(--signal)",
                  textAlign: "right",
                }}
              >
                {c.mine - c.cohort >= 0 ? "+" : ""}
                {c.mine - c.cohort} pts
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          padding: "32px 28px",
          borderBottom: "1px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          background: "var(--paper)",
        }}
      >
        <div>
          <div className="h-section">—— Points faibles à retravailler</div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 14,
              color: "var(--ink-3)",
              marginTop: 4,
            }}
          >
            Thèmes où votre taux de bonnes réponses est en-dessous de la
            cohorte.
          </div>
          <div style={{ marginTop: 14, border: "1px solid var(--ink)" }}>
            {themesWeak.map((t, i) => (
              <div
                key={t.theme}
                style={{
                  padding: "14px 16px",
                  display: "grid",
                  gridTemplateColumns: "1fr 70px 80px",
                  gap: 10,
                  alignItems: "center",
                  borderBottom:
                    i < themesWeak.length - 1
                      ? "1px solid var(--paper-line)"
                      : 0,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t.theme}</div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--ink-mute)",
                      letterSpacing: "0.04em",
                      marginTop: 2,
                    }}
                  >
                    {t.q} questions au total
                  </div>
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}
                >
                  {t.taux}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--signal)",
                    textAlign: "right",
                  }}
                >
                  {t.delta}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Link href="/rubriques/pompes" className="btn btn--ghost btn--sm">
              Lire les articles liés <Icon.arrowR />
            </Link>
          </div>
        </div>

        <div>
          <div className="h-section">—— Vos points forts</div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 14,
              color: "var(--ink-3)",
              marginTop: 4,
            }}
          >
            Thèmes où vous dépassez la moyenne — votre signature d’expert.
          </div>
          <div style={{ marginTop: 14, border: "1px solid var(--ink)" }}>
            {themesStrong.map((t, i) => (
              <div
                key={t.theme}
                style={{
                  padding: "14px 16px",
                  display: "grid",
                  gridTemplateColumns: "1fr 70px 80px",
                  gap: 10,
                  alignItems: "center",
                  borderBottom:
                    i < themesStrong.length - 1
                      ? "1px solid var(--paper-line)"
                      : 0,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t.theme}</div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--ink-mute)",
                      letterSpacing: "0.04em",
                      marginTop: 2,
                    }}
                  >
                    {t.q} questions au total
                  </div>
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}
                >
                  {t.taux}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--leaf)",
                    textAlign: "right",
                  }}
                >
                  {t.delta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "32px 28px",
          borderBottom: "1px solid var(--ink)",
          background: "var(--paper-2)",
        }}
      >
        <div className="h-section">—— Gestion du temps</div>
        <div className="h-title" style={{ fontSize: 24, marginTop: 4 }}>
          Vous allez plus vite que la moyenne.
        </div>

        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 0,
            border: "1px solid var(--ink)",
            background: "var(--paper)",
          }}
        >
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
              style={{
                padding: "20px 22px",
                borderRight: i < 2 ? "1px solid var(--paper-line)" : 0,
              }}
            >
              <div
                className="h-display"
                style={{ fontSize: 38, lineHeight: 1 }}
              >
                {n}
              </div>
              <div className="lbl" style={{ marginTop: 6 }}>
                {l}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--ink-mute)",
                  letterSpacing: "0.04em",
                  marginTop: 6,
                }}
              >
                {d}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          padding: "36px 28px",
          background: "var(--ink)",
          color: "var(--paper)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 24,
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
            ◉ NOTRE RECOMMANDATION
          </div>
          <div
            className="h-display"
            style={{ fontSize: 32, marginTop: 8, lineHeight: 1.1 }}
          >
            Tentez la{" "}
            <span style={{ color: "var(--signal)" }}>
              certification PAC niveau 3
            </span>
            .
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--paper-3)",
              marginTop: 8,
              maxWidth: 720,
              lineHeight: 1.5,
            }}
          >
            Avec <strong>92 % de réussite</strong> sur les pompes à chaleur et
            un <strong>+29 pts</strong> vs la cohorte, vous êtes prêt pour le
            palier supérieur. Pass à 79 € — examen 60 questions, certification
            valable 3 ans.
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href="/qcm" className="btn btn--signal">
            Acheter le pass Niv. 3 <Icon.arrowR />
          </Link>
          <button
            className="btn btn--ghost"
            style={{ borderColor: "var(--paper-3)", color: "var(--paper)" }}
          >
            Voir le programme
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
