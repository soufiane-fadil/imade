import { resolveImg } from "@/lib/data";
import type { CSSProperties, ReactNode, SVGProps } from "react";

export function Placeholder({
  caption = "photo",
  ratio,
  width,
  height,
  className,
  children,
  style,
}: {
  caption?: string;
  ratio?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const s: CSSProperties = { ...(style || {}) };
  if (ratio) s.aspectRatio = ratio;
  if (width !== undefined) s.width = width;
  if (height !== undefined) s.height = height;
  const url = resolveImg(caption);
  if (url && !children) {
    return (
      <div
        className={
          "relative overflow-hidden bg-paper-2 bg-center bg-cover" +
          (className ? " " + className : "")
        }
        style={{ ...s, backgroundImage: `url(${url})` }}
      />
    );
  }
  return (
    <div
      className={"placeholder" + (className ? " " + className : "")}
      style={s}
    >
      {children || <span>▢ {caption}</span>}
    </div>
  );
}

export function Tag({
  children,
  kind,
  style,
}: {
  children: ReactNode;
  kind?: "filled" | "signal" | "plot" | "leaf" | "ghost";
  style?: CSSProperties;
}) {
  const cls = "tag" + (kind ? ` tag--${kind}` : "");
  return (
    <span className={cls} style={style}>
      {children}
    </span>
  );
}

type IconProps = SVGProps<SVGSVGElement>;

export const Icon = {
  arrowR: (p: IconProps) => (
    <svg viewBox="0 0 16 16" className="icn stroke" {...p}>
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  ),
  arrowL: (p: IconProps) => (
    <svg viewBox="0 0 16 16" className="icn stroke" {...p}>
      <path d="M14 8H3M7 4 3 8l4 4" />
    </svg>
  ),
  plus: (p: IconProps) => (
    <svg viewBox="0 0 16 16" className="icn stroke" {...p}>
      <path d="M8 2v12M2 8h12" />
    </svg>
  ),
  cross: (p: IconProps) => (
    <svg viewBox="0 0 16 16" className="icn stroke" {...p}>
      <path d="M3 3l10 10M13 3 3 13" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg viewBox="0 0 16 16" className="icn stroke" {...p}>
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  ),
  search: (p: IconProps) => (
    <svg viewBox="0 0 16 16" className="icn stroke" {...p}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3 3" />
    </svg>
  ),
  user: (p: IconProps) => (
    <svg viewBox="0 0 16 16" className="icn stroke" {...p}>
      <circle cx="8" cy="6" r="2.6" />
      <path d="M3 14c.8-2.4 2.8-4 5-4s4.2 1.6 5 4" />
    </svg>
  ),
  clock: (p: IconProps) => (
    <svg viewBox="0 0 16 16" className="icn stroke" {...p}>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4v4l3 1.5" />
    </svg>
  ),
  bookmark: (p: IconProps) => (
    <svg viewBox="0 0 16 16" className="icn stroke" {...p}>
      <path d="M4 2h8v12l-4-3-4 3z" />
    </svg>
  ),
  doc: (p: IconProps) => (
    <svg viewBox="0 0 16 16" className="icn stroke" {...p}>
      <path d="M3 1.5h7l3 3v10H3z" />
      <path d="M10 1.5v3h3M5 7h6M5 9.5h6M5 12h4" />
    </svg>
  ),
  house: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className="stroke" {...p}>
      <path d="M3 11 12 4l9 7v9H3z" />
      <path d="M9 20v-6h6v6" />
    </svg>
  ),
  pump: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className="stroke" {...p}>
      <rect x="3" y="6" width="18" height="12" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 8.5v-2M12 17.5v-2M7.5 12h-2M18.5 12h-2" />
    </svg>
  ),
  sun: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className="stroke" {...p}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
    </svg>
  ),
  vent: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className="stroke" {...p}>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 10c-2-2-2-5 0-7M12 14c2 2 2 5 0 7M10 12c-2 2-5 2-7 0M14 12c2-2 5-2 7 0" />
    </svg>
  ),
  wall: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className="stroke" {...p}>
      <rect x="3" y="3" width="18" height="18" />
      <path d="M3 9h18M3 15h18M9 3v6M15 9v6M9 15v6" />
    </svg>
  ),
};
