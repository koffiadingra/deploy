import { useI18n } from '../i18n/LanguageProvider';
import { useContent } from '../content/ContentProvider';
import { SectionHeader } from './Ui';

export function About() {
  const { t, pick } = useI18n();
  const { profile, languages, softSkills, interests } = useContent();

  return (
    <section id="about" className="border-t border-edge py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader index="02" eyebrow={t('about.eyebrow')} title={t('about.title')} />

        <div className="grid gap-10 md:grid-cols-[280px_1fr]">
          <figure className="panel relative self-start p-3">
            <img
              src={profile.portrait}
              alt={profile.fullName}
              loading="lazy"
              className="aspect-square w-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
            />
            <figcaption className="mt-3 flex items-center justify-between">
              <span className="label">ID</span>
              <span className="font-mono text-[11px] text-muted">{profile.initials}-01</span>
            </figcaption>
          </figure>

          <div>
            <p className="text-[15px] leading-relaxed text-bone">{pick(profile.bio1)}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{pick(profile.bio2)}</p>

            <dl className="mt-10 grid gap-8 sm:grid-cols-3">
              <div>
                <dt className="label mb-3">{t('about.langTitle')}</dt>
                <dd className="space-y-2">
                  {languages.map((l) => (
                    <div key={l.id} className="text-sm">
                      <span className="text-bone">{pick(l.label)}</span>
                      <span className="ml-2 font-mono text-[11px] text-faint">
                        {pick(l.detail)}
                      </span>
                    </div>
                  ))}
                </dd>
              </div>

              <div>
                <dt className="label mb-3">{t('about.softTitle')}</dt>
                <dd className="space-y-2">
                  {softSkills.map((s) => (
                    <div key={s.id} className="text-sm text-bone">
                      {pick(s.label)}
                    </div>
                  ))}
                </dd>
              </div>

              <div>
                <dt className="label mb-3">{t('about.interestsTitle')}</dt>
                <dd className="space-y-2">
                  {interests.map((i) => (
                    <div key={i.id} className="text-sm text-muted">
                      {pick(i.label)}
                    </div>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
