import type { Localized } from '../i18n/config';

export interface Experience {
  id: string;
  role: Localized;
  company: string;
  place: Localized;
  period: Localized;
  current: boolean;
  tasks: Localized<string[]>;
  stack: string[];
}

/**
 * Experience professionnelle.
 * SOURCE : rubrique "Experiences professionnelles" du CV (page 1).
 * Aucune mission n'a ete ajoutee ou reformulee au-dela de la traduction.
 */
export const experiences: Experience[] = [
  {
    id: 'xsel-2026',
    role: {
      fr: 'Stage de développement full-stack',
      en: 'Full-stack development internship',
    },
    company: 'Xsel Services',
    place: {
      fr: 'Palmeraie, Cocody, Côte d\u2019Ivoire',
      en: 'Palmeraie, Cocody, Ivory Coast',
    },
    period: {
      fr: 'Février 2026 \u2014 Août 2026',
      en: 'February 2026 \u2014 August 2026',
    },
    current: true,
    tasks: {
      fr: [
        'Développement d\u2019applications web en Laravel, Next.js, React et TypeScript',
        'Conception et développement d\u2019API REST',
        'Développement d\u2019interfaces utilisateur responsives et ergonomiques',
        'Intégration et consommation d\u2019API cote frontend',
        'Conception et gestion de bases de données (MySQL / PostgreSQL)',
        'Correction de bugs, tests et optimisation des performances',
        'Gestion du code source et travail collaboratif avec Git, GitHub, GitLab et JIRA',
        'Participation aux revues de code, aux merge requests et a la maintenance des applications',
      ],
      en: [
        'Building web applications with Laravel, Next.js, React and TypeScript',
        'Designing and developing REST APIs',
        'Building responsive, usable user interfaces',
        'Integrating and consuming APIs on the frontend',
        'Designing and managing databases (MySQL / PostgreSQL)',
        'Bug fixing, testing and performance optimisation',
        'Source control and team collaboration with Git, GitHub, GitLab and JIRA',
        'Taking part in code reviews, merge requests and application maintenance',
      ],
    },
    stack: [
      'Laravel',
      'Next.js',
      'React',
      'TypeScript',
      'MySQL',
      'PostgreSQL',
      'Git',
      'GitHub',
      'GitLab',
      'JIRA',
    ],
  },
];

export interface Education {
  id: string;
  title: Localized;
  school: Localized;
  period: Localized;
  detail?: Localized;
}

/**
 * Formations.
 * SOURCE : rubrique "Diplomes et Formations" du CV (page 1).
 *
 * NOTE : le CV mentionne un projet nomme "for prode" porte par la GIZ.
 * L'intitule exact du programme n'a pas pu etre verifie, il est donc
 * repris tel quel dans le CV sans reformulation.
 */
export const education: Education[] = [
  {
    id: 'wecode-2025',
    title: { fr: 'Formation WeCode', en: 'WeCode training programme' },
    school: {
      fr: 'Epitech, Côte d\u2019Ivoire',
      en: 'Epitech, Ivory Coast',
    },
    period: {
      fr: 'Juin 2025 \u2014 Décembre 2025',
      en: 'June 2025 \u2014 December 2025',
    },
    detail: {
      fr: 'Formation initiée par la GIZ dans le cadre du projet « For Prode », qui vise a former des jeunes aux métiers du numérique.',
      en: 'Programme launched by GIZ as part of the "For Prode" project, which trains young people for digital careers.',
    },
  },
  {
    id: 'licence-2025',
    title: {
      fr: 'Licence en développement d\u2019applications et services',
      en: 'Bachelor in application and service development',
    },
    school: {
      fr: 'Université Virtuelle, Côte d\u2019Ivoire',
      en: 'Virtual University, Ivory Coast',
    },
    period: { fr: '2025', en: '2025' },
  },
];
