import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer, NewsletterBlock } from '@/components/footer';
import { Icon, Placeholder, Tag } from '@/components/atoms';
import { ArticleCard, ArticleMeta } from '@/components/article-card';
import { CATEGORIES, SAMPLE_ARTICLES } from '@/lib/data';

const TESTIMONIALS = [
  { who: 'Hélène D.', role: 'Propriétaire, Nantes', quote: 'Avant Maison Calorie, je signais des devis sans rien comprendre. Aujourd’hui je sais lire un DPE et négocier.' },
  { who: 'Mathieu R.', role: 'Artisan RGE, Rennes', quote: 'Le QCM m’a permis de monter en compétence sur les pompes à chaleur — bien plus utile qu’une formation sur PowerPoint.' },
  { who: 'Sarah K.', role: 'Copropriété, Lyon', quote: 'Le dossier sur la VMC double flux nous a évité 8 000 € d’erreur. Les fiches PDF sont une mine.' },
];

const CAT_ICONS = [
  { c: CATEGORIES[0], n: 124, ic: <Icon.wall /> },
  { c: CATEGORIES[1], n: 87, ic: <Icon.pump /> },
  { c: CATEGORIES[2], n: 56, ic: <Icon.sun /> },
  { c: CATEGORIES[3], n: 41, ic: <Icon.vent /> },
  { c: CATEGORIES[4], n: 33, ic: <Icon.house /> },
  { c: CATEGORIES[5], n: 72, ic: <Icon.doc /> },
  { c: CATEGORIES[6], n: 64, ic: <Icon.bookmark /> },
  { c: CATEGORIES[7], n: 218, ic: <Icon.clock /> },
];

