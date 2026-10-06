import type { Localized } from '../i18n/languages';

export const profile = {
  fullName: 'Koffi Jean Emmanuel Martial ADINGRA',
  shortName: 'K. J. E. M. ADINGRA',
  initials: 'KA',
  email: 'koffi.adingra@epitech.eu',
  phone: '+225 05 86 90 36 07',
  phoneHref: '+2250586903607',
  portrait: '/portrait.png',

  /** Servi dans la langue affichée, via pick() dans le héros. */
  cvFile: {
    fr: '/CV-Koffi-Jean-Emmanuel-Martial-ADINGRA-FR.pdf',
    en: '/CV-Koffi-Jean-Emmanuel-Martial-ADINGRA-EN.pdf',
  } satisfies Localized,

  location: {
    fr: 'Grand-Bassam, Côte d’Ivoire',
    en: 'Grand-Bassam, Ivory Coast',
  } satisfies Localized,

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
    gitlab: 'https://gitlab.com/adingrak403',
  },
} as const;

// Rubrique « Atouts » / « Assets » du CV.
export const softSkills: Localized<string>[] = [
  { fr: 'Travail d’équipe', en: 'Teamwork' },
  { fr: 'Communication claire', en: 'Clear communication' },
  { fr: 'Assertivité', en: 'Assertiveness' },
];

export const spokenLanguages: { name: Localized; level: Localized }[] = [
  {
    name: { fr: 'Français', en: 'French' },
    level: { fr: 'Niveau avancé', en: 'Advanced level' },
  },
  {
    name: { fr: 'Anglais', en: 'English' },
    // Relevé d'après le CV anglais du 06/08, le plus récent.
    level: { fr: 'Niveau académique avancé', en: 'Advanced academic level' },
  },
];

// Le CV français cite la biologie moléculaire, le CV anglais ne la cite
// plus. Conservée ici, à retirer si l'omission était volontaire.
export const interests: Localized<string>[] = [
  { fr: 'Jeu vidéo', en: 'Gaming' },
  { fr: 'Arts martiaux (kung-fu)', en: 'Martial arts (kung fu)' },
  { fr: 'Biologie moléculaire', en: 'Molecular biology' },
  { fr: 'Mathématiques', en: 'Mathematics' },
  { fr: 'Physique quantique', en: 'Quantum physics' },
];
