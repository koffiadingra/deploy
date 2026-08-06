import type { Localized } from '../i18n/config';

export interface Project {
  id: string;
  /** `true` = mis en avant en haut de la section Projets. */
  featured: boolean;
  title: Localized;
  role: Localized;
  summary: Localized;
  /** Uniquement pour les projets en vedette : le detail technique. */
  highlights?: Localized<string[]>;
  stack: string[];
  /** Laisser vide tant que le depot public n\u2019existe pas. */
  repo?: string;
  demo?: string;
}

/**
 * SOURCES :
 *  - Projets 1 et 2 (featured) : rubrique "Projets" du CV, page 1.
 *    Les puces sont reprises du CV, sans ajout technique invente.
 *  - Projets suivants : contenu de l\u2019ancien portfolio
 *    (src/components/Projects.tsx de l\u2019archive deploy-main.zip).
 *
 * A COMPLETER : aucun lien de depot ni de demo n\u2019etait fourni.
 * Renseigner `repo` / `demo` quand ils existent ; les boutons
 * apparaissent automatiquement une fois le champ rempli.
 */
export const projects: Project[] = [
  // ---------------------------------------------------------------
  // 1. Projet en vedette — CV
  // ---------------------------------------------------------------
  {
    id: 'facturation',
    featured: true,
    title: {
      fr: 'Application de gestion de facturation',
      en: 'Invoicing management application',
    },
    role: { fr: 'Développeur full-stack', en: 'Full-stack developer' },
    summary: {
      fr: 'Application web de gestion commerciale : émission et suivi de pro-formas, bons de livraison et factures, gestion des clients, catalogue d\u2019articles et de prestations, suivi des livraisons et exports.',
      en: 'Business management web application: issuing and tracking pro-formas, delivery notes and invoices, client management, catalogue of items and services, delivery tracking and exports.',
    },
    highlights: {
      fr: [
        'Conception et développement de l\u2019API REST avec Laravel et PostgreSQL (authentification par tokens Sanctum, rôles et permissions Spatie)',
        'Frontend en Next.js 16 / React 19 et TypeScript, avec tables de données filtrables (TanStack Table) et formulaires validés (React Hook Form + Zod)',
        'Génération de documents PDF (DomPDF) et exports Excel / CSV',
        'Tests unitaires (Jest) et end-to-end (Playwright)',
        'Conteneurisation Docker multi-stage et orchestration docker-compose (PostgreSQL, Nginx, PHP-FPM)',
      ],
      en: [
        'Designed and built the REST API with Laravel and PostgreSQL (Sanctum token authentication, Spatie roles and permissions)',
        'Frontend in Next.js 16 / React 19 and TypeScript, with filterable data tables (TanStack Table) and validated forms (React Hook Form + Zod)',
        'PDF document generation (DomPDF) and Excel / CSV exports',
        'Unit tests (Jest) and end-to-end tests (Playwright)',
        'Multi-stage Docker containerisation and docker-compose orchestration (PostgreSQL, Nginx, PHP-FPM)',
      ],
    },
    stack: [
      'Laravel',
      'PostgreSQL',
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Docker',
      'GitLab CI',
    ],
  },

  // ---------------------------------------------------------------
  // 2. Projet en vedette — CV
  // ---------------------------------------------------------------
  {
    id: 'geclean',
    featured: true,
    title: {
      fr: 'Site vitrine et back-office \u2014 GECLEAN SERVICE',
      en: 'Marketing site and back-office \u2014 GECLEAN SERVICE',
    },
    role: { fr: 'Développeur full-stack', en: 'Full-stack developer' },
    summary: {
      fr: 'Site vitrine et back-office d\u2019administration pour une entreprise de nettoyage : catalogue de services, demandes de devis avec photo, galerie, témoignages, équipe et messagerie de contact.',
      en: 'Marketing site and admin back-office for a cleaning company: service catalogue, quote requests with photo, gallery, testimonials, team pages and contact messaging.',
    },
    highlights: {
      fr: [
        'API REST Laravel / PHP de 58 endpoints, avec réponses et erreurs entièrement normalisées en JSON',
        'Authentification JWT (tymon/jwt-auth) et contrôle d\u2019accès par rôles (RBAC) a 3 niveaux via middleware personnalisé',
        'Frontend Next.js (App Router) / React / TypeScript, styling Tailwind CSS, client Axios avec intercepteurs (injection du token, déconnexion automatique au 401)',
        'SEO technique : Metadata API, Open Graph, sitemap.xml et robots.txt générés, données structurées Schema.org pour le référencement local',
        'Upload et gestion d\u2019images (trait réutilisable, stockage UUID), emails transactionnels non bloquants avec dégradation contrôlée',
        'Tableau de bord administrateur : statistiques, graphiques Recharts, pagination, filtres et recherche cote serveur',
        'Middleware CORS dédié, CI GitLab avec détection de secrets',
      ],
      en: [
        'Laravel / PHP REST API with 58 endpoints, responses and errors fully normalised as JSON',
        'JWT authentication (tymon/jwt-auth) and 3-level role-based access control (RBAC) through custom middleware',
        'Next.js (App Router) / React / TypeScript frontend, Tailwind CSS styling, Axios client with interceptors (token injection, automatic logout on 401)',
        'Technical SEO: Metadata API, Open Graph, generated sitemap.xml and robots.txt, Schema.org structured data for local search',
        'Image upload and management (reusable trait, UUID storage), non-blocking transactional emails with controlled degradation',
        'Admin dashboard: statistics, Recharts charts, pagination, server-side filtering and search',
        'Dedicated CORS middleware, GitLab CI with secret detection',
      ],
    },
    stack: [
      'Laravel',
      'MySQL',
      'JWT',
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Axios',
      'Recharts',
      'GitLab CI',
    ],
  },

  // ---------------------------------------------------------------
  // Projets anterieurs — repris de l'ancien portfolio
  // ---------------------------------------------------------------
  {
    id: 'my-show-time',
    featured: false,
    title: {
      fr: 'My Show Time \u2014 plateforme de réservation',
      en: 'My Show Time \u2014 booking platform',
    },
    role: { fr: 'Développeur backend', en: 'Backend developer' },
    summary: {
      fr: 'Backend d\u2019une plateforme de réservation de concerts et festivals : gestion des utilisateurs, réservation avec QR code, favoris, filtres avancés et panneau d\u2019administration.',
      en: 'Backend for a concert and festival booking platform: user management, QR-code booking, favourites, advanced filters and an admin panel.',
    },
    stack: ['NestJS', 'Node.js', 'MongoDB', 'Mongoose', 'JWT', 'WebSockets'],
  },
  {
    id: 'redditech',
    featured: false,
    title: {
      fr: 'Redditech \u2014 application mobile Reddit',
      en: 'Redditech \u2014 Reddit mobile app',
    },
    role: {
      fr: 'Architecte logiciel / développeur mobile',
      en: 'Software architect / mobile developer',
    },
    summary: {
      fr: 'Application mobile de navigation Reddit : authentification OAuth2, profil utilisateur, navigation dans les subreddits abonnés, recherche, filtres de posts et pagination.',
      en: 'Reddit browsing mobile app: OAuth2 authentication, user profile, subscribed subreddit browsing, search, post filters and pagination.',
    },
    stack: ['React Native', 'OAuth2', 'Vuex'],
  },
  {
    id: 'freeads',
    featured: false,
    title: {
      fr: 'FREEADS \u2014 plateforme de petites annonces',
      en: 'FREEADS \u2014 classified ads platform',
    },
    role: { fr: 'Développeur full-stack', en: 'Full-stack developer' },
    summary: {
      fr: 'Site de publication d\u2019annonces gratuites : inscription et validation par e-mail, CRUD des annonces avec photo, prix et localisation, recherche et filtres, tableau de bord utilisateur.',
      en: 'Free classified ads site: sign-up with email validation, ad CRUD with photo, price and location, search and filters, user dashboard.',
    },
    stack: ['Laravel', 'Vue.js', 'MySQL', 'Tailwind CSS'],
  },
  {
    id: 'notation-films',
    featured: false,
    title: {
      fr: 'Plateforme de notation de films et séries',
      en: 'Film and series rating platform',
    },
    role: { fr: 'Développeur full-stack', en: 'Full-stack developer' },
    summary: {
      fr: 'Application de critique et de notation : fiches détaillées, système de votes et interactions entre utilisateurs.',
      en: 'Review and rating application: detailed entries, a voting system and user interactions.',
    },
    stack: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
  },
  {
    id: 'tickets',
    featured: false,
    title: {
      fr: 'Plateforme d\u2019achat et de réservation de tickets',
      en: 'Ticket purchase and booking platform',
    },
    role: { fr: 'Développeur backend', en: 'Backend developer' },
    summary: {
      fr: 'Backend d\u2019une plateforme de concerts et événements : modules, endpoints, logique métier et API connectées a un frontend Vue.js.',
      en: 'Backend for a concert and event platform: modules, endpoints, business logic and APIs connected to a Vue.js frontend.',
    },
    stack: ['NestJS', 'Vue.js', 'MongoDB', 'Tailwind CSS'],
  },
  {
    id: 'commentaires',
    featured: false,
    title: {
      fr: 'Plateforme de centralisation de commentaires',
      en: 'Comment centralisation platform',
    },
    role: { fr: 'Développeur full-stack', en: 'Full-stack developer' },
    summary: {
      fr: 'Gestion des utilisateurs et centralisation multi-plateforme des commentaires, avec un frontend Vue.js intégré a un backend Laravel.',
      en: 'User management and cross-platform comment aggregation, with a Vue.js frontend on a Laravel backend.',
    },
    stack: ['Laravel', 'Vue.js', 'MySQL', 'Tailwind CSS'],
  },
  {
    id: 'integration-template',
    featured: false,
    title: {
      fr: 'Intégration d\u2019un template HTML / CSS',
      en: 'HTML / CSS template integration',
    },
    role: { fr: 'Intégrateur web', en: 'Web integrator' },
    summary: {
      fr: 'Intégration d\u2019une maquette desktop puis mobile en HTML5 / CSS3 conforme W3C, optimisation SEO mesurée avec Lighthouse et mise en page en CSS Grid.',
      en: 'Integration of a desktop then mobile design in W3C-compliant HTML5 / CSS3, SEO optimisation measured with Lighthouse and CSS Grid layout.',
    },
    stack: ['HTML5', 'CSS3', 'Responsive', 'SEO'],
  },
];
