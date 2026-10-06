import { useEffect, useState } from 'react';

// IntersectionObserver plutôt qu'un écouteur `scroll` : le navigateur fait le
// calcul hors du thread principal.
// Le rootMargin réduit la zone d'observation à une bande au milieu de l'écran,
// pour que la section active soit celle que le visiteur lit réellement.
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    // Sans cela, l'observer retiendrait les nœuds DOM après le démontage.
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
