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
    <header
      style={{
        background: "var(--paper-2)",
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
          alignItems: "center",
          padding: "6px 28px",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          background: "var(--ink)",
          color: "var(--paper)",
          borderBottom: "1px solid var(--ink)",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ color: "var(--signal)" }}>◉ MON ESPACE</span>
          <span style={{ color: "var(--paper-line)" }}>—</span>
          <span>SESSION OUVERTE · {user.name.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span>MEMBRE DEPUIS {user.since.toUpperCase()}</span>
          <span style={{ color: "var(--paper-line)" }}>·</span>
          <Link
            href="/"
            className="lnk"
            style={{ color: "var(--paper)", borderColor: "var(--paper-line)" }}
          >
            ↗ Retour au journal
          </Link>
          <span style={{ color: "var(--paper-line)" }}>·</span>
          <Link
            href="/"
            className="lnk"
            style={{ color: "var(--signal)", borderColor: "var(--signal)" }}
          >
            Déconnexion
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "64px 1fr auto",
          alignItems: "center",
          padding: "14px 28px",
          gap: 16,
          borderBottom: "1px solid var(--paper-line)",
        }}
      >
        <Placeholder
          caption={user.initials}
          style={{ width: 56, height: 56, border: "1px solid var(--ink)" }}
        />
        <div>
          <Link
            href="/"
            style={{ textDecoration: "none", color: "var(--ink)" }}
          >
            <span
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: "-0.03em",
              }}
            >
              Maison<span style={{ color: "var(--signal)" }}>·</span>Calorie
            </span>
            <span
              className="mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                color: "var(--ink-mute)",
                textTransform: "uppercase",
                marginLeft: 10,
              }}
            >
              / Espace membre
            </span>
          </Link>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 26,
              letterSpacing: "-0.02em",
              marginTop: 2,
              lineHeight: 1.1,
            }}
          >
            Bonjour, <strong>{user.name}</strong>.
          </div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--ink-mute)",
              letterSpacing: "0.04em",
              marginTop: 2,
            }}
          >
            {user.email} · {user.role}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/qcm/code" className="btn btn--sm btn--ghost">
            <Icon.arrowR /> Saisir un code
          </Link>
          <Link href="/qcm" className="btn btn--sm btn--signal">
            Acheter un QCM
          </Link>
        </div>
      </div>

      <nav
        style={{
          display: "flex",
          alignItems: "stretch",
          padding: "0 28px",
          borderBottom: "1px solid var(--ink)",
          overflowX: "auto",
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
            height: 38,
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          MON ESPACE
        </div>
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <Link
              key={t.id}
              href={t.href}
              className="mono"
              style={{
                padding: "0 14px",
                height: 38,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: isActive ? "var(--paper)" : "var(--ink)",
                background: isActive ? "var(--ink)" : "transparent",
                borderRight: "1px solid var(--paper-line)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
              {t.badge && (
                <span
                  className="mono"
                  style={{
                    fontSize: 9,
                    padding: "1px 5px",
                    background: isActive ? "var(--paper)" : "var(--ink)",
                    color: isActive ? "var(--ink)" : "var(--paper)",
                    letterSpacing: 0,
                  }}
                >
                  {t.badge}
                </span>
              )}
            </Link>
          );
        })}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            paddingLeft: 16,
            flexShrink: 0,
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--signal)",
            }}
          >
            ● 1 PASS NON UTILISÉ
          </span>
        </div>
      </nav>
    </header>
  );
}
