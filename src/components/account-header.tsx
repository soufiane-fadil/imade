import Link from "next/link";
import { Icon, Placeholder } from "./atoms";

const TABS = [
  { id: "profile", label: "Tableau de bord", href: "/profil" },
  { id: "profile#tests", label: "Mes QCM", badge: "4", href: "/profil#tests" },
  {
    id: "profile#saved",
    label: "Lectures sauvegardées",
    badge: "12",
    href: "/profil#saved",
  },
  {
    id: "profile#comments",
    label: "Mes commentaires",
    badge: "7",
    href: "/profil#comments",
  },
  { id: "profile#billing", label: "Facturation", href: "/profil#billing" },
  { id: "profile#settings", label: "Paramètres", href: "/profil#settings" },
];

export function AccountHeader({ active }: { active?: string }) {
  const user = {
    name: "Mathieu Renaud",
    email: "m.renaud@exemple.fr",
    role: "Artisan RGE · Rennes (35)",
    initials: "MR",
    since: "janv. 2025",
  };
  return (
    <header className="bg-paper-2 border-b border-ink sticky top-0 z-[5]">
      <div className="mono flex flex-col md:flex-row md:justify-between md:items-center gap-1 md:gap-0 px-4 md:px-7 py-[6px] text-[10px] tracking-[0.08em] uppercase bg-ink text-paper border-b border-ink">
        <div className="flex gap-[14px] items-center flex-wrap">
          <span className="text-signal">◉ MON ESPACE</span>
          <span className="text-paper-line hidden md:inline">—</span>
          <span>SESSION OUVERTE · {user.name.toUpperCase()}</span>
        </div>
        <div className="flex gap-[14px] items-center flex-wrap">
          <span className="hidden md:inline">MEMBRE DEPUIS {user.since.toUpperCase()}</span>
          <span className="text-paper-line hidden md:inline">·</span>
          <Link
            href="/"
            className="lnk text-paper border-paper-line hidden md:inline"
          >
            ↗ Retour au journal
          </Link>
          <span className="text-paper-line hidden md:inline">·</span>
          <Link
            href="/"
            className="lnk text-signal border-signal"
          >
            Déconnexion
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[56px_1fr] md:grid-cols-[64px_1fr_auto] items-center px-4 md:px-7 py-[14px] gap-3 md:gap-4 border-b border-paper-line">
        <Placeholder
          caption={user.initials}
          style={{ width: 56, height: 56, border: "1px solid var(--ink)" }}
        />
        <div className="min-w-0">
          <Link href="/" className="no-underline text-ink">
            <span className="font-sans font-extrabold text-[18px] tracking-[-0.03em]">
              Maison<span className="text-signal">·</span>Calorie
            </span>
            <span className="mono text-[9px] tracking-[0.18em] text-ink-mute uppercase ml-[10px] hidden md:inline">
              / Espace membre
            </span>
          </Link>
          <div className="font-serif text-[20px] md:text-[26px] tracking-[-0.02em] mt-[2px] leading-[1.1]">
            Bonjour, <strong>{user.name}</strong>.
          </div>
          <div className="mono text-[10px] text-ink-mute tracking-[0.04em] mt-[2px] hidden md:block">
            {user.email} · {user.role}
          </div>
        </div>
        <div className="flex gap-2 col-span-2 md:col-span-1 mt-2 md:mt-0">
          <Link href="/qcm/code" className="btn btn--sm btn--ghost">
            <Icon.arrowR /> Saisir un code
          </Link>
          <Link href="/qcm" className="btn btn--sm btn--signal">
            Acheter un QCM
          </Link>
        </div>
      </div>

      <nav className="flex items-stretch px-4 md:px-7 border-b border-ink overflow-x-auto">
        <div className="mono text-[10px] text-ink-mute tracking-[0.1em] uppercase pr-4 border-r border-paper-line h-[38px] hidden md:flex items-center flex-shrink-0">
          MON ESPACE
        </div>
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <Link
              key={t.id}
              href={t.href}
              className={`mono px-[14px] h-[38px] flex items-center gap-2 text-[11px] tracking-[0.04em] uppercase border-r border-paper-line no-underline whitespace-nowrap ${
                isActive ? "text-paper bg-ink" : "text-ink bg-transparent"
              }`}
            >
              {t.label}
              {t.badge && (
                <span
                  className={`mono text-[9px] px-[5px] py-[1px] tracking-normal ${
                    isActive ? "bg-paper text-ink" : "bg-ink text-paper"
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </Link>
          );
        })}
        <div className="ml-auto hidden md:flex items-center gap-[6px] pl-4 flex-shrink-0">
          <span className="mono text-[9px] tracking-[0.08em] uppercase text-signal">
            ● 1 PASS NON UTILISÉ
          </span>
        </div>
      </nav>
    </header>
  );
}
