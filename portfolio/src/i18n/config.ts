/**
 * Socle du systeme bilingue.
 *
 * Principe : une seule source de verite pour la liste des langues.
 * Tout le reste (dictionnaire, donnees, provider) derive de `Lang`,
 * donc ajouter une langue = ajouter une entree ici + les traductions,
 * et TypeScript signalera tout ce qui manque.
 */

export const LANGUAGES = ['fr', 'en'] as const;

export type Lang = (typeof LANGUAGES)[number]; // 'fr' | 'en'

export const DEFAULT_LANG: Lang = 'fr';

/** Cle utilisee dans localStorage pour retenir le choix du visiteur. */
export const STORAGE_KEY = 'portfolio.lang';

/**
 * Un contenu traduit : { fr: 'Bonjour', en: 'Hello' }.
 * Generique, donc utilisable aussi pour des tableaux :
 *   Localized<string[]>  ->  { fr: string[]; en: string[] }
 */
export type Localized<T = string> = Record<Lang, T>;

/** Metadonnees d'affichage du selecteur de langue. */
export const LANGUAGE_LABELS: Record<Lang, { code: string; name: string }> = {
  fr: { code: 'FR', name: 'Francais' },
  en: { code: 'EN', name: 'English' },
};

/**
 * Determine la langue de depart, dans cet ordre de priorite :
 *   1. le choix precedemment enregistre du visiteur (localStorage)
 *   2. la langue du navigateur (navigator.language)
 *   3. la langue par defaut
 *
 * Le try/catch couvre les navigateurs ou localStorage est bloque
 * (mode prive strict, cookies desactives) : on ne casse pas la page.
 */
export function resolveInitialLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && (LANGUAGES as readonly string[]).includes(saved)) {
      return saved as Lang;
    }
  } catch {
    /* localStorage indisponible : on continue */
  }

  const browser = window.navigator.language.slice(0, 2).toLowerCase();
  if ((LANGUAGES as readonly string[]).includes(browser)) {
    return browser as Lang;
  }

  return DEFAULT_LANG;
}
