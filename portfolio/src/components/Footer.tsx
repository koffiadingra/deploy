import { ArrowUp } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { profile } from '../data/profile';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-edge">
      <div className="hazard h-1.5 w-full" aria-hidden="true" />

      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] text-muted">
            © {new Date().getFullYear()} {profile.fullName}. {t('footer.rights')}
          </p>
          <p className="mt-1 font-mono text-[11px] text-faint">{t('footer.built')}</p>
        </div>

        <a
          href="#home"
          className="inline-flex items-center gap-2 self-start border border-edge px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-signal hover:text-signal"
        >
          <ArrowUp className="h-3.5 w-3.5" />
          {t('footer.top')}
        </a>
      </div>
    </footer>
  );
}
