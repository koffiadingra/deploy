import type { Localized } from '../i18n/languages';

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

// Source : rubrique « Expériences professionnelles » du CV, page 1. Aucune
// mission ajoutée ni reformulée au-delà de la traduction.
export const experiences: Experience[] = [
  {
    id: 'xsel-2026',
    role: {
      fr: 'Stage de développement full-stack',
      en: 'Full-Stack Developer Intern',
    },
    company: 'Xsel Services',
    place: {
      fr: 'Palmeraie, Cocody, Côte d’Ivoire',
      en: 'Palmeraie, Cocody, Ivory Coast',
    },
    period: {
      fr: 'Février 2026 — Août 2026',
      en: 'February 2026 — August 2026',
    },
    current: true,
    tasks: {
      fr: [
        'Développement d’applications web en Laravel, Next.js, React et TypeScript',
        'Conception et développement d’API REST',
        'Développement d’interfaces utilisateur responsives et ergonomiques',
        'Intégration et consommation d’API cote frontend',
        'Conception et gestion de bases de données (MySQL / PostgreSQL)',
        'Correction de bugs, tests et optimisation des performances',
        'Gestion du code source et travail collaboratif avec Git, GitHub, GitLab et JIRA',
        'Participation aux revues de code, aux merge requests et a la maintenance des applications',
      ],
      en: [
        'Developed web applications using Laravel, Next.js, React, and TypeScript',
        'Designed and developed RESTful APIs',
        'Built responsive and user-friendly interfaces',
        'Integrated and consumed backend APIs on the frontend',
        'Designed and managed MySQL and PostgreSQL databases',
        'Participated in bug fixing, testing, and application performance optimization',
        'Used Git, GitHub, GitLab, and Jira for version control, issue tracking, and collaborative development',
        'Participated in code reviews, merge requests, and ongoing application maintenance',
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

// Source : rubrique « Diplômes et Formations » du CV, page 1.
export const education: Education[] = [
  {
    id: 'wecode-2025',
    title: { fr: 'Formation WeCode', en: 'weCode training' },
    school: {
      fr: 'Epitech, Côte d’Ivoire',
      en: 'epitech, Ivory Coast',
    },
    period: {
      fr: 'Juin 2025 — Décembre 2025',
      en: 'June 2025 — December 2025',
    },
    detail: {
      fr: 'Formation initiée par la GIZ dans le cadre du projet « FOR PRODE », qui vise à former des jeunes aux métiers du numérique.',
      en: 'A training program initiated by GIZ as part of the FOR PRODE project, which aims to train young people in the field of digital technology.',
    },
  },
  {
    id: 'google Workspace',
    title: { fr: 'Formation google Workspace ', en: 'google Workspace training' },
    school: {
      fr: 'GDGs Afrique Francophone',
      en: 'DGs for Francophone Africa',
    },
    period: {
      fr: 'Avril 2025 — Mai 2025',
      en: 'April 2025 — May 2025',
    },
    detail: {
      fr: 'Formation qui portait sur l’apprentissage des outils Google Workspace et Firebase.',
      en: 'A training session focused on learning how to use Google Workspace and Firebase tools.',
    },
  },
  {
    id: 'licence-2025',
    title: {
      fr: 'Licence en développement d’applications et services',
      en: "Bachelor's degree in Application and Service Development",
    },
    school: {
      fr: 'Université Virtuelle, Côte d’Ivoire',
      en: 'Virtual university, Ivory Coast',
    },
    period: { fr: '2025', en: '2025' },
  },
];
