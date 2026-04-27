import Link from "next/link";
import { AccountHeader } from "@/components/account-header";
import { Footer } from "@/components/footer";
import { Tag, Icon } from "@/components/atoms";

export default function QCMResultsPage() {
  const score = 27, total = 30, pct = Math.round((score / total) * 100);
  const breakdown = [
    { cat: "Pompes à chaleur", n: 8, ok: 7 },
    { cat: "Isolation", n: 7, ok: 6 },
    { cat: "Solaire", n: 5, ok: 5 },
    { cat: "Ventilation", n: 4, ok: 4 },
    { cat: "Réglementation", n: 3, ok: 2 },
    { cat: "Aides & financement", n: 3, ok: 3 },
  ];
  const review = [
    { i: 1, q: "Pour une PAC air-eau installée en 2026 sur réseau radiateurs basse température, quel est le COP minimum imposé ?", picked: 2, correct: 2, opts: ["2,8", "3,2", "3,5", "3,8"] },
    { i: 2, q: "Quelle laine d’isolation présente le meilleur déphasage thermique pour des combles aménagés ?", picked: 2, correct: 2, opts: ["Laine de verre", "Laine de roche", "Laine de bois", "Polyuréthane"] },
    { i: 3, q: "Le seuil DPE pour qualifier un logement de « passoire thermique » est :", picked: 1, correct: 3, opts: ["Classe E", "Classe F", "Classe G", "Classe F ou G"] },
    { i: 4, q: "Pour MaPrimeRénov’ Sérénité, quel gain énergétique minimum est exigé après travaux ?", picked: 1, correct: 1, opts: ["25 %", "35 %", "45 %", "55 %"] },
  ];
  return (
    <div className="mc-root" style={{ width: 1280, background: "var(--paper-2)" }}>
      <AccountHeader active="profile#tests" />
      <section style={{ padding: "20px 28px 0" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-mute)", display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/profil" className="lnk" style={{ color: "var(--ink-mute)", borderColor: "transparent" }}>Mon espace</Link>
          <span style={{ color: "var(--paper-line)" }}>/</span>
          <Link href="/profil" className="lnk" style={{ color: "var(--ink-mute)", borderColor: "transparent" }}>Mes QCM</Link>
          <span style={{ color: "var(--paper-line)" }}>/</span>
          <span style={{ color: "var(--ink)", borderBottom: "1px solid var(--ink)" }}>Résultats — session du 27 avril</span>
        </div>
      </section>

      <section style={{ padding: "40px 28px", borderBottom: "1px solid var(--ink)", background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr 280px", gap: 40, alignItems: "center" }}>
          <div style={{ position: "relative", width: 280, height: 280 }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--paper-3)" strokeWidth="3" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--leaf)" strokeWidth="3"
                strokeDasharray={`${(pct / 100) * 276.46} 276.46`} strokeLinecap="square" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="var(--ink)" strokeWidth="0.4" strokeDasharray="0.5 1.5" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-mute)" }}>SCORE FINAL</div>
              <div className="h-display" style={{ fontSize: 80, color: "var(--leaf)", lineHeight: 1, marginTop: 4 }}>{pct}<span style={{ fontSize: 32 }}>%</span></div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 600, marginTop: 4, letterSpacing: "0.04em" }}>{score} / {total}</div>
            </div>
          </div>
          <div>
            <Tag kind="leaf">CERTIFICATION VALIDÉE</Tag>
            <h1 className="h-display" style={{ fontSize: 64, margin: "14px 0 0" }}>
              Bravo Mathieu — vous êtes <span style={{ color: "var(--leaf)" }}>certifié RGE Niv. 2 PAC.</span>
            </h1>
            <p style={{ fontSize: 16, color: "var(--ink-3)", marginTop: 12, maxWidth: 580, lineHeight: 1.5 }}>
              Votre attestation est disponible immédiatement et a été ajoutée à l’annuaire public des certifiés. Les outils de diagnostic Maison Calorie sont désormais débloqués sur votre compte.
            </p>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button className="btn btn--primary"><Icon.doc /> Télécharger l’attestation (PDF)</button>
              <button className="btn btn--ghost">Partager sur LinkedIn</button>
            </div>
          </div>
          <div className="tick-frame" style={{ padding: 16, background: "var(--paper)" }}>
            <span className="tick-bl"></span><span className="tick-br"></span>
            <div className="lbl">RÉCAPITULATIF</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 8, fontSize: 12 }}>
              {([
                ["Code", "QCM-7H4K-9P2X-A1B6"],
                ["Date", "27 avr. 2026 · 10 h 22"],
                ["Durée", "14 min 07 s"],
                ["Bonnes réponses", "27 / 30"],
                ["Seuil", "21 / 30"],
                ["Statut", <Tag key="t" kind="leaf">RÉUSSI</Tag>],
              ] as [string, React.ReactNode][]).map(([k, v]) => (
                <li key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--paper-line)", padding: "4px 0" }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-mute)" }}>{k}</span>
                  <span className="mono" style={{ fontSize: 11, fontWeight: 500 }}>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 28px", borderBottom: "1px solid var(--ink)" }}>
        <div className="h-section" style={{ marginBottom: 16 }}>—— Répartition par thème</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {breakdown.map((b) => {
            const p = Math.round((b.ok / b.n) * 100);
            const pass = p >= 70;
            return (
              <div key={b.cat} className="tick-frame" style={{ padding: 14 }}>
                <span className="tick-bl"></span><span className="tick-br"></span>
                <div className="lbl">{b.cat}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
                  <div className="mono" style={{ fontSize: 28, fontWeight: 600, color: pass ? "var(--leaf)" : "var(--signal)" }}>{b.ok}<span style={{ color: "var(--ink-mute)" }}>/{b.n}</span></div>
                  <div className="mono" style={{ fontSize: 11, color: pass ? "var(--leaf)" : "var(--signal)" }}>{p} %</div>
                </div>
                <div style={{ height: 4, background: "var(--paper-3)", marginTop: 10 }}>
                  <div style={{ width: p + "%", height: "100%", background: pass ? "var(--leaf)" : "var(--signal)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ padding: "32px 28px", borderBottom: "1px solid var(--ink)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <div>
            <div className="h-section">—— Détail des réponses</div>
            <div className="h-title" style={{ fontSize: 28, marginTop: 4 }}>Revoir chaque question</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn--sm">Toutes</button>
            <button className="btn btn--ghost btn--sm">Bonnes (27)</button>
            <button className="btn btn--ghost btn--sm" style={{ color: "var(--signal)", borderColor: "var(--signal)" }}>À revoir (3)</button>
          </div>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {review.map((r) => {
            const ok = r.picked === r.correct;
            return (
              <details key={r.i} className="tick-frame" style={{ padding: 0, background: "var(--paper)" }} open={!ok}>
                <span className="tick-bl"></span><span className="tick-br"></span>
                <summary style={{ cursor: "pointer", padding: 16, display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 14, alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: ok ? "var(--leaf)" : "var(--signal)" }}>Q{String(r.i).padStart(2, "0")}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em" }}>{r.q}</span>
                  <Tag kind={ok ? "leaf" : "signal"}>{ok ? "✓ CORRECT" : "✗ INCORRECT"}</Tag>
                </summary>
                <div style={{ borderTop: "1px solid var(--paper-line)", padding: 16, background: "var(--paper-2)" }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    {r.opts.map((opt, i) => {
                      const isCorrect = i === r.correct;
                      const isPicked = i === r.picked;
                      let bg = "var(--paper)", col = "var(--ink-3)", bd = "var(--paper-line)";
                      if (isCorrect) { bg = "rgba(47,107,58,0.12)"; col = "var(--leaf-deep)"; bd = "var(--leaf)"; }
                      if (isPicked && !isCorrect) { bg = "rgba(229,72,27,0.10)"; col = "var(--signal-deep)"; bd = "var(--signal)"; }
                      return (
                        <div key={i} className="mono" style={{ padding: "8px 12px", border: "1px solid " + bd, background: bg, color: col, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
                          <span>{String.fromCharCode(65 + i)} · {opt}</span>
                          <span style={{ fontWeight: 600 }}>
                            {isCorrect && "◉ Bonne réponse"}
                            {isPicked && !isCorrect && "✗ Votre réponse"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 12, padding: 12, background: "var(--paper)", border: "1px dashed var(--paper-line)" }}>
                    <div className="lbl" style={{ color: "var(--plot)" }}>EXPLICATION</div>
                    <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>
                      Le décret n° 2026-412 du 14 avril impose un COP minimum de 3,5 pour les PAC subventionnées. Voir <a href="#" className="lnk">notre décryptage</a>.
                    </p>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section style={{ padding: "32px 28px", borderBottom: "1px solid var(--ink)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ padding: 20, border: "1px solid var(--ink)", background: "var(--ink)", color: "var(--paper)" }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--signal)" }}>◉ ÉTAPE SUIVANTE</div>
          <h3 className="h-title" style={{ fontSize: 26, marginTop: 6 }}>Activez vos outils de diagnostic.</h3>
          <p style={{ fontSize: 13, color: "var(--paper-3)", marginTop: 6, lineHeight: 1.5 }}>Votre certification ouvre l’accès aux modules d’audit en ligne et à la commande matériel à tarif pro.</p>
          <button className="btn btn--signal" style={{ marginTop: 14 }}>Ouvrir mon espace pro <Icon.arrowR /></button>
        </div>
        <div style={{ padding: 20, border: "1px solid var(--paper-line)", background: "var(--paper-2)" }}>
          <div className="lbl">VISER UNE AUTRE CERTIFICATION ?</div>
          <h3 className="h-title" style={{ fontSize: 26, marginTop: 6 }}>Achetez un nouveau pass.</h3>
          <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 6, lineHeight: 1.5 }}>Isolation Niv. 2, Solaire, Ventilation… vous gardez votre profil et votre historique.</p>
          <Link href="/qcm" className="btn btn--primary" style={{ marginTop: 14 }}>Voir les passes <Icon.arrowR /></Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
