import type { Localized } from '../i18n/config';

export const profile = {
  fullName: 'Koffi Jean Emmanuel Martial ADINGRA',
  shortName: 'K. J. E. M. ADINGRA',
  initials: 'KA',
  email: 'koffi.adingra@epitech.eu',
  phone: '+225 05 86 90 36 07',
  phoneHref: '+2250586903607',
  portrait: '/portrait.png',

  /**
   * Le CV est servi dans la langue affichée : un recruteur anglophone
   * télécharge la version anglaise, un recruteur francophone la version
   * française. Le bouton du héros lit cette valeur via pick().
   */
  cvFile: {
    fr: '/CV-Koffi-Jean-Emmanuel-Martial-ADINGRA-FR.pdf',
    en: '/CV-Koffi-Jean-Emmanuel-Martial-ADINGRA-EN.pdf',
  } satisfies Localized,

  location: {
    fr: 'Grand-Bassam, Côte d’Ivoire',
    en: 'Grand-Bassam, Ivory Coast',
  } satisfies Localized,

  /** Rubrique « Ivorian » du CV anglais. */
  nationality: {
    fr: 'Ivoirienne',
    en: 'Ivorian',
  } satisfies Localized,

  availability: {
    fr: 'Télétravail ou présentiel, avec mobilité',
    en: 'Open to remote work',
  } satisfies Localized,

  links: {
    github: 'https://github.com/koffiadingra/wecode/tree/dev',
    linkedin:
      'https://www.linkedin.com/in/koffi-jean-emmanuel-martial-adingra-3b7622361/',
  },
} as const;

/** Rubrique « Atouts » / « Assets ». Libellés repris des deux CV. */
export const softSkills: Localized<string>[] = [
  { fr: 'Travail d’équipe', en: 'Teamwork' },
  { fr: 'Communication claire', en: 'Clear communication' },
  { fr: 'Assertivité', en: 'Assertiveness' },
];

/** Rubrique « Langues » / « Languages ». */
export const spokenLanguages: { name: Localized; level: Localized }[] = [
  {
    name: { fr: 'Français', en: 'French' },
    level: { fr: 'Niveau avancé', en: 'Advanced level' },
  },
  {
    name: { fr: 'Anglais', en: 'English' },
    // Niveau relevé d'après le CV anglais du 06/08 (voir note 4 plus haut).
    level: { fr: 'Niveau académique avancé', en: 'Advanced academic level' },
  },
];

/**
 * Rubrique « Centres d'intérêt » / « Interests ».
 * NOTE : le CV français cite la biologie moléculaire, le CV anglais ne
 * la cite plus. Elle est conservée, à retirer si c'est volontaire.
 */
export const interests: Localized<string>[] = [
  { fr: 'Jeu vidéo', en: 'Gaming' },
  { fr: 'Arts martiaux (kung-fu)', en: 'Martial arts (kung fu)' },
  { fr: 'Biologie moléculaire', en: 'Molecular biology' },
  { fr: 'Mathématiques', en: 'Mathematics' },
  { fr: 'Physique quantique', en: 'Quantum physics' },
];
