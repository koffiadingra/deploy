import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';
import { SCHEMA_STATEMENTS } from './_lib/schema.js';
import { adminExists, hashPassword } from './_lib/auth.js';
import { fail, handleError, json, rejectMethod } from './_lib/http.js';
import { fallbackContent } from '../src/content/fallback.js';

// Crée les tables, le compte administrateur et sème le contenu du CV. Chaque
// étape vérifie ce qui existe déjà : relancer la route ne duplique rien.
// Protégée par un jeton et non par une session, puisqu'elle doit fonctionner
// avant qu'aucun compte n'existe ; sans SETUP_TOKEN, elle refuse tout.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (rejectMethod(req, res, ['POST'])) return;

  const expected = process.env.SETUP_TOKEN;
  if (!expected) {
    return fail(
      res,
      503,
      'SETUP_DISABLED',
      'SETUP_TOKEN n’est pas définie : l’installation est désactivée.',
    );
  }

  const provided = req.headers['x-setup-token'];
  if (provided !== expected) {
    return fail(res, 401, 'INVALID_SETUP_TOKEN', 'Jeton d’installation invalide.');
  }

  try {
    const report = {
      tablesCreated: 0,
      adminCreated: false,
      contentSeeded: false,
    };

    // Une instruction par requête : contrainte du pilote HTTP de Neon.
    const sql = getSql();
    for (const statement of SCHEMA_STATEMENTS) {
      await sql.query(statement);
      report.tablesCreated += 1;
    }

    if (await adminExists()) {
      report.adminCreated = false;
    } else {
      const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
      const password = process.env.ADMIN_PASSWORD ?? '';

      if (!email || !password) {
        return fail(
          res,
          400,
          'MISSING_ADMIN_ENV',
          'ADMIN_EMAIL et ADMIN_PASSWORD sont requises pour créer le premier compte.',
        );
      }
      if (password.length < 12) {
        return fail(
          res,
          400,
          'WEAK_PASSWORD',
          'ADMIN_PASSWORD doit faire au moins 12 caractères.',
        );
      }

      await sql`
        INSERT INTO admin_users (email, password_hash)
        VALUES (${email}, ${hashPassword(password)})
      `;
      report.adminCreated = true;
    }

    const existing = (await sql`SELECT 1 FROM profile WHERE id = 1`) as unknown[];
    if (existing.length === 0) {
      await seedContent();
      report.contentSeeded = true;
    }

    json(res, 200, {
      ok: true,
      ...report,
      next: 'Ouvrez /admin et connectez-vous avec ADMIN_EMAIL / ADMIN_PASSWORD.',
    });
  } catch (error) {
    handleError(res, error);
  }
}

// Source : src/content/fallback.ts, ce que le site affiche quand la base est
// injoignable. Base et repli partent donc du même contenu.
async function seedContent(): Promise<void> {
  const sql = getSql();
  const c = fallbackContent;
  const p = c.profile;

  await sql`
    INSERT INTO profile (
      id, full_name, initials, email, phone, phone_href,
      github_url, linkedin_url, gitlab_url,
      role_fr, role_en, location_fr, location_en,
      nationality_fr, nationality_en, availability_fr, availability_en,
      pitch_fr, pitch_en, bio1_fr, bio1_en, bio2_fr, bio2_en,
      portrait_path, cv_fr_path, cv_en_path
    ) VALUES (
      1, ${p.fullName}, ${p.initials}, ${p.email}, ${p.phone}, ${p.phoneHref},
      ${p.githubUrl}, ${p.linkedinUrl}, ${p.gitlabUrl},
      ${p.role.fr}, ${p.role.en}, ${p.location.fr}, ${p.location.en},
      ${p.nationality.fr}, ${p.nationality.en},
      ${p.availability.fr}, ${p.availability.en},
      ${p.pitch.fr}, ${p.pitch.en},
      ${p.bio1.fr}, ${p.bio1.en}, ${p.bio2.fr}, ${p.bio2.en},
      ${p.portrait}, ${p.cvFile.fr}, ${p.cvFile.en}
    )
  `;

  for (const [index, item] of c.experiences.entries()) {
    await sql`
      INSERT INTO experiences
        (role_fr, role_en, company, place_fr, place_en,
         period_fr, period_en, is_current, tasks_fr, tasks_en, stack, sort_order)
      VALUES
        (${item.role.fr}, ${item.role.en}, ${item.company},
         ${item.place.fr}, ${item.place.en},
         ${item.period.fr}, ${item.period.en}, ${item.current},
         ${item.tasks.fr}, ${item.tasks.en}, ${item.stack}, ${index + 1})
    `;
  }

  for (const [index, item] of c.education.entries()) {
    await sql`
      INSERT INTO education
        (title_fr, title_en, school_fr, school_en,
         period_fr, period_en, detail_fr, detail_en, sort_order)
      VALUES
        (${item.title.fr}, ${item.title.en},
         ${item.school.fr}, ${item.school.en},
         ${item.period.fr}, ${item.period.en},
         ${item.detail.fr}, ${item.detail.en}, ${index + 1})
    `;
  }

  for (const [index, item] of c.projects.entries()) {
    await sql`
      INSERT INTO projects
        (featured, title_fr, title_en, role_fr, role_en,
         summary_fr, summary_en, highlights_fr, highlights_en,
         stack, repo_url, demo_url, sort_order)
      VALUES
        (${item.featured}, ${item.title.fr}, ${item.title.en},
         ${item.role.fr}, ${item.role.en},
         ${item.summary.fr}, ${item.summary.en},
         ${item.highlights.fr}, ${item.highlights.en},
         ${item.stack}, ${item.repo}, ${item.demo}, ${index + 1})
    `;
  }

  for (const [groupIndex, group] of c.skillGroups.entries()) {
    const rows = (await sql`
      INSERT INTO skill_groups (title_fr, title_en, icon, sort_order)
      VALUES (${group.title.fr}, ${group.title.en}, ${group.icon}, ${groupIndex + 1})
      RETURNING id
    `) as Record<string, unknown>[];

    // L'identifiant vient de la base : ceux du contenu statique sont calculés
    // côté client et ne correspondent pas à la séquence Postgres.
    const groupId = Number(rows[0].id);

    for (const [skillIndex, skill] of group.skills.entries()) {
      await sql`
        INSERT INTO skills (group_id, name, level, sort_order)
        VALUES (${groupId}, ${skill.name}, ${skill.level}, ${skillIndex + 1})
      `;
    }
  }

  const lists = [...c.languages, ...c.softSkills, ...c.interests];
  for (const [index, item] of lists.entries()) {
    await sql`
      INSERT INTO list_items (kind, label_fr, label_en, detail_fr, detail_en, sort_order)
      VALUES (${item.kind}, ${item.label.fr}, ${item.label.en},
              ${item.detail.fr}, ${item.detail.en}, ${index + 1})
    `;
  }
}
