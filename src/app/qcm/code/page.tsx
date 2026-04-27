"use client";
import { useState, Fragment } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/article-card";
import { Tag, Icon } from "@/components/atoms";

export default function QCMGatePage() {
  const [code, setCode] = useState(["QCM7", "H4K9", "P2XA", "1B6D"]);
  const rules: [string, string][] = [
    ["30 questions", "Une seule bonne réponse par question parmi 4."],
    ["Navigation libre", "Vous pouvez revenir sur une question à tout moment."],
    ["Pas de chrono limite", "Mais un chronomètre s’affiche à titre indicatif."],
    ["Sauvegarde auto", "Vos réponses sont enregistrées. Une déconnexion ne fait pas perdre votre progression."],
    ["Score requis", "21 / 30 (70 %) pour valider la certification."],
    ["Une seule session", "Le code expire après soumission, qu’elle soit réussie ou non."],
  ];
  return (
    <div className="mc-root" style={{ width: 1280, minHeight: 1000 }}>
      <Header />
      <section style={{ padding: "20px 28px 0" }}><Breadcrumbs trail={["Accueil", "QCM RGE", "Saisir un code"]} /></section>
      <section className="gridpaper" style={{ padding: "60px 28px", borderBottom: "1px solid var(--ink)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, minHeight: 720 }}>
        <div style={{ alignSelf: "center", maxWidth: 480 }}>
          <Tag kind="signal">VÉRIFICATION D’ACCÈS</Tag>
          <h1 className="h-display" style={{ fontSize: 64, margin: "14px 0 0" }}>Saisissez<br />votre code.</h1>
          <p style={{ fontSize: 16, color: "var(--ink-3)", marginTop: 14, lineHeight: 1.5 }}>
            Vous avez reçu par e-mail un code unique de 16 caractères au moment de l’achat de votre pass. Ce code donne accès à <strong>une seule</strong> session de QCM.
          </p>
          <div className="tick-frame" style={{ padding: 18, marginTop: 20, background: "var(--paper)" }}>
            <span className="tick-bl"></span><span className="tick-br"></span>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Saisissez votre code d’accès</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.45 }}>
              16 caractères répartis en 4 groupes de 4. Reçu par e-mail au moment de l’achat.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
              <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: "var(--ink-mute)", letterSpacing: "0.08em" }}>QCM</span>
              <span className="mono" style={{ fontSize: 22, color: "var(--ink-mute)" }}>—</span>
              {code.map((seg, i) => (
                <Fragment key={i}>
                  <input value={seg} onChange={(e) => { const c = [...code]; c[i] = e.target.value.toUpperCase().slice(0, 4); setCode(c); }}
                    aria-label={`Groupe ${i + 1} sur 4`}
                    className="mono"
                    style={{ fontSize: 22, letterSpacing: "0.16em", textAlign: "center", padding: "12px 0", flex: 1, minWidth: 0, background: "var(--paper-2)", border: "1px solid var(--ink)", textTransform: "uppercase", color: "var(--ink)", outline: "none" }} />
                  {i < code.length - 1 && <span className="mono" style={{ fontSize: 22, color: "var(--ink-mute)" }}>—</span>}
                </Fragment>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 10, fontStyle: "italic" }}>
              Exemple : <span className="mono" style={{ fontStyle: "normal" }}>QCM — 7H4K — 9P2X — A1B6</span>. Lettres et chiffres uniquement.
            </div>
          </div>
          <Link href="/qcm/test" className="btn btn--signal" style={{ marginTop: 18, width: "100%", justifyContent: "center" }}>
            Démarrer le QCM <Icon.arrowR />
          </Link>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between" }}>
            <a href="#" className="lnk mono" style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase" }}>Code introuvable ?</a>
            <Link href="/qcm" className="lnk mono" style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase" }}>Acheter un pass →</Link>
          </div>
        </div>
        <div style={{ alignSelf: "center" }}>
          <div className="tick-frame" style={{ padding: 24, background: "var(--paper)" }}>
            <span className="tick-bl"></span><span className="tick-br"></span>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--signal)" }}>◉ AVANT DE COMMENCER</div>
            <h2 className="h-title" style={{ fontSize: 26, marginTop: 8 }}>Lisez les règles du jeu.</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0" }}>
              {rules.map(([k, v]) => (
                <li key={k} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--paper-line)" }}>
                  <Icon.check style={{ width: 18, height: 18, color: "var(--leaf)" }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{k}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{v}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
