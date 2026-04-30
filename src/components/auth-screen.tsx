import Link from "next/link";
import { Header } from "./header";
import { Footer } from "./footer";
import { Tag, Icon } from "./atoms";

export function AuthScreen({ mode }: { mode: "signin" | "signup" }) {
  const isSignup = mode === "signup";
  return (
    <div
      className="mc-root"
      style={{
        width: 1280,
        minHeight: 900,
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <Header />
      <section
        className="mc-auth-section"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
      >
        <div
          className="mc-auth-form"
          style={{
            padding: "60px 80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRight: "1px solid var(--ink)",
          }}
        >
          <Tag kind="signal">{isSignup ? "Créer un compte" : "Connexion"}</Tag>
          <h1
            className="h-display"
            style={{ fontSize: 56, margin: "14px 0 0" }}
          >
            {isSignup ? (
              <>
                Rejoignez
                <br />
                Maison Calorie.
              </>
            ) : (
              <>
                Bon retour
                <br />
                parmi nous.
              </>
            )}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--ink-3)",
              marginTop: 12,
              maxWidth: 420,
              lineHeight: 1.5,
            }}
          >
            {isSignup
              ? "Créez votre compte pour commenter les articles, sauvegarder vos lectures et passer le QCM RGE."
              : "Accédez à vos lectures sauvegardées, vos commentaires et votre historique de tests QCM."}
          </p>
          <form
            style={{ marginTop: 28, display: "grid", gap: 14, maxWidth: 420 }}
          >
            {isSignup && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <div>
                  <label className="lbl">Prénom</label>
                  <input
                    className="field"
                    defaultValue="Mathieu"
                    style={{ marginTop: 6 }}
                  />
                </div>
                <div>
                  <label className="lbl">Nom</label>
                  <input
                    className="field"
                    defaultValue="Renaud"
                    style={{ marginTop: 6 }}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="lbl">Adresse e-mail</label>
              <input
                className="field"
                type="email"
                defaultValue="m.renaud@exemple.fr"
                style={{ marginTop: 6 }}
              />
            </div>
            <div>
              <label className="lbl">Mot de passe</label>
              <input
                className="field"
                type="password"
                defaultValue="••••••••••"
                style={{ marginTop: 6 }}
              />
            </div>
            {isSignup && (
              <label
                className="mono"
                style={{
                  fontSize: 11,
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  color: "var(--ink-3)",
                  letterSpacing: "0.02em",
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ marginTop: 2 }}
                />
                <span>
                  J’accepte la{" "}
                  <a href="#" className="lnk">
                    charte de modération
                  </a>{" "}
                  et la{" "}
                  <a href="#" className="lnk">
                    politique RGPD
                  </a>
                  .
                </span>
              </label>
            )}
            <Link
              href="/profil"
              className="btn btn--primary"
              style={{ marginTop: 4 }}
            >
              {isSignup ? "Créer mon compte" : "Se connecter"} <Icon.arrowR />
            </Link>
            <div className="cap-rule" style={{ margin: "14px 0" }}>
              <span>OU</span>
            </div>
            <button type="button" className="btn btn--ghost">
              Continuer avec Kinde · SSO →
            </button>
            <div
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textAlign: "center",
                marginTop: 6,
              }}
            >
              {isSignup ? (
                <>
                  Déjà inscrit ?{" "}
                  <Link
                    href="/connexion"
                    className="lnk"
                    style={{ color: "var(--ink)" }}
                  >
                    Se connecter →
                  </Link>
                </>
              ) : (
                <>
                  Pas encore de compte ?{" "}
                  <Link
                    href="/inscription"
                    className="lnk"
                    style={{ color: "var(--ink)" }}
                  >
                    S’inscrire →
                  </Link>
                </>
              )}
            </div>
          </form>
        </div>
        <div
          className="gridpaper mc-auth-aside"
          style={{
            padding: "60px 60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "var(--paper-2)",
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
            ◉ MEMBRES — CE MOIS
          </div>
          <div className="h-display" style={{ fontSize: 88, marginTop: 8 }}>
            14 220
          </div>
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-mute)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            lecteurs inscrits, dont 1 200 pros certifiés RGE
          </div>
          <div style={{ marginTop: 36, display: "grid", gap: 14 }}>
            {[
              [
                "Lecture sans pub, sans tracker",
                "Tous nos articles, sans script tiers.",
              ],
              ["Sauvegarde & alertes", "Mettez de côté, recevez les MAJ."],
              ["Accès au QCM RGE", "Devenez auditeur certifié à votre rythme."],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: "1px solid var(--paper-line)",
                }}
              >
                <Icon.check
                  style={{ width: 20, height: 20, color: "var(--signal)" }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{k}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--ink-3)",
                      marginTop: 2,
                    }}
                  >
                    {v}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
