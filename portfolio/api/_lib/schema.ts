// Schéma de la base. DDL en constante TypeScript et non en fichier .sql : une
// fonction serverless n'embarque que les modules qu'elle importe.
// Un tableau et non un seul script, car le pilote HTTP de Neon n'accepte
// qu'UNE instruction par appel. Tout est IF NOT EXISTS, donc rejouable.
// Conventions : textes bilingues en colonnes *_fr / *_en, listes en text[],
// `sort_order` pour l'ordre d'affichage, NOT NULL DEFAULT '' partout.
export const SCHEMA_STATEMENTS: string[] = [
  // password_hash : empreinte scrypt, jamais le mot de passe en clair.
  `CREATE TABLE IF NOT EXISTS admin_users (
     id            BIGSERIAL PRIMARY KEY,
     email         TEXT        NOT NULL UNIQUE,
     password_hash TEXT        NOT NULL,
     created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
     last_login_at TIMESTAMPTZ
   )`,

  // Portrait et CV stockés dans Neon plutôt que sur un service externe :
  // trois fichiers, ~2 Mo, contre 0,5 Go disponibles. Pour basculer vers un
  // stockage objet, seul api/media/[id].ts est à réécrire.
  `CREATE TABLE IF NOT EXISTS media (
     id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
     filename   TEXT        NOT NULL,
     mime_type  TEXT        NOT NULL,
     byte_size  INTEGER     NOT NULL,
     data       BYTEA       NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,

  // Table singleton : CHECK (id = 1) interdit tout doublon.
  // *_path = chemin statique ; *_media_id prime dès qu'un fichier est téléversé.
  // ON DELETE SET NULL fait retomber sur le statique plutôt que de laisser une
  // référence morte.
  `CREATE TABLE IF NOT EXISTS profile (
     id                SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
     full_name         TEXT NOT NULL DEFAULT '',
     initials          TEXT NOT NULL DEFAULT '',
     email             TEXT NOT NULL DEFAULT '',
     phone             TEXT NOT NULL DEFAULT '',
     phone_href        TEXT NOT NULL DEFAULT '',
     github_url        TEXT NOT NULL DEFAULT '',
     linkedin_url      TEXT NOT NULL DEFAULT '',
     gitlab_url        TEXT NOT NULL DEFAULT '',
     role_fr           TEXT NOT NULL DEFAULT '',
     role_en           TEXT NOT NULL DEFAULT '',
     location_fr       TEXT NOT NULL DEFAULT '',
     location_en       TEXT NOT NULL DEFAULT '',
     nationality_fr    TEXT NOT NULL DEFAULT '',
     nationality_en    TEXT NOT NULL DEFAULT '',
     availability_fr   TEXT NOT NULL DEFAULT '',
     availability_en   TEXT NOT NULL DEFAULT '',
     pitch_fr          TEXT NOT NULL DEFAULT '',
     pitch_en          TEXT NOT NULL DEFAULT '',
     bio1_fr           TEXT NOT NULL DEFAULT '',
     bio1_en           TEXT NOT NULL DEFAULT '',
     bio2_fr           TEXT NOT NULL DEFAULT '',
     bio2_en           TEXT NOT NULL DEFAULT '',
     portrait_path     TEXT NOT NULL DEFAULT '/portrait.png',
     cv_fr_path        TEXT NOT NULL DEFAULT '',
     cv_en_path        TEXT NOT NULL DEFAULT '',
     portrait_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
     cv_fr_media_id    UUID REFERENCES media(id) ON DELETE SET NULL,
     cv_en_media_id    UUID REFERENCES media(id) ON DELETE SET NULL,
     updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,

  // CREATE TABLE IF NOT EXISTS n'ajoute pas de colonne à une table déjà
  // créée : toute colonne ajoutée après coup a besoin de son propre ALTER,
  // lui aussi rejouable.
  `ALTER TABLE profile ADD COLUMN IF NOT EXISTS gitlab_url TEXT NOT NULL DEFAULT ''`,

  `CREATE TABLE IF NOT EXISTS experiences (
     id         BIGSERIAL PRIMARY KEY,
     role_fr    TEXT    NOT NULL DEFAULT '',
     role_en    TEXT    NOT NULL DEFAULT '',
     company    TEXT    NOT NULL DEFAULT '',
     place_fr   TEXT    NOT NULL DEFAULT '',
     place_en   TEXT    NOT NULL DEFAULT '',
     period_fr  TEXT    NOT NULL DEFAULT '',
     period_en  TEXT    NOT NULL DEFAULT '',
     is_current BOOLEAN NOT NULL DEFAULT false,
     tasks_fr   TEXT[]  NOT NULL DEFAULT '{}',
     tasks_en   TEXT[]  NOT NULL DEFAULT '{}',
     stack      TEXT[]  NOT NULL DEFAULT '{}',
     sort_order INTEGER NOT NULL DEFAULT 0,
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,

  `CREATE TABLE IF NOT EXISTS education (
     id         BIGSERIAL PRIMARY KEY,
     title_fr   TEXT NOT NULL DEFAULT '',
     title_en   TEXT NOT NULL DEFAULT '',
     school_fr  TEXT NOT NULL DEFAULT '',
     school_en  TEXT NOT NULL DEFAULT '',
     period_fr  TEXT NOT NULL DEFAULT '',
     period_en  TEXT NOT NULL DEFAULT '',
     detail_fr  TEXT NOT NULL DEFAULT '',
     detail_en  TEXT NOT NULL DEFAULT '',
     sort_order INTEGER NOT NULL DEFAULT 0,
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,

  `CREATE TABLE IF NOT EXISTS projects (
     id            BIGSERIAL PRIMARY KEY,
     featured      BOOLEAN NOT NULL DEFAULT false,
     title_fr      TEXT    NOT NULL DEFAULT '',
     title_en      TEXT    NOT NULL DEFAULT '',
     role_fr       TEXT    NOT NULL DEFAULT '',
     role_en       TEXT    NOT NULL DEFAULT '',
     summary_fr    TEXT    NOT NULL DEFAULT '',
     summary_en    TEXT    NOT NULL DEFAULT '',
     highlights_fr TEXT[]  NOT NULL DEFAULT '{}',
     highlights_en TEXT[]  NOT NULL DEFAULT '{}',
     stack         TEXT[]  NOT NULL DEFAULT '{}',
     repo_url      TEXT    NOT NULL DEFAULT '',
     demo_url      TEXT    NOT NULL DEFAULT '',
     sort_order    INTEGER NOT NULL DEFAULT 0,
     updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,

  // `icon` : nom d'icône Lucide, validé côté API contre SKILL_ICONS.
  `CREATE TABLE IF NOT EXISTS skill_groups (
     id         BIGSERIAL PRIMARY KEY,
     title_fr   TEXT NOT NULL DEFAULT '',
     title_en   TEXT NOT NULL DEFAULT '',
     icon       TEXT NOT NULL DEFAULT 'server',
     sort_order INTEGER NOT NULL DEFAULT 0,
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,

  // CASCADE : sans elle, supprimer un groupe laisserait des compétences
  // orphelines, jamais affichées mais jamais effacées.
  `CREATE TABLE IF NOT EXISTS skills (
     id         BIGSERIAL PRIMARY KEY,
     group_id   BIGINT  NOT NULL REFERENCES skill_groups(id) ON DELETE CASCADE,
     name       TEXT    NOT NULL DEFAULT '',
     level      TEXT    NOT NULL DEFAULT 'project'
                CHECK (level IN ('project', 'learning')),
     sort_order INTEGER NOT NULL DEFAULT 0
   )`,

  `CREATE INDEX IF NOT EXISTS skills_group_id_idx ON skills (group_id)`,

  // Langues, savoir-être et centres d'intérêt ont la même forme : une seule
  // table distinguée par `kind`, au lieu de tripler le code CRUD.
  `CREATE TABLE IF NOT EXISTS list_items (
     id         BIGSERIAL PRIMARY KEY,
     kind       TEXT NOT NULL
                CHECK (kind IN ('language', 'soft_skill', 'interest')),
     label_fr   TEXT NOT NULL DEFAULT '',
     label_en   TEXT NOT NULL DEFAULT '',
     detail_fr  TEXT NOT NULL DEFAULT '',
     detail_en  TEXT NOT NULL DEFAULT '',
     sort_order INTEGER NOT NULL DEFAULT 0
   )`,

  `CREATE INDEX IF NOT EXISTS list_items_kind_idx ON list_items (kind)`,
];
