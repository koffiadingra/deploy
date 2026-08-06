import type { Lang } from './config';

/**
 * Dictionnaire des textes d'INTERFACE (titres de section, boutons,
 * libelles de formulaire...). Les contenus metier (projets, experience)
 * vivent dans src/data/ pour ne pas melanger structure et donnees.
 *
 * Astuce de typage : `fr` est la reference. `UiKey` en derive, et `en`
 * est declare comme Record<UiKey, string>. Consequence concrete :
 * si on ajoute une cle en francais sans la traduire, `npx tsc --noEmit`
 * echoue. Impossible d'oublier une traduction en silence.
 */

const fr = {
  // Navigation
  'nav.home': 'Accueil',
  'nav.about': 'Profil',
  'nav.experience': 'Expérience',
  'nav.skills': 'Compétences',
  'nav.projects': 'Projets',
  'nav.education': 'Formation',
  'nav.contact': 'Contact',
  'nav.open': 'Ouvrir le menu',
  'nav.close': 'Fermer le menu',
  'nav.langLabel': 'Changer de langue',

  // Hero
  'hero.status': 'Disponible',
  'hero.role': 'Développeur Full-Stack',
  'hero.name': 'Koffi Jean Emmanuel Martial ADINGRA',
  'hero.pitch':
    'Je construis des applications web de bout en bout : API REST Laravel, interfaces Next.js et TypeScript, base de données, conteneurisation Docker et intégration continue GitLab.',
  'hero.ctaProjects': 'Voir les projets',
  'hero.ctaCv': 'Télécharger le CV (FR)',
  'hero.robotHint': 'Bougez la souris — il vous suit',
  'hero.scroll': 'Défiler',

  // Sections
  'about.eyebrow': 'Profil',
  'about.title': 'Qui je suis',
  'about.body1':
    'Développeur full-stack déterminé, sérieux et autonome, je m’investis pleinement dans chaque projet. Conscient des défis techniques du métier, je fais preuve de rigueur, d’adaptation et d’un sens aigu des responsabilités. Passionné par la création de solutions fiables, je maîtrise aussi bien le backend que le frontend.',
  'about.body2':
    'Au quotidien : Laravel côté serveur, Next.js / React / TypeScript côté client, bases PostgreSQL ou MySQL, API normalisées, tests, revues de code, pipelines GitLab CI et environnements reproductibles avec Docker.',
  'about.langTitle': 'Langues',
  'about.softTitle': 'Savoir-être',
  'about.interestsTitle': 'Centres d’intérêt',

  'exp.eyebrow': 'Parcours',
  'exp.title': 'Expérience professionnelle',
  'exp.present': 'aujourd’hui',
  'exp.stackLabel': 'Outils',

  'skills.eyebrow': 'Outillage',
  'skills.title': 'Compétences techniques',
  'skills.note':
    'Classées par usage réel plutôt que par pourcentage : un niveau chiffré ne veut pas dire grand-chose.',
  'skills.level.project': 'Utilisé en projet',
  'skills.level.learning': 'En apprentissage',
  'skills.legend': 'Niveau',

  'projects.eyebrow': 'Réalisations',
  'projects.title': 'Projets',
  'projects.featured': 'Projets récents',
  'projects.others': 'Autres projets',
  'projects.roleLabel': 'Rôle',
  'projects.stackLabel': 'Stack',
  'projects.highlightsLabel': 'Points clés',
  'projects.showMore': 'Afficher les autres projets',
  'projects.showLess': 'Masquer',
  'projects.noLink': 'Code privé',

  'edu.eyebrow': 'Formation',
  'edu.title': 'Diplômes et formations',

  'contact.eyebrow': 'Contact',
  'contact.title': 'Me contacter',
  'contact.intro':
    'Ouvert aux opportunités en alternance, CDD ou CDI, en présentiel comme en télétravail.',
  'contact.name': 'Nom',
  'contact.namePlaceholder': 'Votre nom',
  'contact.email': 'Email',
  'contact.emailPlaceholder': 'vous@exemple.com',
  'contact.subject': 'Sujet',
  'contact.subjectPlaceholder': 'Objet du message',
  'contact.message': 'Message',
  'contact.messagePlaceholder': 'Votre message...',
  'contact.send': 'Ouvrir dans ma messagerie',
  'contact.formNote':
    'Ce formulaire ne stocke rien : il prépare le message et ouvre votre application de messagerie.',
  'contact.opened': 'Messagerie ouverte. Si rien ne s’affiche, écrivez directement à l’adresse ci-dessous.',
  'contact.copy': 'Copier l’adresse',
  'contact.copied': 'Adresse copiee',
  'contact.infoTitle': 'Coordonnées',
  'contact.linksTitle': 'Liens',
  'contact.phone': 'Téléphone',
  'contact.location': 'Localisation',
  'contact.availability': 'Disponibilité',
  'contact.nationality': 'Nationalité',

  // Pied de page
  'footer.built': 'Site construit avec React, TypeScript, Vite et Tailwind CSS.',
  'footer.top': 'Haut de page',
  'footer.rights': 'Tous droits réservés.',
} as const;

