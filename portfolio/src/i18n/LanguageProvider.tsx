import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LANG,
  STORAGE_KEY,
  resolveInitialLang,
  type Lang,
  type Localized,
} from './config';
import { ui, type UiKey } from './ui';

// Context API plutôt qu'une bibliothèque i18n : deux langues et ~80 chaînes ne
// justifient pas le poids d'i18next.
// Expose t(clé) pour les textes d'interface et pick(objet) pour les données
// bilingues { fr, en }.

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (key: UiKey) => string;
  pick: <T>(value: Localized<T>) => T;
}

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialiseur paresseux : localStorage n'est relu qu'au premier rendu.
  const [lang, setLang] = useState<Lang>(resolveInitialLang);

  // `documentElement.lang` compte pour les lecteurs d'écran et le référencement.
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* stockage indisponible */
    }
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((current) => (current === 'fr' ? 'en' : 'fr'));
  }, []);

  const t = useCallback(
    (key: UiKey) => ui[lang][key] ?? ui[DEFAULT_LANG][key] ?? key,
    [lang],
  );

  // Déclaration `function` et non arrow : dans un .tsx, `<T>(...) =>` serait
  // lu comme une balise JSX.
  const pick = useCallback(
    function <T>(value: Localized<T>): T {
      return value[lang];
    },
    [lang],
  );

  // Évite de recréer l'objet de contexte, ce qui re-rendrait tous les consommateurs.
  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, toggle, t, pick }),
    [lang, toggle, t, pick],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n doit etre utilise a l’interieur de <LanguageProvider>');
  }
  return ctx;
}
