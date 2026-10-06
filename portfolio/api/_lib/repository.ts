import { getSql } from './db';
import type {
  ContentBundle,
  EducationItem,
  ExperienceItem,
  ListItem,
  ListKind,
  ProfileContent,
  ProjectItem,
  SkillGroupItem,
  SkillIcon,
  SkillItem,
  SkillLevel,
} from '../../src/content/types';

// Toutes les requêtes SQL du projet ; une colonne renommée ne se corrige qu'ici.
// Deux pièges : BIGSERIAL revient en CHAÎNE (d'où toId()), et BYTEA passe par
// encode/decode base64 pour que le pilote ne manipule que du texte.

function toId(value: unknown): number {
  return typeof value === 'number' ? value : Number(value);
}

function toArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

function loc(fr: unknown, en: unknown): { fr: string; en: string } {
  return { fr: String(fr ?? ''), en: String(en ?? '') };
}

// Média téléversé s'il existe, sinon chemin statique. Les composants ne voient
// qu'une URL dans les deux cas.
function fileUrl(mediaId: unknown, staticPath: unknown): string {
  if (mediaId) return `/api/media/${String(mediaId)}`;
  return String(staticPath ?? '');
}

// --- Lecture ---------------------------------------------------------------

export async function readProfile(): Promise<ProfileContent | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM profile WHERE id = 1
  `) as Record<string, unknown>[];

  const row = rows[0];
  if (!row) return null;

  return {
    fullName: String(row.full_name ?? ''),
    initials: String(row.initials ?? ''),
    email: String(row.email ?? ''),
    phone: String(row.phone ?? ''),
    phoneHref: String(row.phone_href ?? ''),
    githubUrl: String(row.github_url ?? ''),
    linkedinUrl: String(row.linkedin_url ?? ''),
    gitlabUrl: String(row.gitlab_url ?? ''),
    role: loc(row.role_fr, row.role_en),
    location: loc(row.location_fr, row.location_en),
    nationality: loc(row.nationality_fr, row.nationality_en),
    availability: loc(row.availability_fr, row.availability_en),
    pitch: loc(row.pitch_fr, row.pitch_en),
    bio1: loc(row.bio1_fr, row.bio1_en),
    bio2: loc(row.bio2_fr, row.bio2_en),
    portrait: fileUrl(row.portrait_media_id, row.portrait_path),
    cvFile: {
      fr: fileUrl(row.cv_fr_media_id, row.cv_fr_path),
      en: fileUrl(row.cv_en_media_id, row.cv_en_path),
    },
  };
}

export async function readExperiences(): Promise<ExperienceItem[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM experiences ORDER BY sort_order ASC, id ASC
  `) as Record<string, unknown>[];

  return rows.map((row) => ({
    id: toId(row.id),
    role: loc(row.role_fr, row.role_en),
    company: String(row.company ?? ''),
    place: loc(row.place_fr, row.place_en),
    period: loc(row.period_fr, row.period_en),
    current: row.is_current === true,
    tasks: { fr: toArray(row.tasks_fr), en: toArray(row.tasks_en) },
    stack: toArray(row.stack),
  }));
}

export async function readEducation(): Promise<EducationItem[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM education ORDER BY sort_order ASC, id ASC
  `) as Record<string, unknown>[];

  return rows.map((row) => ({
    id: toId(row.id),
    title: loc(row.title_fr, row.title_en),
    school: loc(row.school_fr, row.school_en),
    period: loc(row.period_fr, row.period_en),
    detail: loc(row.detail_fr, row.detail_en),
  }));
}

export async function readProjects(): Promise<ProjectItem[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM projects ORDER BY sort_order ASC, id ASC
  `) as Record<string, unknown>[];

  return rows.map((row) => ({
    id: toId(row.id),
    featured: row.featured === true,
    title: loc(row.title_fr, row.title_en),
    role: loc(row.role_fr, row.role_en),
    summary: loc(row.summary_fr, row.summary_en),
    highlights: { fr: toArray(row.highlights_fr), en: toArray(row.highlights_en) },
    stack: toArray(row.stack),
    repo: String(row.repo_url ?? ''),
    demo: String(row.demo_url ?? ''),
  }));
}