export default function HomePage() {
  const a = SAMPLE_ARTICLES;
  return (
    <div className="mc-root">
      <Header />

      <section style={{ padding: '32px 28px 24px', borderBottom: '1px solid var(--ink)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32, alignItems: 'stretch' }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--signal)', marginBottom: 12 }}>
              ◉ À la une — n° {a[0].id}
            </div>
            <h1 className="h-display" style={{ fontSize: 64, margin: 0, maxWidth: 720 }}>{a[0].title}</h1>
            <p style={{ fontSize: 18, color: 'var(--ink-3)', marginTop: 14, maxWidth: 620, lineHeight: 1.4 }}>{a[0].dek}</p>
            <div style={{ marginTop: 18 }}>
              <ArticleMeta author={a[0].author} role="Journaliste senior" published={a[0].date} updated="ce matin" readMin={a[0].read} category={a[0].cat} />
            </div>
            <Link href={`/article/${a[0].id}`} className="btn btn--primary" style={{ marginTop: 22 }}>
              Lire l’enquête <Icon.arrowR />
            </Link>
          </div>
          <div className="tick-frame" style={{ position: 'relative', minHeight: 360 }}>
            <span className="tick-bl"></span><span className="tick-br"></span>
            <Placeholder caption="reportage · pompe à chaleur en cours d’installation" style={{ height: '100%', border: 0 }} />
            <div className="mono" style={{ position: 'absolute', bottom: 8, left: 8, right: 8, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)', display: 'flex', justifyContent: 'space-between', background: 'var(--paper)', padding: '4px 6px', border: '1px solid var(--paper-line)' }}>
              <span>Crédit · S. Berthier</span>
              <span>3 312 × 2 208 px · ƒ/4 · 1/250 s</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '44px 28px', borderBottom: '1px solid var(--ink)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--signal)' }}>◉ NOTRE OUTIL PRO</div>
            <h2 className="h-display" style={{ fontSize: 56, margin: '10px 0 0' }}>
              Le QCM <span style={{ color: 'var(--signal)' }}>Maison Calorie</span>.<br />
              30 questions. 1 certification.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--paper-3)', marginTop: 14, maxWidth: 540, lineHeight: 1.5 }}>
              Devenez auditeur RGE certifié pour réaliser les diagnostics énergétiques chez les particuliers et accéder aux outils Maison Calorie. Pass à l’unité, sans abonnement.
            </p>
            <Link href="/qcm" className="btn btn--signal" style={{ marginTop: 18 }}>
              Voir les passes <Icon.arrowR />
            </Link>
          </div>
          <div style={{ border: '1px solid var(--paper-3)', padding: 24 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--paper-3)' }}>EXTRAIT — QUESTION 12 / 30</div>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 24, lineHeight: 1.25, marginTop: 12 }}>
              « Pour une PAC air-eau installée en 2026 sur réseau radiateurs basse température, quel est le COP minimum imposé par le décret du 14 avril ? »
            </div>
            <div style={{ marginTop: 16, display: 'grid', gap: 6 }}>
              {['A · 2,8', 'B · 3,2', 'C · 3,5', 'D · 3,8'].map((o, i) => (
                <div key={i} className="mono" style={{ fontSize: 11, padding: '8px 10px', border: '1px solid var(--paper-3)', letterSpacing: '0.04em', color: i === 2 ? 'var(--signal)' : 'var(--paper)' }}>{o}{i === 2 ? ' ◉' : ''}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '36px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 320px', gap: 24, borderBottom: '1px solid var(--ink)' }}>
        <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <div className="h-section" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span>—— Derniers articles</span>
            <Link href="/rubriques/pompes" className="mono lnk" style={{ fontSize: 10, borderBottom: 0, color: 'var(--ink)' }}>Voir tous les articles →</Link>
          </div>
          {a.slice(1, 7).map((it) => <ArticleCard key={it.id} item={it} kind="card" />)}
        </div>

        <aside style={{ borderLeft: '1px solid var(--paper-line)', paddingLeft: 24, position: 'sticky', top: 100, alignSelf: 'start' }}>
          <div className="h-section" style={{ marginBottom: 12 }}>—— Les + lus cette semaine</div>
          {a.slice(0, 5).map((it, i) => (
            <Link key={it.id} href={`/article/${it.id}`} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--paper-line)', textDecoration: 'none', color: 'var(--ink)' }}>
              <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--signal)', lineHeight: 1 }}>{i + 1}</span>
              <div>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{it.cat}</div>
                <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.25, letterSpacing: '-0.01em', marginTop: 2 }}>{it.title}</div>
              </div>
            </Link>
          ))}

          <div style={{ marginTop: 24, border: '1px solid var(--ink)', background: 'var(--ink)', color: 'var(--paper)', padding: 16 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--signal)' }}>◉ Sponsorisé · Maison</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6, lineHeight: 1.15 }}>
              Devenez auditeur RGE certifié en 30 questions.
            </div>
            <div style={{ fontSize: 12, color: 'var(--paper-3)', marginTop: 6 }}>
              Pass à 49 € — accès aux outils de diagnostic après réussite. 1 200 pros déjà certifiés.
            </div>
            <Link href="/qcm" className="btn btn--signal btn--sm" style={{ marginTop: 12 }}>
              Voir le QCM →
            </Link>
          </div>
        </aside>
      </section>

      <section style={{ padding: '36px 28px', borderBottom: '1px solid var(--ink)', background: 'var(--paper-2)' }}>
        <div className="h-section" style={{ marginBottom: 16 }}>—— Dossier promu de la quinzaine</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 32, alignItems: 'center' }}>
          <Placeholder caption="schéma · stratigraphie murale" style={{ aspectRatio: '4/3' }} />
          <div>
            <Tag kind="signal">Dossier · 6 articles</Tag>
            <h2 className="h-title" style={{ fontSize: 44, marginTop: 12, maxWidth: 560 }}>
              Tout savoir sur l’isolation par l’extérieur — sans se faire arnaquer.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-3)', marginTop: 12, maxWidth: 540, lineHeight: 1.5 }}>
              Six articles, vingt-deux fiches techniques, quatre tableurs de comparaison, un guide de devis annoté ligne par ligne. Réservé aux abonnés du bulletin.
            </p>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="btn btn--primary">Ouvrir le dossier <Icon.arrowR /></button>
              <button className="btn btn--ghost">Aperçu PDF (12 p.)</button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '36px 28px', borderBottom: '1px solid var(--ink)' }}>
        <div className="h-section" style={{ marginBottom: 16 }}>—— Naviguer par rubrique</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {CAT_ICONS.map(({ c, n, ic }) => (
            <Link key={c.slug} href={`/rubriques/${c.slug}`} className="tick-frame" style={{ padding: 14, textDecoration: 'none', color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 100 }}>
              <span className="tick-bl"></span><span className="tick-br"></span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28 }}>{ic}</div>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{n} art.</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 'auto' }}>{c.label}</div>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--signal)' }}>Explorer ↗</div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ padding: '36px 28px', borderBottom: '1px solid var(--ink)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <div>
            <div className="h-section">—— Ils nous lisent</div>
            <div className="h-title" style={{ fontSize: 32, marginTop: 6 }}>22 800 lecteurs · Note moyenne <span style={{ color: 'var(--signal)' }}>4,8 / 5</span></div>
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
            Source : enquête lecteurs MC, mars 2026 · n=1 482
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {TESTIMONIALS.map((t) => (
            <figure key={t.who} className="tick-frame" style={{ padding: 20, margin: 0 }}>
              <span className="tick-bl"></span><span className="tick-br"></span>
              <div className="mono" style={{ fontSize: 22, color: 'var(--signal)', lineHeight: 1 }}>“</div>
              <blockquote style={{ margin: 0, fontSize: 15, lineHeight: 1.45, color: 'var(--ink-2)', letterSpacing: '-0.01em' }}>{t.quote}</blockquote>
              <figcaption className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--paper-line)' }}>
                <span style={{ color: 'var(--ink)' }}>{t.who}</span> · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section style={{ padding: '36px 28px' }}>
        <NewsletterBlock />
      </section>

      <Footer />
    </div>
  );
}
