import { useEffect, useState } from 'react';

/**
 * Renvoie l'identifiant de la section actuellement visible.
 *
 * Principe : IntersectionObserver plutot qu'un ecouteur `scroll`.
 * Le navigateur fait le calcul lui-meme, hors du thread principal ;
 * on evite de recalculer des positions a chaque pixel de defilement.
 *
 * `rootMargin: '-45% 0px -50% 0px'` reduit la zone d'observation a une
 * bande horizontale au milieu de l'ecran : la section active est celle
 * qui traverse le centre du viewport, ce qui correspond a ce que le
 * visiteur lit reellement.
 *
 * Doc : https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API
 */
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

    // Nettoyage : sans cela, l'observer survivrait au demontage
    // du composant et retiendrait les noeuds DOM en memoire.
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