// Deux requêtes plutôt qu'une jointure, qui dupliquerait chaque groupe autant
// de fois qu'il a de compétences. À cette échelle, regrouper en mémoire est
// plus simple.
export async function readSkillGroups(): Promise<SkillGroupItem[]> {
  const sql = getSql();

  const groupRows = (await sql`
    SELECT * FROM skill_groups ORDER BY sort_order ASC, id ASC
  `) as Record<string, unknown>[];

  const skillRows = (await sql`
    SELECT * FROM skills ORDER BY sort_order ASC, id ASC
  `) as Record<string, unknown>[];

  const byGroup = new Map<number, SkillItem[]>();
  for (const row of skillRows) {
    const groupId = toId(row.group_id);
    const list = byGroup.get(groupId) ?? [];
    list.push({
      id: toId(row.id),
      name: String(row.name ?? ''),
      level: String(row.level ?? 'project') as SkillLevel,
    });
    byGroup.set(groupId, list);
  }

  return groupRows.map((row) => {
    const id = toId(row.id);
    return {
      id,
      title: loc(row.title_fr, row.title_en),
      icon: String(row.icon ?? 'server') as SkillIcon,
      skills: byGroup.get(id) ?? [],
    };
  });
}

export async function readListItems(): Promise<ListItem[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM list_items ORDER BY kind ASC, sort_order ASC, id ASC
  `) as Record<string, unknown>[];

  return rows.map((row) => ({
    id: toId(row.id),
    kind: String(row.kind) as ListKind,
    label: loc(row.label_fr, row.label_en),
    detail: loc(row.detail_fr, row.detail_en),
  }));
}

// Lectures en parallèle : le pilote HTTP ouvre une requête par appel, les
// enchaîner additionnerait les allers-retours. Renvoie null si /api/setup n'a
// pas encore été lancé, l'appelant retombe alors sur le contenu statique.
export async function readContentBundle(): Promise<ContentBundle | null> {
  const [profile, experiences, education, projects, skillGroups, listItems] =
    await Promise.all([
      readProfile(),
      readExperiences(),
      readEducation(),
      readProjects(),
      readSkillGroups(),
      readListItems(),
    ]);

  if (!profile) return null;

  return {
    profile,
    experiences,
    education,
    projects,
    skillGroups,
    languages: listItems.filter((item) => item.kind === 'language'),
    softSkills: listItems.filter((item) => item.kind === 'soft_skill'),
    interests: listItems.filter((item) => item.kind === 'interest'),
  };
}

// --- Écriture --------------------------------------------------------------

// Exclut portrait et CV, qui ont leurs propres routes : impossible de croire
// qu'un UPDATE de texte les modifie.
export type ProfileTextFields = Omit<ProfileContent, 'portrait' | 'cvFile'>;

export async function updateProfile(input: ProfileTextFields): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE profile SET
      full_name       = ${input.fullName},
      initials        = ${input.initials},
      email           = ${input.email},
      phone           = ${input.phone},
      phone_href      = ${input.phoneHref},
      github_url      = ${input.githubUrl},
      linkedin_url    = ${input.linkedinUrl},
      gitlab_url      = ${input.gitlabUrl},
      role_fr         = ${input.role.fr},
      role_en         = ${input.role.en},
      location_fr     = ${input.location.fr},
      location_en     = ${input.location.en},
      nationality_fr  = ${input.nationality.fr},
      nationality_en  = ${input.nationality.en},
      availability_fr = ${input.availability.fr},
      availability_en = ${input.availability.en},
      pitch_fr        = ${input.pitch.fr},
      pitch_en        = ${input.pitch.en},
      bio1_fr         = ${input.bio1.fr},
      bio1_en         = ${input.bio1.en},
      bio2_fr         = ${input.bio2.fr},
      bio2_en         = ${input.bio2.en},
      updated_at      = now()
    WHERE id = 1
  `;
}

export type MediaSlot = 'portrait' | 'cv_fr' | 'cv_en';

export async function setProfileMedia(slot: MediaSlot, mediaId: string | null): Promise<void> {
  const sql = getSql();
  // Trois requêtes distinctes : un nom de colonne ne peut pas être un
  // paramètre lié, et l'interpoler rouvrirait la porte à l'injection.
  if (slot === 'portrait') {
    await sql`UPDATE profile SET portrait_media_id = ${mediaId}, updated_at = now() WHERE id = 1`;
  } else if (slot === 'cv_fr') {
    await sql`UPDATE profile SET cv_fr_media_id = ${mediaId}, updated_at = now() WHERE id = 1`;
  } else {
    await sql`UPDATE profile SET cv_en_media_id = ${mediaId}, updated_at = now() WHERE id = 1`;
  }
}

// --- Expériences -----------------------------------------------------------

