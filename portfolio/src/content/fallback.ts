// Deux rôles pour les mêmes données :
//  - repli : affiché dès le premier rendu, et conservé si la base est
//    injoignable ou l'API en erreur. Le visiteur ne voit jamais de page vide ;
//  - semence : POST /api/setup insère ce contenu dans une base neuve.
//
// Les données brutes et leurs sources restent dans src/data/ ; ce fichier ne
// fait que les assembler dans la forme attendue par l'API.

import { experiences as staticExperiences, education as staticEducation } from '../data/career.js';
import { projects as staticProjects } from '../data/projects.js';
import { skillGroups as staticSkillGroups } from '../data/skills.js';
import {
  profile as staticProfile,
  softSkills as staticSoftSkills,
  spokenLanguages as staticLanguages,
  interests as staticInterests,
} from '../data/profile.js';
import type {
  ContentBundle,
  EducationItem,
  ExperienceItem,
  ListItem,
  ProjectItem,
  SkillGroupItem,
  SkillIcon,
} from './types';

const EMPTY = { fr: '', en: '' };

const experiences: ExperienceItem[] = staticExperiences.map((item, index) => ({
  id: index + 1,
  role: item.role,
  company: item.company,
  place: item.place,
  period: item.period,
  current: item.current,
  tasks: item.tasks,
  stack: [...item.stack],
}));

const education: EducationItem[] = staticEducation.map((item, index) => ({
  id: index + 1,
  title: item.title,
  school: item.school,
  period: item.period,
  detail: item.detail ?? EMPTY,
}));

const projects: ProjectItem[] = staticProjects.map((item, index) => ({
  id: index + 1,
  featured: item.featured,
  title: item.title,
  role: item.role,
  summary: item.summary,
  highlights: item.highlights ?? { fr: [], en: [] },
  stack: [...item.stack],
  repo: item.repo ?? '',
  demo: item.demo ?? '',
}));

const skillGroups: SkillGroupItem[] = staticSkillGroups.map((group, groupIndex) => ({
  id: groupIndex + 1,
  title: group.title,
  icon: group.icon as SkillIcon,
  skills: group.skills.map((skill, skillIndex) => ({
    // Identifiant local unique entre groupes : 100 × groupe + rang.
    id: (groupIndex + 1) * 100 + skillIndex + 1,
    name: skill.name,
    level: skill.level,
  })),
}));

const languages: ListItem[] = staticLanguages.map((entry, index) => ({
  id: index + 1,
  kind: 'language' as const,
  label: entry.name,
  detail: entry.level,
}));

const softSkills: ListItem[] = staticSoftSkills.map((entry, index) => ({
  id: index + 1,
  kind: 'soft_skill' as const,
  label: entry,
  detail: EMPTY,
}));

const interests: ListItem[] = staticInterests.map((entry, index) => ({
  id: index + 1,
  kind: 'interest' as const,
  label: entry,
  detail: EMPTY,
}));

export const fallbackContent: ContentBundle = {
  profile: {
    fullName: staticProfile.fullName,
    initials: staticProfile.initials,
    email: staticProfile.email,
    phone: staticProfile.phone,
    phoneHref: staticProfile.phoneHref,
    githubUrl: staticProfile.links.github,
    linkedinUrl: staticProfile.links.linkedin,
    gitlabUrl: staticProfile.links.gitlab,
    role: {
      fr: 'Développeur Full-Stack',
      en: 'Full-Stack Developer',
    },
    location: staticProfile.location,
    nationality: staticProfile.nationality,
    availability: staticProfile.availability,
    pitch: {
      fr: 'Je construis des applications web de bout en bout : API REST Laravel, interfaces Next.js et TypeScript, base de données, conteneurisation Docker et intégration continue GitLab.',
      en: 'I build web applications end to end: Laravel REST APIs, Next.js and TypeScript interfaces, databases, Docker containers and GitLab continuous integration.',
    },
    bio1: {
      fr: 'Développeur full-stack déterminé, sérieux et autonome, je m’investis pleinement dans chaque projet. Conscient des défis techniques du métier, je fais preuve de rigueur, d’adaptation et d’un sens aigu des responsabilités. Passionné par la création de solutions fiables, je maîtrise aussi bien le backend que le frontend.',
      en: 'As a determined, serious, and independent full-stack developer, I am fully committed to every project. Aware of the technical challenges of the role, I am rigorous, adaptable, and possess a strong sense of responsibility. Passionate about creating reliable solutions, I am proficient in both backend and frontend development.',
    },
    bio2: {
      fr: 'Au quotidien : Laravel côté serveur, Next.js / React / TypeScript côté client, bases PostgreSQL ou MySQL, API normalisées, tests, revues de code, pipelines GitLab CI et environnements reproductibles avec Docker.',
      en: 'Day to day: Laravel on the server side, Next.js / React / TypeScript on the client side, PostgreSQL or MySQL databases, standardized APIs, tests, code reviews, GitLab CI pipelines and reproducible environments with Docker.',
    },
    portrait: staticProfile.portrait,
    cvFile: staticProfile.cvFile,
  },
  experiences,
  education,
  projects,
  skillGroups,
  languages,
  softSkills,
  interests,
};
