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

/**
 * Provider de langue.
 *
 * Pourquoi la Context API et pas une librairie type i18next ?
 * Le site a deux langues et environ 80 chaines. La Context API de React
 * suffit, ne pese rien dans le bundle, et reste entierement lisible.
 * Doc : https://react.dev/reference/react/createContext
 *
 * Le provider expose deux fonctions :
 *   t(cle)     -> texte d'interface depuis le dictionnaire
 *   pick(objet)-> valeur traduite d'une donnee { fr, en }
 */

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (key: UiKey) => string;
  pick: <T>(value: Localized<T>) => T;
}

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialiseur paresseux : la fonction n'est evaluee qu'au premier rendu,
  // on ne relit donc pas localStorage a chaque re-render.
  // Doc : https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
  const [lang, setLang] = useState<Lang>(resolveInitialLang);

  // Effet de bord unique : synchroniser le DOM et le stockage.
  // `document.documentElement.lang` est important pour l'accessibilite
  // (lecteurs d'ecran) et pour le referencement.
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* stockage indisponible : le site fonctionne quand meme */
    }
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((current) => (current === 'fr' ? 'en' : 'fr'));
  }, []);

  const t = useCallback(
    (key: UiKey) => ui[lang][key] ?? ui[DEFAULT_LANG][key] ?? key,
    [lang],
  );

  // Declaration `function` plutot qu'arrow : dans un fichier .tsx,
  // `<T>(...) => ...` serait interprete comme une balise JSX.
  const pick = useCallback(
    function <T>(value: Localized<T>): T {
      return value[lang];
    },
    [lang],
  );

  // useMemo evite de recreer l'objet de contexte a chaque rendu,
  // ce qui re-rendrait inutilement tous les consommateurs.
  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, toggle, t, pick }),
    [lang, toggle, t, pick],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Hook d'acces. Leve une erreur explicite si on oublie le provider. */
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n doit etre utilise a l’interieur de <LanguageProvider>');
  }
  return ctx;
}
