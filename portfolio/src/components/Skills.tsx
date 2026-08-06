import {
  Container,
  Database,
  FlaskConical,
  LayoutTemplate,
  Server,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { skillGroups, type SkillLevel } from '../data/skills';
import { Brackets, SectionHeader } from './Ui';

/** Table de correspondance nom -> composant d'icone.
    Les donnees ne referencent qu'une chaine, elles restent
    independantes de la librairie d'icones utilisee. */
const ICONS: Record<string, LucideIcon> = {
  server: Server,
  layout: LayoutTemplate,
  database: Database,
  container: Container,
  flask: FlaskConical,
  smartphone: Smartphone,
};

const LEVEL_STYLE: Record<SkillLevel, string> = {
  project: 'border-signal/50 text-bone',
  learning: 'border-edge text-faint',
};

export function Skills() {
  const { t, pick } = useI18n();

  return (
    <section id="skills" className="border-t border-edge py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader index="05" eyebrow={t('skills.eyebrow')} title={t('skills.title')}>
          {t('skills.note')}
        </SectionHeader>

        {/* Legende : sans elle, la difference de bordure ne veut rien dire */}
        <div className="mb-8 flex flex-wrap items-center gap-5">
          <span className="label">{t('skills.legend')}</span>
          <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
            <span className="h-2.5 w-2.5 border border-signal/50 bg-signal/20" />
            {t('skills.level.project')}
          </span>
          <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
            <span className="h-2.5 w-2.5 border border-edge" />
            {t('skills.level.learning')}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => {
            const Icon = ICONS[group.icon] ?? Server;
            return (
              <div key={group.id} className="group panel relative p-6">
                <Brackets />
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-signal" aria-hidden="true" />
                  <h3 className="font-display text-lg uppercase tracking-wide text-bone">
                    {pick(group.title)}
                  </h3>
                </div>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className={`border bg-inset px-2 py-1 font-mono text-[11px] ${
                        LEVEL_STYLE[skill.level]
                      }`}
                      title={t(
                        skill.level === 'project'
                          ? 'skills.level.project'
                          : 'skills.level.learning',
                      )}
                    >
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
