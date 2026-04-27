import Link from 'next/link';
import type { Article } from '@/lib/data';
import { Placeholder } from './atoms';

export function ArticleCard({ item, kind = 'list' }: { item: Article; kind?: 'list' | 'card' | 'mini' }) {
  const href = `/article/${item.id}`;
  if (kind === 'mini') {
    return (
      <Link href={href} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 10, textDecoration: 'none', color: 'var(--ink)', padding: '8px 0', borderBottom: '1px solid var(--paper-line)' }}>
        <Placeholder caption="img" style={{ height: 48, width: 64 }}>
          <span className="mono" style={{ fontSize: 9 }}>▢</span>
        </Placeholder>
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{item.cat}</div>
          <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.25, letterSpacing: '-0.01em', marginTop: 2 }}>{item.title}</div>
        </div>
      </Link>
    );
  }
  if (kind === 'card') {
    return (
      <Link href={href} style={{ display: 'block', textDecoration: 'none', color: 'var(--ink)', borderTop: '1px solid var(--ink)' }}>
        <Placeholder caption={item.cat + ' · photo'} style={{ aspectRatio: '4/3', borderLeft: 0, borderRight: 0, borderTop: 0, borderBottom: '1px solid var(--paper-line)' }} />
        <div style={{ padding: '10px 0' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--signal)', display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.cat}</span>
            <span style={{ color: 'var(--ink-mute)' }}>№ {item.id}</span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 4 }}>{item.title}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6, lineHeight: 1.4 }}>{item.dek}</div>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.author}</span><span>{item.date} · {item.read} min</span>
          </div>
        </div>
      </Link>
    );
  }
  return (
    <Link href={href} style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: 16, textDecoration: 'none', color: 'var(--ink)', padding: '14px 0', borderBottom: '1px solid var(--paper-line)' }}>
      <Placeholder caption={item.cat} style={{ aspectRatio: '4/3' }} />
      <div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--signal)' }}>{item.cat} · № {item.id}</div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 3 }}>{item.title}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6, lineHeight: 1.45, maxWidth: 560 }}>{item.dek}</div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 10, display: 'flex', gap: 10 }}>
          <span>{item.author}</span><span>·</span><span>{item.date}</span><span>·</span><span>{item.read} min</span>
          {item.docs ? <><span>·</span><span style={{ color: 'var(--plot)' }}>+{item.docs} PDF</span></> : null}
        </div>
      </div>
      <div style={{ alignSelf: 'start' }}>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>↗ Lire</div>
      </div>
    </Link>
  );
}

export function ArticleMeta({ author, role, published, updated, readMin, category }: {
  author: string; role?: string; published: string; updated?: string; readMin?: number; category?: string;
}) {
  return (
    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-mute)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      {category && <span className="tag tag--filled">{category}</span>}
      <span>Par <span style={{ color: 'var(--ink)' }}>{author}</span>{role ? ' · ' + role : ''}</span>
      <span style={{ color: 'var(--paper-line)' }}>│</span>
      <span>Publié {published}</span>
      {updated && <><span style={{ color: 'var(--paper-line)' }}>│</span><span>MAJ {updated}</span></>}
      {readMin && <><span style={{ color: 'var(--paper-line)' }}>│</span><span>{readMin} min lecture</span></>}
    </div>
  );
}

export function Breadcrumbs({ trail }: { trail: string[] }) {
  return (
    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {trail.map((t, i) => (
        <span key={i} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          {i > 0 && <span style={{ color: 'var(--paper-line)' }}>/</span>}
          <span style={{ color: i === trail.length - 1 ? 'var(--ink)' : 'var(--ink-mute)', borderBottom: i === trail.length - 1 ? '1px solid var(--ink)' : 'none' }}>{t}</span>
        </span>
      ))}
    </div>
  );
}
