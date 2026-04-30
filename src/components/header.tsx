"use client";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/data";
import { Icon } from "./atoms";

export function Header({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-paper border-b border-ink sticky top-0 z-[5]">
      <div className="mono hidden md:flex justify-between border-b border-paper-line px-7 py-[6px] text-[10px] text-ink-mute tracking-[0.06em] uppercase">
        <div className="flex gap-4">
          <span>FR · Édition Métropole</span>
          <span>·</span>
          <span>N° 0427 — 27 avril 2026</span>
        </div>
        <div className="flex gap-4">
          <span>
            Indice MaPrimeRénov’{" "}
            <strong className="text-ink">+2,4 %</strong>
          </span>
          <span>·</span>
          <Link href="/contact" className="lnk border-b-0">
            Contact
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[160px_1fr_240px] items-center px-7 py-[14px] border-b border-paper-line">
        <div className="mono hidden md:block text-[10px] text-ink-mute tracking-[0.08em] uppercase">
          DOSSIER N° <span className="text-ink">04 / 27</span>
        </div>
        <Link href="/" className="text-center no-underline text-ink">
          <div className="font-sans font-extrabold text-[clamp(20px,6vw,28px)] tracking-[-0.04em]">
            Maison<span className="text-signal">·</span>Calorie
          </div>
          <div className="mono text-[9px] tracking-[0.24em] text-ink-mute uppercase mt-[2px]">
            Le journal de la rénovation énergétique
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
        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden btn btn--sm btn--ghost justify-self-end px-[10px] py-2 text-base leading-none"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <nav className="hidden md:flex items-center gap-0 px-7 border-b border-ink">
        <div className="mono text-[10px] text-ink-mute tracking-[0.1em] uppercase pr-4 border-r border-paper-line h-9 flex items-center">
          RUBRIQUES
        </div>
        {CATEGORIES.map((c) => {
          const isActive = active === c.slug;
          return (
            <Link
              key={c.slug}
              href={`/rubriques/${c.slug}`}
              className={`mono px-[14px] h-9 flex items-center text-[11px] tracking-[0.04em] uppercase border-r border-paper-line no-underline whitespace-nowrap shrink-0 ${
                isActive ? "text-paper bg-ink" : "text-ink bg-transparent"
              }`}
            >
              {c.label}
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

      <div
        className="mc-drawer-backdrop"
        data-open={open ? "true" : "false"}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <aside
        className="mc-drawer"
        data-open={open ? "true" : "false"}
        aria-hidden={!open}
        aria-label="Menu mobile"
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-ink bg-paper shrink-0">
          <span className="font-sans font-extrabold text-xl tracking-[-0.04em]">
            Maison<span className="text-signal">·</span>Calorie
          </span>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="btn btn--sm btn--ghost px-[10px] py-[6px] text-sm leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-0.5 px-4 pt-4 pb-6 overflow-y-auto flex-1">
          <div className="mono text-[10px] text-ink-mute tracking-[0.1em] uppercase mt-1 mb-[6px]">
            Rubriques
          </div>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/rubriques/${c.slug}`}
              onClick={() => setOpen(false)}
              className="mono flex items-center justify-between px-2.5 py-3 text-xs tracking-[0.04em] uppercase text-ink bg-transparent border-b border-paper-line no-underline transition-colors hover:bg-paper-2 data-[active=true]:bg-ink data-[active=true]:text-paper [&_svg]:opacity-40 data-[active=true]:[&_svg]:opacity-100"
              data-active={active === c.slug ? "true" : "false"}
            >
              {c.label}
              <Icon.arrowR />
            </Link>
          ))}

          <div className="mono text-[10px] text-ink-mute tracking-[0.1em] uppercase mt-[18px] mb-[6px]">
            Espace pro
          </div>
          <Link
            href="/connexion"
            onClick={() => setOpen(false)}
            className="btn btn--ghost justify-start w-full mb-2"
          >
            <Icon.user /> Connexion
          </Link>
          <Link
            href="/qcm"
            onClick={() => setOpen(false)}
            className="btn btn--signal justify-start w-full"
          >
            S&apos;INSCRIRE →
          </Link>

          <div className="mono text-[10px] text-ink-mute tracking-[0.08em] uppercase mt-6 pt-[14px] border-t border-paper-line">
            FR · Édition Métropole
            <br />
            N° 0427 — 27 avril 2026
          </div>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="lnk mono text-[11px] mt-[10px] inline-block"
          >
            Contact →
          </Link>
        </div>
      </aside>
    </header>
  );
}
