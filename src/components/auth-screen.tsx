import Link from "next/link";
import { Header } from "./header";
import { Footer } from "./footer";
import { Tag, Icon } from "./atoms";

export function AuthScreen({ mode }: { mode: "signin" | "signup" }) {
  const isSignup = mode === "signup";
  return (
    <div className="mc-root w-full max-w-[1280px] min-h-[900px] grid grid-rows-[auto_1fr_auto]">
      <Header />
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center p-6 md:p-12 lg:p-16 md:border-r md:border-ink">
          <Tag kind="signal">{isSignup ? "Créer un compte" : "Connexion"}</Tag>
          <h1 className="h-display text-4xl md:text-5xl lg:text-[56px] mt-[14px]">
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
          <p className="text-[15px] text-ink-3 mt-3 max-w-[420px] leading-[1.5]">
            {isSignup
              ? "Créez votre compte pour commenter les articles, sauvegarder vos lectures et passer le QCM RGE."
              : "Accédez à vos lectures sauvegardées, vos commentaires et votre historique de tests QCM."}
          </p>
          <form className="mt-7 grid gap-[14px] max-w-[420px]">
            {isSignup && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                <div>
                  <label className="lbl">Prénom</label>
                  <input
                    className="field mt-[6px]"
                    defaultValue="Mathieu"
                  />
                </div>
                <div>
                  <label className="lbl">Nom</label>
                  <input
                    className="field mt-[6px]"
                    defaultValue="Renaud"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="lbl">Adresse e-mail</label>
              <input
                className="field mt-[6px]"
                type="email"
                defaultValue="m.renaud@exemple.fr"
              />
            </div>
            <div>
              <label className="lbl">Mot de passe</label>
              <input
                className="field mt-[6px]"
                type="password"
                defaultValue="••••••••••"
              />
            </div>
            {isSignup && (
              <label className="mono text-[11px] flex gap-2 items-start text-ink-3 tracking-[0.02em]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-[2px]"
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
              className="btn btn--primary mt-1"
            >
              {isSignup ? "Créer mon compte" : "Se connecter"} <Icon.arrowR />
            </Link>
            <div className="cap-rule my-[14px]">
              <span>OU</span>
            </div>
            <button type="button" className="btn btn--ghost">
              Continuer avec Kinde · SSO →
            </button>
            <div className="mono text-[11px] text-ink-mute tracking-[0.04em] uppercase text-center mt-[6px]">
              {isSignup ? (
                <>
                  Déjà inscrit ?{" "}
                  <Link href="/connexion" className="lnk text-ink">
                    Se connecter →
                  </Link>
                </>
              ) : (
                <>
                  Pas encore de compte ?{" "}
                  <Link href="/inscription" className="lnk text-ink">
                    S’inscrire →
                  </Link>
                </>
              )}
            </div>
          </form>
        </div>
        <div className="gridpaper bg-paper-2 flex flex-col justify-center p-6 md:p-12 lg:p-16">
          <div className="mono text-[10px] tracking-[0.16em] uppercase text-signal">
            ◉ MEMBRES — CE MOIS
          </div>
          <div className="h-display text-5xl md:text-7xl lg:text-8xl mt-2">
            14 220
          </div>
          <div className="mono text-[11px] text-ink-mute tracking-[0.04em] uppercase">
            lecteurs inscrits, dont 1 200 pros certifiés RGE
          </div>
          <div className="mt-9 grid gap-[14px]">
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
                className="grid grid-cols-[32px_1fr] gap-3 py-3 border-b border-paper-line"
              >
                <Icon.check className="w-5 h-5 text-signal" />
                <div>
                  <div className="text-sm font-semibold">{k}</div>
                  <div className="text-xs text-ink-3 mt-[2px]">{v}</div>
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
