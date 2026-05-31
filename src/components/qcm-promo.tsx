import Link from "next/link";

export function QcmPromoBlock() {
  return (
    <div className="border border-ink bg-ink text-paper p-4">
      <div className="mono text-[9px] tracking-[0.16em] uppercase text-signal">
        ◉ Notre outil pro
      </div>
      <div className="text-lg font-bold tracking-[-0.02em] mt-[6px] leading-[1.15]">
        Devenez auditeur RGE certifié en 30 questions.
      </div>
      <div className="text-xs text-paper-3 mt-[6px]">
        Pass à 49 € — accès aux outils de diagnostic après réussite. 1 200 pros
        déjà certifiés.
      </div>
      <Link href="/qcm" className="btn btn--signal btn--sm mt-3">
        Voir le QCM →
      </Link>
    </div>
  );
}
