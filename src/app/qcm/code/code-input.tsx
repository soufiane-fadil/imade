"use client";

import { Fragment, useState } from "react";

export function CodeInput() {
  const [code, setCode] = useState(["QCM7", "H4K9", "P2XA", "1B6D"]);
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
      <span className="mono text-[22px] font-semibold text-ink-mute tracking-[0.08em]">
        QCM
      </span>
      <span className="mono text-[22px] text-ink-mute">—</span>
      {code.map((seg, i) => (
        <Fragment key={i}>
          <input
            value={seg}
            onChange={(e) => {
              const c = [...code];
              c[i] = e.target.value.toUpperCase().slice(0, 4);
              setCode(c);
            }}
            aria-label={`Groupe ${i + 1} sur 4`}
            className="mono text-[22px] tracking-[0.16em] text-center py-3 flex-1 min-w-0 bg-paper-2 border border-ink uppercase text-ink outline-none"
          />
          {i < code.length - 1 && (
            <span className="mono text-[22px] text-ink-mute">—</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
