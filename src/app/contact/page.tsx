import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/article-card";
import { Tag } from "@/components/atoms";

export default function ContactPage() {
  const reasons: { v: string; label: string; desc: string }[] = [
    { v: "q", label: "Une question sur un article", desc: "Précision, source, complément" },
    { v: "e", label: "Signaler une erreur", desc: "Donnée fausse ou obsolète" },
    { v: "qcm", label: "Une question sur un QCM", desc: "Code, paiement, certification" },
    { v: "a", label: "Autre demande", desc: "Presse, partenariat, idée de sujet" },
  ];
  const coords: [string, string][] = [
    ["Rédaction", "redac@maison-calorie.fr"],
    ["Presse", "presse@maison-calorie.fr"],
    ["QCM & certifications", "qcm@maison-calorie.fr"],
    ["Adresse postale", "11 rue de la Forge — 75011 Paris"],
    ["Téléphone (lun-ven 9h-18h)", "+33 (0)1 84 60 14 20"],
  ];
  return (
    <div className="mc-root" style={{ width: 1280 }}>
      <Header />
      <section style={{ padding: "20px 28px 0" }}><Breadcrumbs trail={["Accueil", "Contact"]} /></section>
      <section style={{ padding: "24px 28px", borderBottom: "1px solid var(--ink)" }}>
        <Tag kind="signal">Bureau éditorial</Tag>
        <h1 className="h-display" style={{ fontSize: 64, margin: "8px 0 0" }}>Écrivez-nous.</h1>
        <p style={{ fontSize: 16, color: "var(--ink-3)", marginTop: 10, maxWidth: 620, lineHeight: 1.5 }}>
          Une question, un sujet d’enquête, une erreur à signaler ? L’équipe lit tout — nous répondons sous 48 h en jours ouvrés.
        </p>
      </section>
      <section style={{ padding: "32px 28px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, borderBottom: "1px solid var(--ink)" }}>
        <div style={{ border: "1px solid var(--ink)", background: "var(--paper)", maxWidth: 640 }}>
          <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--ink)", background: "var(--paper-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--signal)" }}>◉ FORMULAIRE DE CONTACT</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, marginTop: 2, letterSpacing: "-0.01em" }}>Remplissez les champs ci-dessous.</div>
            </div>
            <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.04em" }}>Étape 1 / 1</span>
          </div>

          <form style={{ display: "grid", gap: 22, padding: "24px 22px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 10, padding: "10px 12px", background: "var(--paper-2)", border: "1px dashed var(--paper-line)" }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--signal)", textAlign: "center", lineHeight: 1 }}>ⓘ</span>
              <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.45 }}>
                Les champs marqués d’une étoile <span style={{ color: "var(--signal)" }}>*</span> sont obligatoires. Nous vous répondrons à l’adresse e-mail indiquée, sous 48 h en jours ouvrés.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label htmlFor="ct-name" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                  Votre nom complet <span style={{ color: "var(--signal)" }}>*</span>
                </label>
                <input id="ct-name" className="field" defaultValue="Mathieu Renaud" style={{ fontSize: 15, padding: "12px 14px", height: "auto" }} />
                <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 4, fontStyle: "italic" }}>Prénom et nom, comme vous souhaitez être appelé.</div>
              </div>
              <div>
                <label htmlFor="ct-email" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                  Votre adresse e-mail <span style={{ color: "var(--signal)" }}>*</span>
                </label>
                <input id="ct-email" type="email" className="field" defaultValue="m.renaud@exemple.fr" style={{ fontSize: 15, padding: "12px 14px", height: "auto" }} />
                <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 4, fontStyle: "italic" }}>C’est ici que nous enverrons notre réponse.</div>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                Motif de votre message <span style={{ color: "var(--signal)" }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {reasons.map((o, i) => (
                  <label key={o.v} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 10, padding: "12px 14px", border: "1px solid " + (i === 0 ? "var(--ink)" : "var(--paper-line)"), background: i === 0 ? "var(--paper-2)" : "var(--paper)", cursor: "pointer", alignItems: "flex-start" }}>
                    <input type="radio" name="reason" defaultChecked={i === 0} style={{ marginTop: 3 }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{o.label}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{o.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="ct-subject" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                Sujet du message <span style={{ color: "var(--signal)" }}>*</span>
              </label>
              <input id="ct-subject" className="field" defaultValue="Question sur le décret PAC du 14 avril" style={{ fontSize: 15, padding: "12px 14px", height: "auto" }} />
              <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 4, fontStyle: "italic" }}>En une phrase courte. Ex. : « Précision sur le COP des PAC en 2026 ».</div>
            </div>

            <div>
              <label htmlFor="ct-msg" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                Votre message <span style={{ color: "var(--signal)" }}>*</span>
              </label>
              <textarea id="ct-msg" className="field" rows={9} defaultValue={"Bonjour,\n\nJ’ai lu votre article sur les pompes à chaleur air-eau du 24 avril, et je voulais obtenir une précision concernant…\n\nMerci par avance,\nMathieu"} style={{ fontFamily: "var(--sans)", fontSize: 15, lineHeight: 1.55, padding: "12px 14px", resize: "vertical", height: "auto" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 12, color: "var(--ink-mute)", fontStyle: "italic" }}>Soyez aussi précis que possible — citez l’article si besoin.</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>148 / 4 000</span>
              </div>
            </div>

            <label style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 10, padding: "12px 14px", background: "var(--paper-2)", border: "1px solid var(--paper-line)", cursor: "pointer", alignItems: "flex-start" }}>
              <input type="checkbox" defaultChecked style={{ marginTop: 3 }} />
              <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.45 }}>
                <strong>J’accepte que mes données soient utilisées pour traiter ma demande.</strong> Elles ne seront ni revendues ni utilisées à d’autres fins, conformément à notre <a href="#" className="lnk">politique de confidentialité</a>.
              </div>
            </label>

            <div style={{ display: "flex", gap: 12, alignItems: "center", borderTop: "1px solid var(--paper-line)", paddingTop: 18 }}>
              <button className="btn btn--primary" type="button" style={{ fontSize: 16, padding: "14px 24px", height: "auto" }}>
                ✉ Envoyer mon message
              </button>
              <button className="btn btn--ghost" type="button">Annuler</button>
              <span style={{ fontSize: 12, color: "var(--ink-mute)", marginLeft: "auto", fontStyle: "italic" }}>Réponse sous 48 h en jours ouvrés.</span>
            </div>
          </form>
        </div>
        <aside>
          <div className="tick-frame" style={{ padding: 18 }}>
            <span className="tick-bl"></span><span className="tick-br"></span>
            <div className="h-section">—— Coordonnées</div>
            <div style={{ marginTop: 12, display: "grid", gap: 14 }}>
              {coords.map(([k, v]) => (
                <div key={k} style={{ borderBottom: "1px dashed var(--paper-line)", paddingBottom: 10 }}>
                  <div className="lbl">{k}</div>
                  <div className="mono" style={{ fontSize: 13, color: "var(--ink)", marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-mute)", marginTop: 16, padding: 14, border: "1px dashed var(--paper-line)" }}>
            ⓘ Pour signaler une erreur factuelle dans un article : utilisez le lien « signaler » sous le commentaire concerné — c’est plus rapide.
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  );
}