export async function createExperience(item: Omit<ExperienceItem, 'id'>): Promise<number> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO experiences
      (role_fr, role_en, company, place_fr, place_en,
       period_fr, period_en, is_current, tasks_fr, tasks_en, stack, sort_order)
    VALUES
      (${item.role.fr}, ${item.role.en}, ${item.company},
       ${item.place.fr}, ${item.place.en},
       ${item.period.fr}, ${item.period.en}, ${item.current},
       ${item.tasks.fr}, ${item.tasks.en}, ${item.stack},
       (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM experiences))
    RETURNING id
  `) as Record<string, unknown>[];
  return toId(rows[0].id);
}

export async function updateExperience(id: number, item: Omit<ExperienceItem, 'id'>): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE experiences SET
      role_fr = ${item.role.fr}, role_en = ${item.role.en},
      company = ${item.company},
      place_fr = ${item.place.fr}, place_en = ${item.place.en},
      period_fr = ${item.period.fr}, period_en = ${item.period.en},
      is_current = ${item.current},
      tasks_fr = ${item.tasks.fr}, tasks_en = ${item.tasks.en},
      stack = ${item.stack},
      updated_at = now()
    WHERE id = ${id}
  `;
}

// --- Formations ------------------------------------------------------------

export async function createEducation(item: Omit<EducationItem, 'id'>): Promise<number> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO education
      (title_fr, title_en, school_fr, school_en,
       period_fr, period_en, detail_fr, detail_en, sort_order)
    VALUES
      (${item.title.fr}, ${item.title.en},
       ${item.school.fr}, ${item.school.en},
       ${item.period.fr}, ${item.period.en},
       ${item.detail.fr}, ${item.detail.en},
       (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM education))
    RETURNING id
  `) as Record<string, unknown>[];
  return toId(rows[0].id);
}

export async function updateEducation(id: number, item: Omit<EducationItem, 'id'>): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE education SET
      title_fr = ${item.title.fr}, title_en = ${item.title.en},
      school_fr = ${item.school.fr}, school_en = ${item.school.en},
      period_fr = ${item.period.fr}, period_en = ${item.period.en},
      detail_fr = ${item.detail.fr}, detail_en = ${item.detail.en},
      updated_at = now()
    WHERE id = ${id}
  `;
}

// --- Projets ---------------------------------------------------------------

export async function createProject(item: Omit<ProjectItem, 'id'>): Promise<number> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO projects
      (featured, title_fr, title_en, role_fr, role_en,
       summary_fr, summary_en, highlights_fr, highlights_en,
       stack, repo_url, demo_url, sort_order)
    VALUES
      (${item.featured}, ${item.title.fr}, ${item.title.en},
       ${item.role.fr}, ${item.role.en},
       ${item.summary.fr}, ${item.summary.en},
       ${item.highlights.fr}, ${item.highlights.en},
       ${item.stack}, ${item.repo}, ${item.demo},
       (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM projects))
    RETURNING id
  `) as Record<string, unknown>[];
  return toId(rows[0].id);
}

export async function updateProject(id: number, item: Omit<ProjectItem, 'id'>): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE projects SET
      featured = ${item.featured},
      title_fr = ${item.title.fr}, title_en = ${item.title.en},
      role_fr = ${item.role.fr}, role_en = ${item.role.en},
      summary_fr = ${item.summary.fr}, summary_en = ${item.summary.en},
      highlights_fr = ${item.highlights.fr}, highlights_en = ${item.highlights.en},
      stack = ${item.stack},
      repo_url = ${item.repo}, demo_url = ${item.demo},
      updated_at = now()
    WHERE id = ${id}
  `;
}

// --- Groupes de compétences ------------------------------------------------

export async function createSkillGroup(
  item: Omit<SkillGroupItem, 'id' | 'skills'>,
): Promise<number> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO skill_groups (title_fr, title_en, icon, sort_order)
    VALUES (${item.title.fr}, ${item.title.en}, ${item.icon},
            (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM skill_groups))
    RETURNING id
  `) as Record<string, unknown>[];
  return toId(rows[0].id);
}

export async function updateSkillGroup(
  id: number,
  item: Omit<SkillGroupItem, 'id' | 'skills'>,
): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE skill_groups SET
      title_fr = ${item.title.fr}, title_en = ${item.title.en},
      icon = ${item.icon}, updated_at = now()
    WHERE id = ${id}
  `;
}

// --- Compétences -----------------------------------------------------------

export async function createSkill(
  groupId: number,
  item: Omit<SkillItem, 'id'>,
): Promise<number> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO skills (group_id, name, level, sort_order)
    VALUES (${groupId}, ${item.name}, ${item.level},
            (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM skills WHERE group_id = ${groupId}))
    RETURNING id
  `) as Record<string, unknown>[];
  return toId(rows[0].id);
}

export async function updateSkill(id: number, item: Omit<SkillItem, 'id'>): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE skills SET name = ${item.name}, level = ${item.level} WHERE id = ${id}
  `;
}

// --- Listes simples --------------------------------------------------------

