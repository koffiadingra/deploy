// Partie dépendante du navigateur. Les constantes pures vivent dans
// languages.ts et sont réexportées ici pour ne pas casser les imports.

export {
  LANGUAGES,
  DEFAULT_LANG,
  LANGUAGE_LABELS,
  isLang,
  type Lang,
  type Localized,
} from './languages';

import { DEFAULT_LANG, isLang, type Lang } from './languages';

/** Clé utilisée dans localStorage pour retenir le choix du visiteur. */
export const STORAGE_KEY = 'portfolio.lang';

// Choix enregistré, puis langue du navigateur, puis défaut. Le try/catch
// couvre les navigateurs où localStorage est bloqué (mode privé strict).
export function resolveInitialLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && isLang(saved)) return saved;
  } catch {
    /* localStorage indisponible */
  }

  const browser = window.navigator.language.slice(0, 2).toLowerCase();
  if (isLang(browser)) return browser;

  return DEFAULT_LANG;
}