export type UiKey = keyof typeof fr;

const en: Record<UiKey, string> = {
  'nav.home': 'Home',
  'nav.about': 'Profile',
  'nav.experience': 'Experience',
  'nav.skills': 'Skills',
  'nav.projects': 'Projects',
  'nav.education': 'Education',
  'nav.contact': 'Contact',
  'nav.open': 'Open menu',
  'nav.close': 'Close menu',
  'nav.langLabel': 'Change language',

  'hero.status': 'Available',
  'hero.role': 'Full-Stack Developer',
  'hero.name': 'Koffi Jean Emmanuel Martial ADINGRA',
  'hero.pitch':
    'I build web applications end to end: Laravel REST APIs, Next.js and TypeScript interfaces, databases, Docker containers and GitLab continuous integration.',
  'hero.ctaProjects': 'See projects',
  'hero.ctaCv': 'Download CV (EN)',
  'hero.robotHint': 'Move your mouse — it follows you',
  'hero.scroll': 'Scroll',

  'about.eyebrow': 'Profile',
  'about.title': 'Who I am',
  'about.body1':
    'As a determined, serious, and independent full-stack developer, I am fully committed to every project. Aware of the technical challenges of the role, I am rigorous, adaptable, and possess a strong sense of responsibility. Passionate about creating reliable solutions, I am proficient in both backend and frontend development.',
  'about.body2':
    'Day to day: Laravel on the server side, Next.js / React / TypeScript on the client side, PostgreSQL or MySQL databases, standardized APIs, tests, code reviews, GitLab CI pipelines and reproducible environments with Docker.',
  'about.langTitle': 'Languages',
  'about.softTitle': 'Soft skills',
  'about.interestsTitle': 'Interests',

  'exp.eyebrow': 'Track record',
  'exp.title': 'Professional experience',
  'exp.present': 'present',
  'exp.stackLabel': 'Tools',

  'skills.eyebrow': 'Toolbox',
  'skills.title': 'Technical skills',
  'skills.note':
    'Grouped by how I actually use them rather than by percentage: a number would not mean much.',
  'skills.level.project': 'Used on projects',
  'skills.level.learning': 'Learning',
  'skills.legend': 'Level',

  'projects.eyebrow': 'Work',
  'projects.title': 'Projects',
  'projects.featured': 'Recent projects',
  'projects.others': 'Other projects',
  'projects.roleLabel': 'Role',
  'projects.stackLabel': 'Stack',
  'projects.highlightsLabel': 'Highlights',
  'projects.showMore': 'Show other projects',
  'projects.showLess': 'Hide',
  'projects.noLink': 'Private code',

  'edu.eyebrow': 'Education',
  'edu.title': 'Degrees and training',

  'contact.eyebrow': 'Contact',
  'contact.title': 'Get in touch',
  'contact.intro':
    'Open to apprenticeship, fixed-term and permanent roles, on site or remote.',
  'contact.name': 'Name',
  'contact.namePlaceholder': 'Your name',
  'contact.email': 'Email',
  'contact.emailPlaceholder': 'you@example.com',
  'contact.subject': 'Subject',
  'contact.subjectPlaceholder': 'Message subject',
  'contact.message': 'Message',
  'contact.messagePlaceholder': 'Your message...',
  'contact.send': 'Open in my mail app',
  'contact.formNote':
    'This form stores nothing: it prepares the message and opens your mail application.',
  'contact.opened': 'Mail app opened. If nothing happens, write directly to the address below.',
  'contact.copy': 'Copy address',
  'contact.copied': 'Address copied',
  'contact.infoTitle': 'Details',
  'contact.linksTitle': 'Links',
  'contact.phone': 'Phone',
  'contact.location': 'Location',
  'contact.availability': 'Availability',
  'contact.nationality': 'Nationality',

  'footer.built': 'Built with React, TypeScript, Vite and Tailwind CSS.',
  'footer.top': 'Back to top',
  'footer.rights': 'All rights reserved.',
};

export const ui: Record<Lang, Record<UiKey, string>> = { fr, en };
