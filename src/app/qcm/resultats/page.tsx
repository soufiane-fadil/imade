import Link from "next/link";
import { AccountHeader } from "@/components/account-header";
import { Footer } from "@/components/footer";
import { Tag, Icon } from "@/components/atoms";

export default function QCMResultsPage() {
  const score = 27,
    total = 30,
    pct = Math.round((score / total) * 100);
  const breakdown = [
    { cat: "Pompes à chaleur", n: 8, ok: 7 },
    { cat: "Isolation", n: 7, ok: 6 },
    { cat: "Solaire", n: 5, ok: 5 },
    { cat: "Ventilation", n: 4, ok: 4 },
    { cat: "Réglementation", n: 3, ok: 2 },
    { cat: "Aides & financement", n: 3, ok: 3 },
  ];
  const review = [
    {
      i: 1,
      q: "Pour une PAC air-eau installée en 2026 sur réseau radiateurs basse température, quel est le COP minimum imposé ?",
      picked: 2,
      correct: 2,
      opts: ["2,8", "3,2", "3,5", "3,8"],
    },
    {
      i: 2,
      q: "Quelle laine d’isolation présente le meilleur déphasage thermique pour des combles aménagés ?",
      picked: 2,
      correct: 2,
      opts: [
        "Laine de verre",
        "Laine de roche",
        "Laine de bois",
        "Polyuréthane",
      ],
    },
    {
      i: 3,
      q: "Le seuil DPE pour qualifier un logement de « passoire thermique » est :",
      picked: 1,
      correct: 3,
      opts: ["Classe E", "Classe F", "Classe G", "Classe F ou G"],
    },
    {
      i: 4,
      q: "Pour MaPrimeRénov’ Sérénité, quel gain énergétique minimum est exigé après travaux ?",
      picked: 1,
      correct: 1,
      opts: ["25 %", "35 %", "45 %", "55 %"],
    },
  ];
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
          <span className="text-ink border-b border-ink">
            Résultats — session du 27 avril
          </span>
        </div>
      </section>

      <section className="px-4 py-8 md:px-7 md:py-10 border-b border-ink bg-paper-2">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] gap-8 lg:gap-10 items-center">
          <div className="relative w-[240px] h-[240px] md:w-[280px] md:h-[280px] mx-auto lg:mx-0">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full -rotate-90"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="var(--paper-3)"
                strokeWidth="3"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="var(--leaf)"
                strokeWidth="3"
                strokeDasharray={`${(pct / 100) * 276.46} 276.46`}
                strokeLinecap="square"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="0.4"
                strokeDasharray="0.5 1.5"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="mono text-[10px] tracking-[0.16em] uppercase text-ink-mute">
                SCORE FINAL
              </div>
              <div className="h-display text-[64px] md:text-[80px] text-leaf leading-none mt-1">
                {pct}
                <span className="text-[28px] md:text-[32px]">%</span>
              </div>
              <div className="mono text-[14px] font-semibold mt-1 tracking-[0.04em]">
                {score} / {total}
              </div>
            </div>
          </div>
          <div>
            <Tag kind="leaf">CERTIFICATION VALIDÉE</Tag>
            <h1 className="h-display text-4xl md:text-5xl lg:text-[64px] mt-3.5">
              Bravo Mathieu — vous êtes{" "}
              <span className="text-leaf">certifié RGE Niv. 2 PAC.</span>
            </h1>
            <p className="text-[16px] text-ink-3 mt-3 max-w-[580px] leading-[1.5]">
              Votre attestation est disponible immédiatement et a été ajoutée à
              l’annuaire public des certifiés. Les outils de diagnostic Maison
              Calorie sont désormais débloqués sur votre compte.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <button className="btn btn--primary">
                <Icon.doc /> Télécharger l’attestation (PDF)
              </button>
              <button className="btn btn--ghost">Partager sur LinkedIn</button>
            </div>
          </div>
          <div className="tick-frame p-4 bg-paper">
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <div className="lbl">RÉCAPITULATIF</div>
            <ul className="list-none p-0 mt-3 grid gap-2 text-[12px]">
              {(
                [
                  ["Code", "QCM-7H4K-9P2X-A1B6"],
                  ["Date", "27 avr. 2026 · 10 h 22"],
                  ["Durée", "14 min 07 s"],
                  ["Bonnes réponses", "27 / 30"],
                  ["Seuil", "21 / 30"],
                  [
                    "Statut",
                    <Tag key="t" kind="leaf">
                      RÉUSSI
                    </Tag>,
                  ],
                ] as [string, React.ReactNode][]
              ).map(([k, v]) => (
                <li
                  key={k}
                  className="flex justify-between items-center border-b border-dashed border-paper-line py-1"
                >
                  <span className="mono text-[10px] tracking-[0.06em] uppercase text-ink-mute">
                    {k}
                  </span>
                  <span className="mono text-[11px] font-medium">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-7 md:px-7 md:py-8 border-b border-ink">
        <div className="h-section mb-4">—— Répartition par thème</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {breakdown.map((b) => {
            const p = Math.round((b.ok / b.n) * 100);
            const pass = p >= 70;
            return (
              <div key={b.cat} className="tick-frame p-3.5">
                <span className="tick-bl"></span>
                <span className="tick-br"></span>
                <div className="lbl">{b.cat}</div>
                <div className="flex justify-between items-baseline mt-1.5">
                  <div
                    className={
                      "mono text-[28px] font-semibold " +
                      (pass ? "text-leaf" : "text-signal")
                    }
                  >
                    {b.ok}
                    <span className="text-ink-mute">/{b.n}</span>
                  </div>
                  <div
                    className={
                      "mono text-[11px] " +
                      (pass ? "text-leaf" : "text-signal")
                    }
                  >
                    {p} %
                  </div>
                </div>
                <div className="h-1 bg-paper-3 mt-2.5">
                  <div
                    className={
                      "h-full " + (pass ? "bg-leaf" : "bg-signal")
                    }
                    style={{ width: p + "%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-7 md:px-7 md:py-8 border-b border-ink">
        <div className="flex flex-wrap justify-between items-baseline gap-3 mb-4">
          <div>
            <div className="h-section">—— Détail des réponses</div>
            <div className="h-title text-2xl md:text-[28px] mt-1">
              Revoir chaque question
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button className="btn btn--sm">Toutes</button>
            <button className="btn btn--ghost btn--sm">Bonnes (27)</button>
            <button className="btn btn--ghost btn--sm text-signal border-signal">
              À revoir (3)
            </button>
          </div>
        </div>
        <div className="grid gap-3">
          {review.map((r) => {
            const ok = r.picked === r.correct;
            return (
              <details
                key={r.i}
                className="tick-frame p-0 bg-paper"
                open={!ok}
              >
                <span className="tick-bl"></span>
                <span className="tick-br"></span>
                <summary className="cursor-pointer p-4 grid grid-cols-[40px_1fr_auto] gap-3.5 items-center">
                  <span
                    className={
                      "mono text-[12px] font-semibold " +
                      (ok ? "text-leaf" : "text-signal")
                    }
                  >
                    Q{String(r.i).padStart(2, "0")}
                  </span>
                  <span className="text-[14px] font-medium tracking-[-0.01em]">
                    {r.q}
                  </span>
                  <Tag kind={ok ? "leaf" : "signal"}>
                    {ok ? "✓ CORRECT" : "✗ INCORRECT"}
                  </Tag>
                </summary>
                <div className="border-t border-paper-line p-4 bg-paper-2">
                  <div className="grid gap-1.5">
                    {r.opts.map((opt, i) => {
                      const isCorrect = i === r.correct;
                      const isPicked = i === r.picked;
                      let cls =
                        "border-paper-line bg-paper text-ink-3";
                      if (isCorrect)
                        cls =
                          "border-leaf bg-leaf/[0.12] text-leaf-deep";
                      if (isPicked && !isCorrect)
                        cls =
                          "border-signal bg-signal/[0.10] text-signal-deep";
                      return (
                        <div
                          key={i}
                          className={
                            "mono px-3 py-2 border text-[12px] flex justify-between " +
                            cls
                          }
                        >
                          <span>
                            {String.fromCharCode(65 + i)} · {opt}
                          </span>
                          <span className="font-semibold">
                            {isCorrect && "◉ Bonne réponse"}
                            {isPicked && !isCorrect && "✗ Votre réponse"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 p-3 bg-paper border border-dashed border-paper-line">
                    <div className="lbl text-plot">EXPLICATION</div>
                    <p className="text-[13px] text-ink-2 mt-1 leading-[1.5]">
                      Le décret n° 2026-412 du 14 avril impose un COP minimum de
                      3,5 pour les PAC subventionnées. Voir{" "}
                      <a href="#" className="lnk">
                        notre décryptage
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-7 md:px-7 md:py-8 border-b border-ink grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 border border-ink bg-ink text-paper">
          <div className="mono text-[10px] tracking-[0.16em] uppercase text-signal">
            ◉ ÉTAPE SUIVANTE
          </div>
          <h3 className="h-title text-[26px] mt-1.5">
            Activez vos outils de diagnostic.
          </h3>
          <p className="text-[13px] text-paper-3 mt-1.5 leading-[1.5]">
            Votre certification ouvre l’accès aux modules d’audit en ligne et à
            la commande matériel à tarif pro.
          </p>
          <button className="btn btn--signal mt-3.5">
            Ouvrir mon espace pro <Icon.arrowR />
          </button>
        </div>
        <div className="p-5 border border-paper-line bg-paper-2">
          <div className="lbl">VISER UNE AUTRE CERTIFICATION ?</div>
          <h3 className="h-title text-[26px] mt-1.5">
            Achetez un nouveau pass.
          </h3>
          <p className="text-[13px] text-ink-3 mt-1.5 leading-[1.5]">
            Isolation Niv. 2, Solaire, Ventilation… vous gardez votre profil et
            votre historique.
          </p>
          <Link href="/qcm" className="btn btn--primary mt-3.5">
            Voir les passes <Icon.arrowR />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
