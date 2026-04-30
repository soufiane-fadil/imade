import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/article-card";
import { Tag } from "@/components/atoms";

export default function ContactPage() {
  const reasons: { v: string; label: string; desc: string }[] = [
    {
      v: "q",
      label: "Une question sur un article",
      desc: "Précision, source, complément",
    },
    { v: "e", label: "Signaler une erreur", desc: "Donnée fausse ou obsolète" },
    {
      v: "qcm",
      label: "Une question sur un QCM",
      desc: "Code, paiement, certification",
    },
    {
      v: "a",
      label: "Autre demande",
      desc: "Presse, partenariat, idée de sujet",
    },
  ];
  const coords: [string, string][] = [
    ["Rédaction", "redac@maison-calorie.fr"],
    ["Presse", "presse@maison-calorie.fr"],
    ["QCM & certifications", "qcm@maison-calorie.fr"],
    ["Adresse postale", "11 rue de la Forge — 75011 Paris"],
    ["Téléphone (lun-ven 9h-18h)", "+33 (0)1 84 60 14 20"],
  ];
  return (
    <div className="mc-root w-full max-w-[1280px] mx-auto">
      <Header />
      <section className="px-4 md:px-7 pt-5">
        <Breadcrumbs trail={["Accueil", "Contact"]} />
      </section>
      <section className="px-4 md:px-7 py-6 border-b border-ink">
        <Tag kind="signal">Bureau éditorial</Tag>
        <h1 className="h-display text-4xl md:text-5xl lg:text-[64px] mt-2">
          Écrivez-nous.
        </h1>
        <p className="text-base text-ink-3 mt-2.5 max-w-[620px] leading-[1.5]">
          Une question, un sujet d’enquête, une erreur à signaler ? L’équipe lit
          tout — nous répondons sous 48 h en jours ouvrés.
        </p>
      </section>
      <section className="px-4 md:px-7 py-8 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 border-b border-ink">
        <div className="border border-ink bg-paper max-w-full md:max-w-[640px]">
          <div className="px-4 md:px-[22px] py-3.5 border-b border-ink bg-paper-2 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <div className="mono text-[10px] tracking-[0.12em] uppercase text-signal">
                ◉ FORMULAIRE DE CONTACT
              </div>
              <div className="font-serif text-lg md:text-[22px] mt-0.5 tracking-tight">
                Remplissez les champs ci-dessous.
              </div>
            </div>
            <span className="mono text-[11px] text-ink-mute tracking-[0.04em]">
              Étape 1 / 1
            </span>
          </div>

          <form className="grid gap-5 px-4 md:px-[22px] py-6">
            <div className="grid grid-cols-[24px_1fr] gap-2.5 px-3 py-2.5 bg-paper-2 border border-dashed border-paper-line">
              <span className="font-serif text-lg text-signal text-center leading-none">
                ⓘ
              </span>
              <div className="text-[13px] text-ink-3 leading-[1.45]">
                Les champs marqués d’une étoile{" "}
                <span className="text-signal">*</span> sont obligatoires. Nous
                vous répondrons à l’adresse e-mail indiquée, sous 48 h en jours
                ouvrés.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="ct-name"
                  className="block text-sm font-semibold text-ink mb-1.5"
                >
                  Votre nom complet <span className="text-signal">*</span>
                </label>
                <input
                  id="ct-name"
                  className="field text-[15px] px-3.5 py-3 h-auto"
                  defaultValue="Mathieu Renaud"
                />
                <div className="text-xs text-ink-mute mt-1 italic">
                  Prénom et nom, comme vous souhaitez être appelé.
                </div>
              </div>
              <div>
                <label
                  htmlFor="ct-email"
                  className="block text-sm font-semibold text-ink mb-1.5"
                >
                  Votre adresse e-mail <span className="text-signal">*</span>
                </label>
                <input
                  id="ct-email"
                  type="email"
                  className="field text-[15px] px-3.5 py-3 h-auto"
                  defaultValue="m.renaud@exemple.fr"
                />
                <div className="text-xs text-ink-mute mt-1 italic">
                  C’est ici que nous enverrons notre réponse.
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Motif de votre message <span className="text-signal">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {reasons.map((o, i) => (
                  <label
                    key={o.v}
                    className={
                      "grid grid-cols-[20px_1fr] gap-2.5 px-3.5 py-3 cursor-pointer items-start border " +
                      (i === 0
                        ? "border-ink bg-paper-2"
                        : "border-paper-line bg-paper")
                    }
                  >
                    <input
                      type="radio"
                      name="reason"
                      defaultChecked={i === 0}
                      className="mt-[3px]"
                    />
                    <div>
                      <div className="text-sm font-semibold text-ink">
                        {o.label}
                      </div>
                      <div className="text-xs text-ink-3 mt-0.5">{o.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="ct-subject"
                className="block text-sm font-semibold text-ink mb-1.5"
              >
                Sujet du message <span className="text-signal">*</span>
              </label>
              <input
                id="ct-subject"
                className="field text-[15px] px-3.5 py-3 h-auto"
                defaultValue="Question sur le décret PAC du 14 avril"
              />
              <div className="text-xs text-ink-mute mt-1 italic">
                En une phrase courte. Ex. : « Précision sur le COP des PAC en
                2026 ».
              </div>
            </div>

            <div>
              <label
                htmlFor="ct-msg"
                className="block text-sm font-semibold text-ink mb-1.5"
              >
                Votre message <span className="text-signal">*</span>
              </label>
              <textarea
                id="ct-msg"
                className="field font-sans text-[15px] leading-[1.55] px-3.5 py-3 resize-y h-auto"
                rows={9}
                defaultValue={
                  "Bonjour,\n\nJ’ai lu votre article sur les pompes à chaleur air-eau du 24 avril, et je voulais obtenir une précision concernant…\n\nMerci par avance,\nMathieu"
                }
              />
              <div className="flex flex-col md:flex-row md:justify-between mt-1 gap-1">
                <span className="text-xs text-ink-mute italic">
                  Soyez aussi précis que possible — citez l’article si besoin.
                </span>
                <span className="mono text-[11px] text-ink-mute">
                  148 / 4 000
                </span>
              </div>
            </div>

            <label className="grid grid-cols-[20px_1fr] gap-2.5 px-3.5 py-3 bg-paper-2 border border-paper-line cursor-pointer items-start">
              <input
                type="checkbox"
                defaultChecked
                className="mt-[3px]"
              />
              <div className="text-[13px] text-ink-2 leading-[1.45]">
                <strong>
                  J’accepte que mes données soient utilisées pour traiter ma
                  demande.
                </strong>{" "}
                Elles ne seront ni revendues ni utilisées à d’autres fins,
                conformément à notre{" "}
                <a href="#" className="lnk">
                  politique de confidentialité
                </a>
                .
              </div>
            </label>

            <div className="flex flex-wrap gap-3 items-center border-t border-paper-line pt-4">
              <button
                className="btn btn--primary text-base px-6 py-3.5 h-auto"
                type="button"
              >
                ✉ Envoyer mon message
              </button>
              <button className="btn btn--ghost" type="button">
                Annuler
              </button>
              <span className="text-xs text-ink-mute md:ml-auto italic">
                Réponse sous 48 h en jours ouvrés.
              </span>
            </div>
          </form>
        </div>
        <aside>
          <div className="tick-frame p-[18px]">
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <div className="h-section">—— Coordonnées</div>
            <div className="mt-3 grid gap-3.5">
              {coords.map(([k, v]) => (
                <div
                  key={k}
                  className="border-b border-dashed border-paper-line pb-2.5"
                >
                  <div className="lbl">{k}</div>
                  <div className="mono text-[13px] text-ink mt-0.5">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mono text-[10px] tracking-[0.06em] uppercase text-ink-mute mt-4 p-3.5 border border-dashed border-paper-line">
            ⓘ Pour signaler une erreur factuelle dans un article : utilisez le
            lien « signaler » sous le commentaire concerné — c’est plus rapide.
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  );
}
