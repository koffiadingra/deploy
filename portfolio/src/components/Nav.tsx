import { useEffect, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useI18n } from '../i18n/LanguageProvider';
import { useActiveSection } from '../hooks/useActiveSection';
import { LanguageSwitch } from './LanguageSwitch';
import type { UiKey } from '../i18n/ui';
import { useContent } from '../content/ContentProvider';

// Une seule liste pour le menu et le rail d'axe.
export const SECTIONS: { id: string; key: UiKey }[] = [
  { id: 'home', key: 'nav.home' },
  { id: 'about', key: 'nav.about' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'projects', key: 'nav.projects' },
  { id: 'skills', key: 'nav.skills' },
  { id: 'education', key: 'nav.education' },
  { id: 'contact', key: 'nav.contact' },
];

export function Nav() {
  const { t } = useI18n();
  const { profile } = useContent();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? 'border-edge bg-ink/90 backdrop-blur-sm'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#home" className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center border border-signal font-mono text-[11px] text-signal">
              {profile.initials}
            </span>
            <span className="hidden font-display text-sm uppercase tracking-[0.2em] text-bone sm:block">
              Adingra
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={active === section.id ? 'true' : undefined}
                className={`px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-150 ${
                  active === section.id
                    ? 'text-signal'
                    : 'text-muted hover:text-bone'
                }`}
              >
                {t(section.key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitch />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t('nav.close') : t('nav.open')}
              className="grid h-9 w-9 place-items-center border border-edge text-bone md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <nav
          id="mobile-nav"
          hidden={!open}
          aria-label="Sections"
          className="border-t border-edge bg-panel md:hidden"
        >
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 border-b border-edge px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-muted last:border-b-0"
            >
              <span
                className={`h-1.5 w-1.5 ${
                  active === section.id ? 'bg-signal' : 'bg-edge-hi'
                }`}
              />
              {t(section.key)}
            </a>
          ))}
        </nav>
      </header>

      {/* Rail d'axe : position dans la page, sur grand écran. */}
      <div
        aria-hidden="true"
        className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex"
      >
        <span className="h-10 w-px bg-edge" />
        {SECTIONS.map((section, i) => (
          <span key={section.id} className="flex items-center gap-2">
            <span
              className={`font-mono text-[9px] transition-colors duration-200 ${
                active === section.id ? 'text-signal' : 'text-faint'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className={`block transition-all duration-200 ease-servo ${
                active === section.id
                  ? 'h-px w-6 bg-signal'
                  : 'h-px w-3 bg-edge-hi'
              }`}
            />
          </span>
        ))}
        <span className="h-10 w-px bg-edge" />
      </div>
    </>
  );
}
