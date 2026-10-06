import { ArrowDown, Download, FolderGit2 } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { useContent } from '../content/ContentProvider';
import { Robot } from './Robot';

export function Hero() {
  const { t, pick } = useI18n();
  const { profile } = useContent();

  // Le dernier mot est affiché en retrait sur sa propre ligne : règle de la
  // maquette, pas une supposition sur l'état civil.
  const parts = profile.fullName.trim().split(/\s+/);
  const surname = parts.length > 1 ? parts[parts.length - 1] : '';
  const givenNames = parts.length > 1 ? parts.slice(0, -1) : parts;

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-20 md:pt-36">
      {/* Grille dessinée en CSS plutôt qu'en image : rien à télécharger. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-edge) 1px, transparent 1px), linear-gradient(90deg, var(--color-edge) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 20%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="h-2 w-2 bg-live animate-led" aria-hidden="true" />
            <span className="label text-live">{t('hero.status')}</span>
            <span className="h-px flex-1 bg-edge" aria-hidden="true" />
            <span className="label">{pick(profile.location)}</span>
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-signal">
            {pick(profile.role)}
          </p>

          <h1 className="mt-3 font-display text-5xl leading-[0.95] uppercase tracking-tight text-bone sm:text-6xl lg:text-7xl">
            {givenNames.join(' ')}
            {surname ? (
              <>
                <br />
                <span className="text-muted">{surname}</span>
              </>
            ) : null}
          </h1>

          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-muted">
            {pick(profile.pitch)}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 bg-signal px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors duration-150 hover:bg-bone"
            >
              <FolderGit2 className="h-4 w-4" />
              {t('hero.ctaProjects')}
            </a>
            <a
              href={pick(profile.cvFile)}
              download
              className="inline-flex items-center gap-2 border border-edge-hi px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-bone transition-colors duration-150 hover:border-signal hover:text-signal"
            >
              <Download className="h-4 w-4" />
              {t('hero.ctaCv')}
            </a>
          </div>

          <a
            href="#about"
            className="mt-12 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-faint hover:text-signal"
          >
            <ArrowDown className="h-3 w-3" />
            {t('hero.scroll')}
          </a>
        </div>

        {/* Sur mobile, `order-first` place le robot au-dessus du texte. */}
        <div className="order-first flex flex-col items-center md:order-none">
          <div className="relative w-full max-w-[320px]">
            <Robot className="w-full" />
          </div>
          <p className="mt-2 hidden label text-center md:block">{t('hero.robotHint')}</p>
        </div>
      </div>
    </section>
  );
}
