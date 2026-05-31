import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/article-card";
import { Tag, Icon } from "@/components/atoms";
import { CodeInput } from "./code-input";

export default function QCMGatePage() {
  const rules: [string, string][] = [
    ["30 questions", "Une seule bonne réponse par question parmi 4."],
    ["Navigation libre", "Vous pouvez revenir sur une question à tout moment."],
    [
      "Pas de chrono limite",
      "Mais un chronomètre s’affiche à titre indicatif.",
    ],
    [
      "Sauvegarde auto",
      "Vos réponses sont enregistrées. Une déconnexion ne fait pas perdre votre progression.",
    ],
    ["Score requis", "21 / 30 (70 %) pour valider la certification."],
    [
      "Une seule session",
      "Le code expire après soumission, qu’elle soit réussie ou non.",
    ],
  ];
  return (
    <div className="mc-root w-full max-w-[1280px] mx-auto min-h-[1000px]">
      <Header />
      <section className="px-4 pt-5 md:px-7">
        <Breadcrumbs
          trail={[
            { label: "Accueil", href: "/" },
            { label: "QCM RGE", href: "/qcm" },
            "Saisir un code",
          ]}
        />
      </section>
      <section className="gridpaper px-4 py-10 md:px-7 md:py-14 border-b border-ink grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 md:min-h-[720px]">
        <div className="self-center max-w-[480px]">
          <Tag kind="signal">VÉRIFICATION D’ACCÈS</Tag>
          <h1 className="h-display text-4xl md:text-5xl lg:text-[64px] mt-3.5">
            Saisissez
            <br />
            votre code.
          </h1>
          <p className="text-[16px] text-ink-3 mt-3.5 leading-[1.5]">
            Vous avez reçu par e-mail un code unique de 16 caractères au moment
            de l’achat de votre pass. Ce code donne accès à{" "}
            <strong>une seule</strong> session de QCM.
          </p>
          <div className="tick-frame p-4 md:p-[18px] mt-5 bg-paper">
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <div className="text-[14px] font-semibold text-ink">
              Saisissez votre code d’accès
            </div>
            <div className="text-[12px] text-ink-3 mt-1 leading-[1.45]">
              16 caractères répartis en 4 groupes de 4. Reçu par e-mail au
              moment de l’achat.
            </div>
            <CodeInput />
            <div className="text-[12px] text-ink-mute mt-2.5 italic">
              Exemple :{" "}
              <span className="mono not-italic">QCM — 7H4K — 9P2X — A1B6</span>.
              Lettres et chiffres uniquement.
            </div>
          </div>
          <Link
            href="/qcm/test"
            className="btn btn--signal mt-4 w-full justify-center"
          >
            Démarrer le QCM <Icon.arrowR />
          </Link>
          <div className="mt-3.5 flex justify-between">
            <a
              href="#"
              className="lnk mono text-[11px] tracking-[0.04em] uppercase"
            >
              Code introuvable ?
            </a>
            <Link
              href="/qcm"
              className="lnk mono text-[11px] tracking-[0.04em] uppercase"
            >
              Acheter un pass →
            </Link>
          </div>
        </div>
        <div className="self-center">
          <div className="tick-frame p-6 bg-paper">
            <span className="tick-bl"></span>
            <span className="tick-br"></span>
            <div className="mono text-[10px] tracking-[0.16em] uppercase text-signal">
              ◉ AVANT DE COMMENCER
            </div>
            <h2 className="h-title text-[26px] mt-2">
              Lisez les règles du jeu.
            </h2>
            <ul className="list-none p-0 mt-5">
              {rules.map(([k, v]) => (
                <li
                  key={k}
                  className="grid grid-cols-[20px_1fr] gap-3 py-3 border-b border-paper-line"
                >
                  <Icon.check className="w-[18px] h-[18px] text-leaf" />
                  <div>
                    <div className="text-[14px] font-semibold">{k}</div>
                    <div className="text-[12px] text-ink-3 mt-0.5">{v}</div>
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
