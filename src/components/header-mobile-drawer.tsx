"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "./atoms";

type Category = { slug: string; name: string };

type Props = {
  categories: Category[];
  active?: string;
  siteName: string;
};

export function HeaderMobileDrawer({ categories, active, siteName }: Props) {
  const [open, setOpen] = React.useState(false);
  const siteNameParts = siteName.split("·");
  const renderSiteName = (key: string) =>
    siteNameParts.length > 1 ? (
      <>
        {siteNameParts[0]}
        <span className="text-signal">·</span>
        {siteNameParts.slice(1).join("·")}
      </>
    ) : (
      <span key={key}>{siteName}</span>
    );

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden btn btn--sm btn--ghost justify-self-end px-[10px] py-2 text-base leading-none"
      >
        {open ? "✕" : "☰"}
      </button>

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
            {renderSiteName("drawer")}
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
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/rubriques/${c.slug}`}
              onClick={() => setOpen(false)}
              className="mono flex items-center justify-between px-2.5 py-3 text-xs tracking-[0.04em] uppercase text-ink bg-transparent border-b border-paper-line no-underline transition-colors hover:bg-paper-2 data-[active=true]:bg-ink data-[active=true]:text-paper [&_svg]:opacity-40 data-[active=true]:[&_svg]:opacity-100"
              data-active={active === c.slug ? "true" : "false"}
            >
              {c.name}
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
        </div>
      </aside>
    </>
  );
}
