import type { Localized } from '../i18n/languages';

// Deux états vérifiables au lieu de pourcentages inventés :
//   'project'  : déjà utilisé sur un projet ou en stage
//   'learning' : en cours d'apprentissage
export type SkillLevel = 'project' | 'learning';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillGroup {
  id: string;
  title: Localized;
  /** Nom d'icône Lucide. */
  icon: 'server' | 'layout' | 'database' | 'container' | 'flask' | 'smartphone';
  skills: Skill[];
}

// Source : rubrique « Compétences » du CV, plus les technologies citées dans
// l'expérience et les projets.
export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: { fr: 'Backend', en: 'Backend' },
    icon: 'server',
    skills: [
      { name: 'PHP / Laravel', level: 'project' },
      { name: 'API REST', level: 'project' },
      { name: 'Laravel Sanctum', level: 'project' },
      { name: 'JWT (tymon/jwt-auth)', level: 'project' },
      { name: 'Spatie Permission', level: 'project' },
      { name: 'NestJS', level: 'project' },
      { name: 'Python / Flask', level: 'project' },
      { name: 'Java / Spring Boot', level: 'learning' },
      { name: 'Rust', level: 'learning' },
    ],
  },
  {
    id: 'frontend',
    title: { fr: 'Frontend', en: 'Frontend' },
    icon: 'layout',
    skills: [
      { name: 'React', level: 'project' },
      { name: 'Next.js (App Router)', level: 'project' },
      { name: 'TypeScript', level: 'project' },
      { name: 'Vue.js', level: 'project' },
      { name: 'Tailwind CSS', level: 'project' },
      { name: 'HTML5 / CSS3', level: 'project' },
      { name: 'TanStack Table', level: 'project' },
      { name: 'React Hook Form + Zod', level: 'project' },
      { name: 'Axios', level: 'project' },
      { name: 'Recharts', level: 'project' },
      { name: 'React Native', level: 'project' },
    ],
  },
  {
    id: 'data',
    title: { fr: 'Données', en: 'Data' },
    icon: 'database',
    skills: [
      { name: 'PostgreSQL', level: 'project' },
      { name: 'MySQL', level: 'project' },
      { name: 'MongoDB', level: 'project' },
      { name: 'Modélisation de schéma', level: 'project' },
    ],
  },
  {
    id: 'devops',
    title: { fr: 'DevOps et outillage', en: 'DevOps and tooling' },
    icon: 'container',
    skills: [
      { name: 'Docker (build multi-stage)', level: 'project' },
      { name: 'docker-compose', level: 'project' },
      { name: 'Nginx', level: 'project' },
      { name: 'PHP-FPM', level: 'project' },
      { name: 'GitLab CI', level: 'project' },
      { name: 'Git / GitHub / GitLab', level: 'project' },
      { name: 'JIRA', level: 'project' },
      { name: 'Revue de code / merge requests', level: 'project' },
    ],
  },
  {
    id: 'quality',
    title: { fr: 'Tests et qualité', en: 'Testing and quality' },
    icon: 'flask',
    skills: [
      { name: 'Jest', level: 'project' },
      { name: 'Playwright', level: 'project' },
      { name: 'SEO technique', level: 'project' },
      { name: 'Détection de secrets (CI)', level: 'project' },
    ],
  },
];
