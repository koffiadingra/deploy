import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Indique si le visiteur a demande a reduire les animations dans les
 * reglages de son systeme d'exploitation.
 *
 * Le CSS gere deja le cas via @media, mais les animations pilotees en
 * JavaScript (le robot) ne sont pas couvertes par le CSS : il faut donc
 * lire la preference cote script pour pouvoir couper la boucle
 * d'animation, et pas seulement la masquer.
 *
 * Doc : https://developer.mozilla.org/fr/docs/Web/API/Window/matchMedia
 */
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
