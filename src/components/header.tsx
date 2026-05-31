import Link from "next/link";
import { CategoriesRepo } from "@/lib/db/repositories/categories";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { Icon } from "./atoms";
import { HeaderMobileDrawer } from "./header-mobile-drawer";

function renderSiteName() {
  const parts = SITE_NAME.split("·");
  if (parts.length <= 1) return SITE_NAME;
  return (
    <>
      {parts[0]}
      <span className="text-signal">·</span>
      {parts.slice(1).join("·")}
    </>
  );
}

export async function Header({ active }: { active?: string }) {
  const rubriques = await CategoriesRepo.listNav();

  return (
    <header className="bg-paper border-b border-ink sticky top-0 z-[5]">
      <div className="mono hidden md:flex justify-between border-b border-paper-line px-7 py-[6px] text-[10px] text-ink-mute tracking-[0.06em] uppercase">
        <div className="flex gap-4">
          <span>FR · Édition Métropole</span>
        </div>
        <div className="flex gap-4">
          <Link href="/contact" className="lnk border-b-0">
            Contact
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[160px_1fr_240px] items-center px-7 py-[14px] border-b border-paper-line">
        <div className="mono hidden md:block text-[10px] text-ink-mute tracking-[0.08em] uppercase" />
        <Link href="/" className="text-center no-underline text-ink">
          <div className="font-sans font-extrabold text-[clamp(20px,6vw,28px)] tracking-[-0.04em]">
            {renderSiteName()}
          </div>
          <div className="mono text-[9px] tracking-[0.24em] text-ink-mute uppercase mt-[2px]">
            {SITE_TAGLINE}
          </div>
        </Link>
        <div className="hidden md:flex justify-end gap-2">
          <Link href="/connexion" className="btn btn--sm btn--ghost">
            <Icon.user /> Espace pro
          </Link>
          <Link href="/qcm" className="btn btn--sm btn--signal">
            S&apos;INSCRIRE →
          </Link>
        </div>
        <HeaderMobileDrawer
          categories={rubriques}
          active={active}
          siteName={SITE_NAME}
        />
      </div>

      <nav className="hidden md:flex items-center gap-0 px-7 border-b border-ink">
        <div className="mono text-[10px] text-ink-mute tracking-[0.1em] uppercase pr-4 border-r border-paper-line h-9 flex items-center">
          RUBRIQUES
        </div>
        {rubriques.map((c) => {
          const isActive = active === c.slug;
          return (
            <Link
              key={c.slug}
              href={`/rubriques/${c.slug}`}
              className={`mono px-[14px] h-9 flex items-center text-[11px] tracking-[0.04em] uppercase border-r border-paper-line no-underline whitespace-nowrap shrink-0 ${
                isActive ? "text-paper bg-ink" : "text-ink bg-transparent"
              }`}
            >
              {c.name}
            </Link>
          );
        })}
        <div className="ml-auto flex items-center gap-2 pl-4">
          <Icon.search />
          <input
            className="mono border-0 bg-transparent text-[11px] text-ink w-[180px] outline-none p-0"
            placeholder="Rechercher un dossier…"
          />
        </div>
      </nav>
    </header>
  );
}
