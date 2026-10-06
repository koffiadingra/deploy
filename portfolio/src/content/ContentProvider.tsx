import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { ContentBundle } from './types';
import { fallbackContent } from './fallback';

// Le repli d'abord, la base ensuite : le premier rendu utilise le contenu
// compilé dans le bundle, et l'appel à /api/content ne le remplace que s'il
// aboutit. Base injoignable ou vide, le visiteur voit quand même le site
// complet. En contrepartie, après une modification dans l'admin, le contenu
// d'origine s'affiche une fraction de seconde avant d'être remplacé.

interface ContentState {
  content: ContentBundle;
  loading: boolean;
  /** `true` si le contenu vient de la base, `false` s'il vient du repli. */
  fromDatabase: boolean;
}

const ContentContext = createContext<ContentState>({
  content: fallbackContent,
  loading: true,
  fromDatabase: false,
});

// Au-delà, on cesse d'attendre l'API et on garde le repli.
const TIMEOUT_MS = 8000;

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentState>({
    content: fallbackContent,
    loading: true,
    fromDatabase: false,
  });

  useEffect(() => {
    // Coupe la requête au démontage et applique le délai maximal : sans cela,
    // une base lente laisserait la requête pendante indéfiniment.
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch('/api/content', {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        // 204 : base non configurée ou installation jamais lancée.
        if (response.status === 204 || !response.ok) {
          if (!cancelled) setState((s) => ({ ...s, loading: false }));
          return;
        }

        const data = (await response.json()) as ContentBundle;

        // Une réponse mal formée ne doit pas vider la page.
        if (!data?.profile?.fullName) {
          if (!cancelled) setState((s) => ({ ...s, loading: false }));
          return;
        }

        if (!cancelled) {
          setState({ content: data, loading: false, fromDatabase: true });
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      } finally {
        window.clearTimeout(timer);
      }
    }

    void load();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

// Toujours défini : au pire, le contenu de repli.
export function useContent(): ContentBundle {
  return useContext(ContentContext).content;
}

export function useContentState(): ContentState {
  return useContext(ContentContext);
}
