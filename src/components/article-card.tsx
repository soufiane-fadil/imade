import Link from "next/link";
import { Placeholder } from "./atoms";

export type ArticleCardItem = {
  cat: string;
  title: string;
  dek: string;
  author: string;
  date: string;
  read: number;
  docs?: number;
  /** Optional decorative number shown next to the category (e.g. № 0421). */
  numero?: string;
};

export function ArticleCard({
  item,
  href,
  kind = "list",
}: {
  item: ArticleCardItem;
  href: string;
  kind?: "list" | "card" | "mini";
}) {
  if (kind === "mini") {
    return (
      <Link
        href={href}
        className="grid grid-cols-[64px_1fr] gap-2.5 no-underline text-ink py-2 border-b border-paper-line"
      >
        <Placeholder caption="img" className="h-12 w-16">
          <span className="mono text-[9px]">▢</span>
        </Placeholder>
        <div>
          <div className="mono text-[9px] tracking-[0.08em] uppercase text-ink-mute">
            {item.cat}
          </div>
          <div className="font-semibold text-[13px] leading-[1.25] tracking-[-0.01em] mt-0.5">
            {item.title}
          </div>
        </div>
      </Link>
    );
  }
  if (kind === "card") {
    return (
      <Link
        href={href}
        className="block no-underline text-ink border-t border-ink"
      >
        <Placeholder
          caption={item.cat + " · photo"}
          className="aspect-[4/3] border-x-0 border-t-0 border-b border-paper-line"
        />
        <div className="py-2.5">
          <div className="mono text-[10px] tracking-[0.08em] uppercase text-signal flex justify-between">
            <span>{item.cat}</span>
            {item.numero ? (
              <span className="text-ink-mute">№ {item.numero}</span>
            ) : null}
          </div>
          <div className="text-[17px] font-bold tracking-[-0.02em] leading-[1.15] mt-1">
            {item.title}
          </div>
          <div className="text-xs text-ink-3 mt-1.5 leading-[1.4]">
            {item.dek}
          </div>
          <div className="mono text-[9px] tracking-[0.08em] uppercase text-ink-mute mt-2 flex justify-between">
            <span>{item.author}</span>
            <span>
              {item.date} · {item.read} min
            </span>
          </div>
        </div>
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 md:grid md:grid-cols-[140px_1fr_auto] md:gap-4 no-underline text-ink py-3.5 border-b border-paper-line"
    >
      <Placeholder caption={item.cat} className="aspect-[4/3]" />
      <div>
        <div className="mono text-[10px] tracking-[0.08em] uppercase text-signal">
          {item.cat}
          {item.numero ? ` · № ${item.numero}` : ""}
        </div>
        <div className="text-[18px] font-bold tracking-[-0.02em] leading-[1.1] mt-[3px]">
          {item.title}
        </div>
        <div className="text-[13px] text-ink-3 mt-1.5 leading-[1.45] max-w-[560px]">
          {item.dek}
        </div>
        <div className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute mt-2.5 flex flex-wrap gap-2.5">
          <span>{item.author}</span>
          <span>·</span>
          <span>{item.date}</span>
          <span>·</span>
          <span>{item.read} min</span>
          {item.docs ? (
            <>
              <span>·</span>
              <span className="text-plot">+{item.docs} PDF</span>
            </>
          ) : null}
        </div>
      </div>
      <div className="self-start">
        <div className="mono text-[10px] text-ink-mute">↗ Lire</div>
      </div>
    </Link>
  );
}

export function ArticleMeta({
  author,
  role,
  published,
  updated,
  readMin,
  category,
}: {
  author: string;
  role?: string;
  published: string;
  updated?: string;
  readMin?: number;
  category?: string;
}) {
  return (
    <div className="mono text-[10px] tracking-[0.06em] uppercase text-ink-mute flex flex-wrap items-center gap-3">
      {category && <span className="tag tag--filled">{category}</span>}
      <span>
        Par <span className="text-ink">{author}</span>
        {role ? " · " + role : ""}
      </span>
      <span className="text-paper-line">│</span>
      <span>Publié {published}</span>
      {updated && (
        <>
          <span className="text-paper-line">│</span>
          <span>MAJ {updated}</span>
        </>
      )}
      {readMin && (
        <>
          <span className="text-paper-line">│</span>
          <span>{readMin} min lecture</span>
        </>
      )}
    </div>
  );
}

export function Breadcrumbs({ trail }: { trail: string[] }) {
  return (
    <div className="mono text-[10px] tracking-[0.08em] uppercase text-ink-mute flex flex-wrap items-center gap-2">
      {trail.map((t, i) => (
        <span key={i} className="inline-flex gap-2 items-center">
          {i > 0 && <span className="text-paper-line">/</span>}
          <span
            className={
              i === trail.length - 1
                ? "text-ink border-b border-ink"
                : "text-ink-mute"
            }
          >
            {t}
          </span>
        </span>
      ))}
    </div>
  );
}
