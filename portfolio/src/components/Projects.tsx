import { useMemo, useState } from 'react';
import { ChevronDown, ExternalLink, Github } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { projects } from '../data/projects';
import { Brackets, SectionHeader, Tag } from './Ui';

export function Projects() {
  const { t, pick } = useI18n();
  const [showOthers, setShowOthers] = useState(false);

  // useMemo : le filtrage ne depend d'aucun etat, inutile de le refaire
  // a chaque rendu declenche par le bouton ou par le changement de langue.
  const { featured, others } = useMemo(
    () => ({
      featured: projects.filter((p) => p.featured),
      others: projects.filter((p) => !p.featured),
    }),
    [],
  );

  return (
    <section id="projects" className="border-t border-edge py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader index="04" eyebrow={t('projects.eyebrow')} title={t('projects.title')} />

        <h3 className="label mb-5">{t('projects.featured')}</h3>

        <div className="space-y-6">
          {featured.map((project) => (
            <article key={project.id} className="group panel relative p-6 md:p-8">
              <Brackets />

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h4 className="font-display text-2xl uppercase leading-tight tracking-tight text-bone">
                    {pick(project.title)}
                  </h4>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-signal">
                    {t('projects.roleLabel')} : {pick(project.role)}
                  </p>
                </div>

                <div className="flex gap-2">
                  {project.repo ? (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-edge-hi px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bone hover:border-signal hover:text-signal"
                    >
                      <Github className="h-3.5 w-3.5" /> Code
                    </a>
                  ) : (
                    <span className="label border border-edge px-3 py-2">
                      {t('projects.noLink')}
                    </span>
                  )}
                  {project.demo ? (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-edge-hi px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bone hover:border-signal hover:text-signal"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Demo
                    </a>
                  ) : null}
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">
                {pick(project.summary)}
              </p>

              {project.highlights ? (
                <div className="mt-6">
                  <span className="label mb-3 block">{t('projects.highlightsLabel')}</span>
                  <ul className="space-y-2.5">
                    {pick(project.highlights).map((line) => (
                      <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span
                          className="mt-2 h-px w-3 shrink-0 bg-signal"
                          aria-hidden="true"
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 border-t border-edge pt-4">
                <span className="label mb-3 block">{t('projects.stackLabel')}</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Projets anterieurs : replies par defaut pour que les deux
            realisations recentes gardent le premier plan. */}
        <button
          type="button"
          onClick={() => setShowOthers((v) => !v)}
          aria-expanded={showOthers}
          aria-controls="other-projects"
          className="mt-10 inline-flex items-center gap-2 border border-edge-hi px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-signal hover:text-signal"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ease-servo ${
              showOthers ? 'rotate-180' : ''
            }`}
          />
          {showOthers ? t('projects.showLess') : t('projects.showMore')}
          <span className="text-faint">({others.length})</span>
        </button>

        <div id="other-projects" hidden={!showOthers} className="mt-8">
          <h3 className="label mb-5">{t('projects.others')}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {others.map((project) => (
              <article key={project.id} className="group panel relative p-5">
                <Brackets />
                <h4 className="font-display text-lg uppercase leading-tight tracking-tight text-bone">
                  {pick(project.title)}
                </h4>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-signal">
                  {pick(project.role)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {pick(project.summary)}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
