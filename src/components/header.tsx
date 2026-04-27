"use client";
import Link from "next/link";
import { CATEGORIES } from "@/lib/data";
import { Icon } from "./atoms";

export function Header({ active }: { active?: string }) {
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
        className="mono"
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
        style={{
          display: "grid",
          gridTemplateColumns: "160px 1fr 240px",
          alignItems: "center",
          padding: "14px 28px",
          borderBottom: "1px solid var(--paper-line)",
        }}
      >
        <div
          className="mono"
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
              fontSize: 28,
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
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Link href="/connexion" className="btn btn--sm btn--ghost">
            <Icon.user /> Espace pro
          </Link>
          <Link href="/qcm" className="btn btn--sm btn--signal">
            S&apos;INSCRIRE →
          </Link>
        </div>
      </div>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          padding: "0 28px",
          borderBottom: "1px solid var(--ink)",
        }}
      >
        <div
          className="mono"
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
              }}
            >
              {c.label}
            </Link>
          );
        })}
        <div
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
    </header>
  );
}
