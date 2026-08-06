import type { Localized } from '../i18n/config';

/**
 * Coordonnées et identité.
 *
 * SOURCES :
 *  - CV_2026-08-05_..._ADINGRA.pdf  (version française)
 *  - CV_2026-08-06_..._ADINGRA.pdf  (version anglaise)
 *
 * Les deux documents ne disent pas exactement la même chose. Chaque
 * divergence est signalée ci-dessous plutôt que tranchée en silence.
 *
 * À CONFIRMER :
 *  1. Email. Les DEUX CV écrivent « koffi.adingra@epietch.eu ».
 *     « epietch.eu » n'est pas un domaine connu ; « epitech.eu » l'est,
 *     et c'est ce qu'utilisait l'ancien site. La valeur retenue est
 *     donc @epitech.eu — mais la coquille apparaît deux fois, à vérifier.
 *  2. Téléphone. Les deux CV donnent +225 05 86 90 36 07.
 *     L'ancien site affichait +225 07 78 90 95 37. Le CV est retenu.
 *  3. Localisation. Le CV français indique « Mobilité », le CV anglais
 *     indique « Wales » au même emplacement, alors que l'adresse reste
 *     Bassam. Impossible de trancher : le site affiche Grand-Bassam,
 *     Côte d'Ivoire, et la mobilité est mentionnée séparément.
 *  4. Niveau d'anglais. CV français : « Niveau scolaire ».
 *     CV anglais : « Advanced academic level ». Le CV anglais étant le
 *     plus récent (06/08), c'est lui qui est retenu.
 */
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
    fr: 'Grand-Bassam, Côte d\u2019Ivoire',
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
    github: 'https://github.com/koffiadingra',
    linkedin:
      'https://www.linkedin.com/in/koffi-jean-emmanuel-martial-adingra-3b7622361/',
  },
} as const;

/** Rubrique « Atouts » / « Assets ». Libellés repris des deux CV. */
export const softSkills: Localized<string>[] = [
  { fr: 'Travail d\u2019équipe', en: 'Teamwork' },
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
