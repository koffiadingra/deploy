import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// Le CSS couvre déjà ses propres animations via @media, mais pas celles
// pilotées en JavaScript : lire la préférence ici permet de couper la boucle du
// robot au lieu de seulement la masquer.
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
