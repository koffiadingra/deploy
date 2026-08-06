import type { ReactNode } from 'react';

/**
 * Primitives visuelles partagees.
 * Les regrouper ici evite de repeter les memes chaines de classes
 * dans six sections differentes, et garantit qu'un changement de style
 * se fait a un seul endroit.
 */

/** Numero + intitule de section, suivis d'une bande de prudence. */
export function SectionHeader({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-12">
      <div className="flex items-baseline gap-4">
        <span className="label text-signal">{index}</span>
        <span className="label">{eyebrow}</span>
      </div>
      <h2 className="mt-3 font-display text-4xl md:text-5xl uppercase tracking-tight text-bone">
        {title}
      </h2>
      <div className="hazard mt-5 h-1.5 w-24" aria-hidden="true" />
      {children ? (
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">{children}</p>
      ) : null}
    </header>
  );
}

/** Etiquette de technologie. Pas un bouton : c'est une donnee. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-edge bg-inset px-2 py-1 font-mono text-[11px] tracking-wide text-muted">
      {children}
    </span>
  );
}

/** Equerres de reperage affichees au survol d'une carte. */
export function Brackets() {
  return (
    <>
      <span className="bracket bracket-tl" aria-hidden="true" />
      <span className="bracket bracket-br" aria-hidden="true" />
    </>
  );
}
