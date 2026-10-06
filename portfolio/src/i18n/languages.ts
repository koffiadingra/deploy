// Module volontairement PUR : aucune référence au navigateur, pour que les
// fonctions serverless puissent importer `Localized` sans traîner le DOM. La
// détection de langue vit à part dans config.ts.
// Si un import de ce fichier casse côté API, une dépendance navigateur s'y est
// glissée.

export const LANGUAGES = ['fr', 'en'] as const;

export type Lang = (typeof LANGUAGES)[number]; // 'fr' | 'en'

export const DEFAULT_LANG: Lang = 'fr';

/** { fr: 'Bonjour', en: 'Hello' } — générique, donc aussi Localized<string[]>. */
export type Localized<T = string> = Record<Lang, T>;

export const LANGUAGE_LABELS: Record<Lang, { code: string; name: string }> = {
  fr: { code: 'FR', name: 'Français' },
  en: { code: 'EN', name: 'English' },
};

export function isLang(value: string): value is Lang {
  return (LANGUAGES as readonly string[]).includes(value);
}
