"use client";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/data";
import { Icon } from "./atoms";

export function Header({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        background: "var(--paper)",
        borderBottom: "1px solid var(--ink)",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
    >
      <div
        className="mono mc-header-meta"
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--paper-line)",
          padding: "6px 28px",
          fontSize: 10,
          color: "var(--ink-mute)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          <span>FR · Édition Métropole</span>
          <span>·</span>
          <span>N° 0427 — 27 avril 2026</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <span>
            Indice MaPrimeRénov’{" "}
            <strong style={{ color: "var(--ink)" }}>+2,4 %</strong>
          </span>
          <span>·</span>
          <Link href="/contact" className="lnk" style={{ borderBottom: 0 }}>
            Contact
          </Link>
        </div>
      </div>

      <div
        className="mc-header-brand"
        style={{
          display: "grid",
          gridTemplateColumns: "160px 1fr 240px",
          alignItems: "center",
          padding: "14px 28px",
          borderBottom: "1px solid var(--paper-line)",
        }}
      >
        <div
          className="mono mc-header-dossier"
          style={{
            fontSize: 10,
            color: "var(--ink-mute)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          DOSSIER N° <span style={{ color: "var(--ink)" }}>04 / 27</span>
        </div>
        <Link
          href="/"
          style={{
            textAlign: "center",
            textDecoration: "none",
            color: "var(--ink)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 800,
              fontSize: "clamp(20px, 6vw, 28px)",
              letterSpacing: "-0.04em",
            }}
          >
            Maison<span style={{ color: "var(--signal)" }}>·</span>Calorie
          </div>
          <div
            className="mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.24em",
              color: "var(--ink-mute)",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            Le journal de la rénovation énergétique
          </div>
        </Link>
        <div
          className="mc-header-actions"
          style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
        >
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
          className="mc-header-burger btn btn--sm btn--ghost"
          style={{
            justifySelf: "end",
            padding: "8px 10px",
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <nav
        className="mc-header-nav"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          padding: "0 28px",
          borderBottom: "1px solid var(--ink)",
        }}
      >
        <div
          className="mono mc-header-nav-label"
          style={{
            fontSize: 10,
            color: "var(--ink-mute)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            paddingRight: 16,
            borderRight: "1px solid var(--paper-line)",
            height: 36,
            display: "flex",
            alignItems: "center",
          }}
        >
          RUBRIQUES
        </div>
        {CATEGORIES.map((c) => {
          const isActive = active === c.slug;
          return (
            <Link
              key={c.slug}
              href={`/rubriques/${c.slug}`}
              className="mono"
              style={{
                padding: "0 14px",
                height: 36,
                display: "flex",
                alignItems: "center",
                fontSize: 11,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: isActive ? "var(--paper)" : "var(--ink)",
                background: isActive ? "var(--ink)" : "transparent",
                borderRight: "1px solid var(--paper-line)",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {c.label}
            </Link>
          );
        })}
        <div
          className="mc-header-search"
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingLeft: 16,
          }}
        >
          <Icon.search />
          <input
            className="mono"
            placeholder="Rechercher un dossier…"
            style={{
              border: 0,
              background: "transparent",
              fontSize: 11,
              color: "var(--ink)",
              width: 180,
              outline: "none",
              padding: 0,
            }}
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
        <div className="mc-drawer-head">
          <span
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.04em",
            }}
          >
            Maison<span style={{ color: "var(--signal)" }}>·</span>Calorie
          </span>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="btn btn--sm btn--ghost"
            style={{ padding: "6px 10px", fontSize: 14, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <div className="mc-drawer-body">
          <div
            className="mono mc-drawer-section"
            style={{
              fontSize: 10,
              color: "var(--ink-mute)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "4px 0 6px",
            }}
          >
            Rubriques
          </div>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/rubriques/${c.slug}`}
              onClick={() => setOpen(false)}
              className="mono mc-drawer-link"
              data-active={active === c.slug ? "true" : "false"}
            >
              {c.label}
              <Icon.arrowR />
            </Link>
          ))}

          <div
            className="mono mc-drawer-section"
            style={{
              fontSize: 10,
              color: "var(--ink-mute)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "18px 0 6px",
            }}
          >
            Espace pro
          </div>
          <Link
            href="/connexion"
            onClick={() => setOpen(false)}
            className="btn btn--ghost"
            style={{
              justifyContent: "flex-start",
              width: "100%",
              marginBottom: 8,
            }}
          >
            <Icon.user /> Connexion
          </Link>
          <Link
            href="/qcm"
            onClick={() => setOpen(false)}
            className="btn btn--signal"
            style={{ justifyContent: "flex-start", width: "100%" }}
          >
            S&apos;INSCRIRE →
          </Link>

          <div
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--ink-mute)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: 24,
              paddingTop: 14,
              borderTop: "1px solid var(--paper-line)",
            }}
          >
            FR · Édition Métropole
            <br />
            N° 0427 — 27 avril 2026
          </div>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="lnk mono"
            style={{
              fontSize: 11,
              marginTop: 10,
              display: "inline-block",
            }}
          >
            Contact →
          </Link>
        </div>
      </aside>
    </header>
  );
}
