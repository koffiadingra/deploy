import { LANGUAGES, LANGUAGE_LABELS } from '../i18n/config';
import { useI18n } from '../i18n/LanguageProvider';

/**
 * Selecteur de langue, dessine comme un interrupteur a deux positions
 * sur un boitier : un curseur orange glisse sous la langue active.
 *
 * Accessibilite : `role="group"` + `aria-pressed` sur chaque bouton.
 * Un lecteur d'ecran annonce donc laquelle des deux est selectionnee,
 * ce que la couleur seule ne transmettrait pas.
 * Doc : https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Attributes/aria-pressed
 */
export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n();
  const activeIndex = LANGUAGES.indexOf(lang);

  return (
    <div
      role="group"
      aria-label={t('nav.langLabel')}
      className="relative flex border border-edge bg-inset"
    >
      {/* Curseur : un seul element qui se translate, pas deux fonds qui clignotent */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/2 bg-signal transition-transform duration-200 ease-servo"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          title={LANGUAGE_LABELS[code].name}
          className={`relative z-10 px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] transition-colors duration-200 ${
            lang === code ? 'text-ink' : 'text-muted hover:text-bone'
          }`}
        >
          {LANGUAGE_LABELS[code].code}
        </button>
      ))}
    </div>
  );
}
