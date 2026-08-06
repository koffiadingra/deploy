import { useI18n } from '../i18n/LanguageProvider';
import { experiences } from '../data/career';
import { Brackets, SectionHeader, Tag } from './Ui';

export function Experience() {
  const { t, pick } = useI18n();

  return (
    <section id="experience" className="border-t border-edge py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader index="03" eyebrow={t('exp.eyebrow')} title={t('exp.title')} />

        <ol className="space-y-6">
          {experiences.map((exp) => (
            <li key={exp.id} className="group panel relative p-6 md:p-8">
              <Brackets />

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-tight text-bone">
                    {pick(exp.role)}
                  </h3>
                  <p className="mt-1 text-sm text-signal">{exp.company}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-faint">
                    {pick(exp.place)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {exp.current ? (
                    <span
                      className="h-1.5 w-1.5 bg-live animate-led"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                    {pick(exp.period)}
                  </span>
                </div>
              </div>

              <ul className="mt-6 space-y-2.5">
                {pick(exp.tasks).map((task) => (
                  <li key={task} className="flex gap-3 text-sm leading-relaxed text-muted">
                    {/* Le tiret sert de puce : plus sobre qu'une icone, et
                        aria-hidden pour ne pas etre lu par un lecteur d'ecran */}
                    <span className="mt-2 h-px w-3 shrink-0 bg-edge-hi" aria-hidden="true" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-edge pt-4">
                <span className="label mb-3 block">{t('exp.stackLabel')}</span>
                <div className="flex flex-wrap gap-1.5">
                  {exp.stack.map((tool) => (
                    <Tag key={tool}>{tool}</Tag>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
