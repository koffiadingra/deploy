// Contrat partagé par les fonctions serverless, le site public et l'espace
// d'administration. Changer un champ ici fait échouer la compilation partout
// où il n'est pas suivi.

import type { Localized } from '../i18n/languages';

export type { Localized };

export type Id = number;

// Profil : ligne unique en base (table `profile`, contrainte id = 1).
export interface ProfileContent {
  fullName: string;
  initials: string;
  email: string;
  phone: string;
  phoneHref: string;
  githubUrl: string;
  linkedinUrl: string;
  gitlabUrl: string;

  role: Localized;
  location: Localized;
  nationality: Localized;
  availability: Localized;

  /** Accroche du héros. */
  pitch: Localized;
  bio1: Localized;
  bio2: Localized;

  /** Fichier statique ou média en base : une URL dans les deux cas. */
  portrait: string;
  cvFile: Localized;
}

export interface ExperienceItem {
  id: Id;
  role: Localized;
  company: string;
  place: Localized;
  period: Localized;
  current: boolean;
  tasks: Localized<string[]>;
  stack: string[];
}

export interface EducationItem {
  id: Id;
  title: Localized;
  school: Localized;
  period: Localized;
  /** Vide = aucun détail affiché. */
  detail: Localized;
}

export interface ProjectItem {
  id: Id;
  /** Mis en avant en haut de section, avec ses points clés. */
  featured: boolean;
  title: Localized;
  role: Localized;
  summary: Localized;
  highlights: Localized<string[]>;
  stack: string[];
  /** Vide = bouton masqué. */
  repo: string;
  demo: string;
}

export type SkillLevel = 'project' | 'learning';

export const SKILL_ICONS = [
  'server',
  'layout',
  'database',
  'container',
  'flask',
  'smartphone',
] as const;

export type SkillIcon = (typeof SKILL_ICONS)[number];

export interface SkillItem {
  id: Id;
  name: string;
  level: SkillLevel;
}

export interface SkillGroupItem {
  id: Id;
  title: Localized;
  icon: SkillIcon;
  skills: SkillItem[];
}

// Langues, savoir-être et centres d'intérêt : même forme, donc une seule table
// `list_items` distinguée par `kind`.
export const LIST_KINDS = ['language', 'soft_skill', 'interest'] as const;
export type ListKind = (typeof LIST_KINDS)[number];

export interface ListItem {
  id: Id;
  kind: ListKind;
  label: Localized;
  /** Niveau pour une langue ; vide pour les autres listes. */
  detail: Localized;
}

// Paquet complet renvoyé par GET /api/content.
export interface ContentBundle {
  profile: ProfileContent;
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skillGroups: SkillGroupItem[];
  languages: ListItem[];
  softSkills: ListItem[];
  interests: ListItem[];
}

export const RESOURCES = [
  'experiences',
  'education',
  'projects',
  'skill-groups',
  'skills',
  'list-items',
] as const;

export type Resource = (typeof RESOURCES)[number];
