import Link from "next/link";
import { CATEGORIES } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-double border-ink mt-12 bg-paper">
      <div className="px-7 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr] gap-7 border-b border-paper-line">
        <div>
          <div className="font-sans font-extrabold text-[22px] tracking-[-0.04em]">
            Maison<span className="text-signal">·</span>Calorie
          </div>
          <div className="mono text-[10px] tracking-[0.16em] text-ink-mute uppercase mt-1">
            Édition n° 04 / 27 — Paris
          </div>
          <p className="text-xs text-ink-3 mt-4 leading-[1.5] max-w-[280px]">
            Le journal indépendant de la rénovation énergétique en France.
            Articles, dossiers et certification professionnelle pour bâtir
            mieux, chauffer moins.
          </p>
        </div>
        <div>
          <div className="h-section">Rubriques</div>
          <ul className="list-none p-0 mt-3 mb-0 text-xs leading-[2]">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/rubriques/${c.slug}`}
                  className="lnk border-b-0"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="h-section">Le QCM</div>
          <ul className="list-none p-0 mt-3 mb-0 text-xs leading-[2]">
            <li>
              <Link href="/qcm" className="lnk border-b-0">
                Présentation
              </Link>
            </li>
            <li>
              <Link href="/qcm" className="lnk border-b-0">
                Tarifs &amp; passes
              </Link>
            </li>
            <li>
              <Link href="/qcm/code" className="lnk border-b-0">
                Saisir un code
              </Link>
            </li>
            <li>
              <Link href="/qcm" className="lnk border-b-0">
                Méthodologie
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="h-section">Maison</div>
          <ul className="list-none p-0 mt-3 mb-0 text-xs leading-[2]">
            <li>
              <Link href="/" className="lnk border-b-0">
                À propos
              </Link>
            </li>
            <li>
              <Link href="/contact" className="lnk border-b-0">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/" className="lnk border-b-0">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/" className="lnk border-b-0">
                Politique RGPD
              </Link>
            </li>
            <li>
              <Link href="/" className="lnk border-b-0">
                Charte éditoriale
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="h-section">Suivre</div>
          <div className="flex flex-col gap-1.5 mt-3">
            {[
              ["LinkedIn", "/in/maison-calorie"],
              ["Twitter / X", "@maisoncalorie"],
              ["YouTube", "/c/maisoncalorie"],
              ["RSS", "/feed.xml"],
              ["Mastodon", "@mc@piaille.fr"],
            ].map(([k, v]) => (
              <a
                key={k}
                href="#"
                className="mono text-[11px] flex justify-between no-underline text-ink border-b border-dashed border-paper-line py-1"
              >
                <span className="tracking-[0.04em] uppercase">{k}</span>
                <span className="text-ink-mute">{v}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mono px-7 py-3 text-[10px] tracking-[0.08em] uppercase text-ink-mute flex flex-col gap-2 md:flex-row md:justify-between md:gap-0">
        <span>
          © 2026 SAS Maison Calorie · RCS Paris 912 448 211 · TVA FR 87 912 448
          211
        </span>
        <span>v 4.27.0 — Build #1042</span>
      </div>
    </footer>
  );
}

export function NewsletterBlock({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`border border-ink bg-paper-2 relative ${
        compact ? "p-[18px]" : "p-7"
      }`}
    >
      <div className="mono text-[10px] tracking-[0.16em] uppercase text-signal">
        ◉ Bulletin hebdomadaire
      </div>
      <div
        className={`h-title mt-1.5 max-w-[520px] ${
          compact ? "text-[22px]" : "text-3xl"
        }`}
      >
        L’essentiel de la rénovation énergétique, chaque jeudi à 7 h.
      </div>
      <p className="text-[13px] text-ink-3 mt-2 max-w-[540px] leading-[1.5]">
        14 200 abonnés — actualité MaPrimeRénov’, fiches techniques, baromètre
        RGE, et les enquêtes qui n’ont pas eu leur place dans le journal.
      </p>
      <div className="flex flex-col md:flex-row gap-0 mt-3.5 max-w-[540px]">
        <input
          className="field mono md:border-r-0"
          placeholder="prénom.nom@exemple.fr"
        />
        <button className="btn btn--signal">S’abonner →</button>
      </div>
      <div className="mono text-[9px] tracking-[0.08em] uppercase text-ink-mute mt-2.5">
        Sans spam · Désinscription en 1 clic · Hébergé en France
      </div>
    </div>
  );
}
