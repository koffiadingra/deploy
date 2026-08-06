import type { Localized } from '../i18n/config';

/**
 * Coordonnees et identite.
 *
 * SOURCE : CV_2026-08-05_Koffi_Jean_Emmanuel_Martial_ADINGRA.pdf
 *
 * A VERIFIER (deux valeurs differentes entre le CV et l'ancien site) :
 *  - Telephone : le CV indique +225 05 86 90 36 07, l'ancien site
 *    affichait +225 07 78 90 95 37. La valeur du CV est retenue ici
 *    car c'est le document le plus recent. A confirmer.
 *  - Email : le CV ecrit "koffi.adingra@epietch.eu" (coquille probable
 *    sur "epitech"). L'ancien site utilisait "koffi.adingra@epitech.eu",
 *    valeur retenue ici. A confirmer.
 */
export const profile = {
  fullName: 'Koffi Jean Emmanuel Martial ADINGRA',
  shortName: 'K. J. E. M. ADINGRA',
  initials: 'KA',
  email: 'koffi.adingra@epitech.eu',
  phone: '+225 05 86 90 36 07',
  phoneHref: '+2250586903607',
  portrait: '/portrait.png',
  cvFile: '/CV-Koffi-Jean-Emmanuel-Martial-ADINGRA.pdf',

  location: {
    fr: 'Grand-Bassam, Côte d\u2019Ivoire',
    en: 'Grand-Bassam, Ivory Coast',
  } satisfies Localized,

  availability: {
    fr: 'Télétravail ou présentiel, avec mobilite',
    en: 'Remote or on site, willing to relocate',
  } satisfies Localized,

  links: {
    github: 'https://github.com/koffiadingra',
    linkedin:
      'https://www.linkedin.com/in/koffi-jean-emmanuel-martial-adingra-3b7622361/',
  },
} as const;

/** Savoir-etre listes dans la rubrique "Atouts" du CV. */
export const softSkills: Localized<string>[] = [
  { fr: 'Travail d\u2019équipe', en: 'Teamwork' },
  { fr: 'Communication claire', en: 'Clear communication' },
  { fr: 'Assertivité', en: 'Assertiveness' },
];

/** Langues parlees, rubrique "Langues" du CV. */
export const spokenLanguages: { name: Localized; level: Localized }[] = [
  {
    name: { fr: 'Français', en: 'French' },
    level: { fr: 'Niveau avancé', en: 'Advanced' },
  },
  {
    name: { fr: 'Anglais', en: 'English' },
    level: { fr: 'Niveau scolaire', en: 'School level' },
  },
];

/** Centres d'interet, rubrique du meme nom sur le CV. */
export const interests: Localized<string>[] = [
  { fr: 'Jeu video', en: 'Gaming' },
  { fr: 'Arts martiaux (kung-fu)', en: 'Martial arts (kung fu)' },
  { fr: 'Biologie moleculaire', en: 'Molecular biology' },
  { fr: 'Mathematiques', en: 'Mathematics' },
  { fr: 'Physique quantique', en: 'Quantum physics' },
];
