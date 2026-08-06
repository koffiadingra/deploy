import { useI18n } from '../i18n/LanguageProvider';
import { education } from '../data/career';
import { SectionHeader } from './Ui';

export function Education() {
  const { t, pick } = useI18n();

  return (
    <section id="education" className="border-t border-edge py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader index="06" eyebrow={t('edu.eyebrow')} title={t('edu.title')} />

        {/* Ligne verticale continue : la formation est une sequence
            chronologique, le trait porte donc une information reelle. */}
        <ol className="relative border-l border-edge pl-8">
          {education.map((item) => (
            <li key={item.id} className="relative pb-10 last:pb-0">
              <span
                className="absolute -left-[33px] top-1.5 h-2 w-2 bg-signal"
                aria-hidden="true"
              />
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                {pick(item.period)}
              </p>
              <h3 className="mt-1.5 font-display text-xl uppercase tracking-tight text-bone">
                {pick(item.title)}
              </h3>
              <p className="mt-0.5 text-sm text-signal">{pick(item.school)}</p>
              {item.detail ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {pick(item.detail)}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