export async function createListItem(item: Omit<ListItem, 'id'>): Promise<number> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO list_items (kind, label_fr, label_en, detail_fr, detail_en, sort_order)
    VALUES (${item.kind}, ${item.label.fr}, ${item.label.en},
            ${item.detail.fr}, ${item.detail.en},
            (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM list_items WHERE kind = ${item.kind}))
    RETURNING id
  `) as Record<string, unknown>[];
  return toId(rows[0].id);
}

export async function updateListItem(id: number, item: Omit<ListItem, 'id'>): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE list_items SET
      kind = ${item.kind},
      label_fr = ${item.label.fr}, label_en = ${item.label.en},
      detail_fr = ${item.detail.fr}, detail_en = ${item.detail.en}
    WHERE id = ${id}
  `;
}

// --- Suppression et réordonnancement ---------------------------------------

// Seule une clé connue donne accès à une requête écrite en dur : une valeur
// inventée par un client n'atteint jamais la base.
const TABLES = {
  experiences: 'experiences',
  education: 'education',
  projects: 'projects',
  'skill-groups': 'skill_groups',
  skills: 'skills',
  'list-items': 'list_items',
} as const;

export type TableKey = keyof typeof TABLES;

export function isTableKey(value: string): value is TableKey {
  return Object.prototype.hasOwnProperty.call(TABLES, value);
}

export async function deleteRow(key: TableKey, id: number): Promise<void> {
  const sql = getSql();
  switch (key) {
    case 'experiences':
      await sql`DELETE FROM experiences WHERE id = ${id}`;
      return;
    case 'education':
      await sql`DELETE FROM education WHERE id = ${id}`;
      return;
    case 'projects':
      await sql`DELETE FROM projects WHERE id = ${id}`;
      return;
    case 'skill-groups':
      await sql`DELETE FROM skill_groups WHERE id = ${id}`;
      return;
    case 'skills':
      await sql`DELETE FROM skills WHERE id = ${id}`;
      return;
    case 'list-items':
      await sql`DELETE FROM list_items WHERE id = ${id}`;
      return;
  }
}

// Une seule requête : `unnest ... WITH ORDINALITY` déplie les identifiants en
// lignes numérotées. Boucler en JavaScript enverrait une requête par élément et
// pourrait s'interrompre à mi-parcours, laissant un ordre incohérent.
export async function reorder(key: TableKey, ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  const sql = getSql();

  switch (key) {
    case 'experiences':
      await sql`UPDATE experiences SET sort_order = ordered.position
                FROM unnest(${ids}::bigint[]) WITH ORDINALITY AS ordered(row_id, position)
                WHERE experiences.id = ordered.row_id`;
      return;
    case 'education':
      await sql`UPDATE education SET sort_order = ordered.position
                FROM unnest(${ids}::bigint[]) WITH ORDINALITY AS ordered(row_id, position)
                WHERE education.id = ordered.row_id`;
      return;
    case 'projects':
      await sql`UPDATE projects SET sort_order = ordered.position
                FROM unnest(${ids}::bigint[]) WITH ORDINALITY AS ordered(row_id, position)
                WHERE projects.id = ordered.row_id`;
      return;
    case 'skill-groups':
      await sql`UPDATE skill_groups SET sort_order = ordered.position
                FROM unnest(${ids}::bigint[]) WITH ORDINALITY AS ordered(row_id, position)
                WHERE skill_groups.id = ordered.row_id`;
      return;
    case 'skills':
      await sql`UPDATE skills SET sort_order = ordered.position
                FROM unnest(${ids}::bigint[]) WITH ORDINALITY AS ordered(row_id, position)
                WHERE skills.id = ordered.row_id`;
      return;
    case 'list-items':
      await sql`UPDATE list_items SET sort_order = ordered.position
                FROM unnest(${ids}::bigint[]) WITH ORDINALITY AS ordered(row_id, position)
                WHERE list_items.id = ordered.row_id`;
      return;
  }
}

// --- Médias ----------------------------------------------------------------

export interface StoredMedia {
  filename: string;
  mimeType: string;
  byteSize: number;
  dataBase64: string;
}

// decode(..., 'base64') convertit côté Postgres : le pilote ne transporte que
// du texte, jamais d'octets bruts.
export async function insertMedia(
  filename: string,
  mimeType: string,
  dataBase64: string,
): Promise<string> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO media (filename, mime_type, byte_size, data)
    VALUES (${filename}, ${mimeType},
            ${Buffer.byteLength(dataBase64, 'base64')},
            decode(${dataBase64}, 'base64'))
    RETURNING id
  `) as Record<string, unknown>[];
  return String(rows[0].id);
}

export async function readMedia(id: string): Promise<StoredMedia | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT filename, mime_type, byte_size, encode(data, 'base64') AS data_base64
    FROM media WHERE id = ${id}
  `) as Record<string, unknown>[];

  const row = rows[0];
  if (!row) return null;

  return {
    filename: String(row.filename),
    mimeType: String(row.mime_type),
    byteSize: Number(row.byte_size),
    dataBase64: String(row.data_base64),
  };
}
