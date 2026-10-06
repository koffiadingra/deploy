// npm run test:db — exécute le schéma et le code d'accès RÉELS contre un vrai
// PostgreSQL en mémoire. Aucune requête n'est recopiée ici : un test qui
// réécrit la requête qu'il vérifie ne vérifie rien.

import { randomBytes } from 'node:crypto';

const ok = (label) => console.log(`  \x1b[32m✓\x1b[0m ${label}`);
let failures = 0;

function check(condition, label, detail) {
  if (condition) {
    ok(label);
  } else {
    failures += 1;
    console.log(`  \x1b[31m✗\x1b[0m ${label}`);
    if (detail !== undefined) console.log('      reçu :', detail);
  }
}

let PGlite;
try {
  ({ PGlite } = await import('@electric-sql/pglite'));
} catch {
  console.log('PGlite absent. Installez-le pour lancer ce test :');
  console.log('  npm install -D @electric-sql/pglite');
  process.exit(0);
}

// Reconstruit la requête paramétrée ($1, $2…) à partir du gabarit étiqueté,
// comme le fait le pilote Neon : repository.ts ne voit aucune différence.
function createAdapter(db) {
  const tagged = async (strings, ...values) => {
    const text = strings.reduce(
      (acc, part, index) => acc + part + (index < values.length ? `$${index + 1}` : ''),
      '',
    );
    const result = await db.query(text, values);
    return result.rows;
  };
  tagged.query = async (text, params = []) => (await db.query(text, params)).rows;
  return tagged;
}

const db = await new PGlite();

const { setSqlClient } = await import('../api/_lib/db.ts');
setSqlClient(createAdapter(db));

const { SCHEMA_STATEMENTS } = await import('../api/_lib/schema.ts');
const repo = await import('../api/_lib/repository.ts');
const { hashPassword, verifyPassword } = await import('../api/_lib/auth.ts');
const { fallbackContent } = await import('../src/content/fallback.ts');

// ---------------------------------------------------------------------------
console.log('\nSchéma');
// ---------------------------------------------------------------------------
for (const statement of SCHEMA_STATEMENTS) await db.query(statement);
ok(`${SCHEMA_STATEMENTS.length} instructions appliquées`);

// Idempotence : tout est IF NOT EXISTS, un second passage doit être muet.
for (const statement of SCHEMA_STATEMENTS) await db.query(statement);
ok('schéma rejoué une seconde fois sans erreur');

const tables = await db.query(
  `SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public' ORDER BY table_name`,
);
check(
  tables.rows.length === 9,
  `9 tables créées (${tables.rows.map((r) => r.table_name).join(', ')})`,
  tables.rows.length,
);

// ---------------------------------------------------------------------------
console.log('\nContraintes');
// ---------------------------------------------------------------------------
async function rejects(sqlText, params, label) {
  try {
    await db.query(sqlText, params);
    check(false, label, 'la requête a été ACCEPTÉE');
  } catch {
    ok(label);
  }
}

await db.query(`INSERT INTO profile (id, full_name) VALUES (1, 'Test')`);
await rejects(
  `INSERT INTO profile (id, full_name) VALUES (2, 'Doublon')`,
  [],
  'profile refuse une seconde ligne (CHECK id = 1)',
);
await rejects(
  `INSERT INTO list_items (kind) VALUES ('inconnu')`,
  [],
  'list_items refuse un `kind` hors liste',
);
await rejects(
  `INSERT INTO skills (group_id, name, level) VALUES (1, 'X', 'expert')`,
  [],
  'skills refuse un `level` hors liste',
);
await rejects(
  `INSERT INTO skills (group_id, name) VALUES (9999, 'Orpheline')`,
  [],
  'skills refuse un groupe inexistant (clé étrangère)',
);

// ---------------------------------------------------------------------------
console.log('\nSemis du contenu du CV');
// ---------------------------------------------------------------------------
await db.query('DELETE FROM profile');

// setup.ts étant une fonction serverless, le semis passe par le repository,
// qui reste le code de production.
const p = fallbackContent.profile;
await db.query(
  `INSERT INTO profile (id, full_name, initials, email, phone, phone_href,
     github_url, linkedin_url, gitlab_url, role_fr, role_en, location_fr, location_en,
     nationality_fr, nationality_en, availability_fr, availability_en,
     pitch_fr, pitch_en, bio1_fr, bio1_en, bio2_fr, bio2_en,
     portrait_path, cv_fr_path, cv_en_path)
   VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)`,
  [
    p.fullName, p.initials, p.email, p.phone, p.phoneHref,
    p.githubUrl, p.linkedinUrl, p.gitlabUrl, p.role.fr, p.role.en,
    p.location.fr, p.location.en, p.nationality.fr, p.nationality.en,
    p.availability.fr, p.availability.en, p.pitch.fr, p.pitch.en,
    p.bio1.fr, p.bio1.en, p.bio2.fr, p.bio2.en,
    p.portrait, p.cvFile.fr, p.cvFile.en,
  ],
);

for (const item of fallbackContent.experiences) await repo.createExperience(item);
for (const item of fallbackContent.education) await repo.createEducation(item);
for (const item of fallbackContent.projects) await repo.createProject(item);
for (const group of fallbackContent.skillGroups) {
  const groupId = await repo.createSkillGroup({ title: group.title, icon: group.icon });
  for (const skill of group.skills) await repo.createSkill(groupId, skill);
}
for (const item of [
  ...fallbackContent.languages,
  ...fallbackContent.softSkills,
  ...fallbackContent.interests,
]) {
  await repo.createListItem(item);
}
ok('contenu du CV inséré via le code de production');

// ---------------------------------------------------------------------------
console.log('\nLecture du contenu');
// ---------------------------------------------------------------------------
const bundle = await repo.readContentBundle();

check(bundle !== null, 'readContentBundle renvoie un paquet');
check(
  bundle.experiences.length === fallbackContent.experiences.length,
  `${bundle.experiences.length} expérience(s)`,
);
check(
  bundle.projects.length === fallbackContent.projects.length,
  `${bundle.projects.length} projets`,
);
check(
  bundle.skillGroups.length === fallbackContent.skillGroups.length,
  `${bundle.skillGroups.length} groupes de compétences`,
);

const totalSkills = bundle.skillGroups.reduce((n, g) => n + g.skills.length, 0);
const expectedSkills = fallbackContent.skillGroups.reduce((n, g) => n + g.skills.length, 0);
check(totalSkills === expectedSkills, `${totalSkills} compétences réparties dans leurs groupes`);

check(bundle.languages.length === 2, `${bundle.languages.length} langues`);
check(bundle.softSkills.length === 3, `${bundle.softSkills.length} savoir-être`);
check(bundle.interests.length === 5, `${bundle.interests.length} centres d'intérêt`);

// int8 revient en chaîne avec les pilotes PostgreSQL, et "12" === 12 est faux.
check(
  bundle.experiences.every((e) => typeof e.id === 'number'),
  'les identifiants sont bien convertis en nombres',
  bundle.experiences.map((e) => typeof e.id),
);

const firstExp = bundle.experiences[0];
check(
  firstExp.tasks.fr.length === fallbackContent.experiences[0].tasks.fr.length &&
    firstExp.tasks.fr[0] === fallbackContent.experiences[0].tasks.fr[0],
  `tableau text[] préservé (${firstExp.tasks.fr.length} missions, ordre conservé)`,
);

check(
  bundle.profile.bio1.fr.includes('m’investis') &&
    bundle.profile.bio1.fr.includes('déterminé'),
  'accents et apostrophe typographique préservés',
);

check(
  bundle.profile.portrait === '/portrait.png',
  'portrait : chemin statique tant qu’aucun fichier n’est téléversé',
  bundle.profile.portrait,
);

// ---------------------------------------------------------------------------
console.log('\nMédias');
// ---------------------------------------------------------------------------
const originalBytes = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  randomBytes(4096),
]);
const mediaId = await repo.insertMedia(
  'photo.png',
  'image/png',
  originalBytes.toString('base64'),
);
const stored = await repo.readMedia(mediaId);
const roundTripped = Buffer.from(stored.dataBase64, 'base64');

check(roundTripped.equals(originalBytes), `aller-retour binaire exact (${originalBytes.length} octets)`);
check(stored.byteSize === originalBytes.length, 'taille enregistrée correcte', stored.byteSize);
check(stored.mimeType === 'image/png', 'type MIME conservé');

await repo.setProfileMedia('portrait', mediaId);
const withMedia = await repo.readProfile();
check(
  withMedia.portrait === `/api/media/${mediaId}`,
  'le portrait téléversé prend le pas sur le chemin statique',
  withMedia.portrait,
);

// ON DELETE SET NULL doit faire retomber sur le statique, pas laisser une URL morte.
await db.query('DELETE FROM media WHERE id = $1', [mediaId]);
const afterDelete = await repo.readProfile();
check(
  afterDelete.portrait === '/portrait.png',
  'média supprimé : retour automatique au chemin statique',
  afterDelete.portrait,
);

// ---------------------------------------------------------------------------
console.log('\nRéordonnancement et suppression');
// ---------------------------------------------------------------------------
const before = (await repo.readProjects()).map((x) => x.id);
const shuffled = [...before].reverse();
await repo.reorder('projects', shuffled);
const after = (await repo.readProjects()).map((x) => x.id);
check(
  JSON.stringify(after) === JSON.stringify(shuffled),
  `ordre réécrit en une requête (${before.length} projets inversés)`,
  after,
);

const groupToDelete = (await repo.readSkillGroups())[0];
const skillCount = groupToDelete.skills.length;
await repo.deleteRow('skill-groups', groupToDelete.id);
const orphans = await db.query('SELECT count(*)::int AS n FROM skills WHERE group_id = $1', [
  groupToDelete.id,
]);
check(
  orphans.rows[0].n === 0,
  `CASCADE : les ${skillCount} compétences du groupe supprimé ont suivi`,
  orphans.rows[0].n,
);

// ---------------------------------------------------------------------------
console.log('\nMots de passe');
// ---------------------------------------------------------------------------
const hash = hashPassword('MotDePasseAssezLong!2026');
check(!hash.includes('MotDePasse'), 'le mot de passe en clair n’apparaît pas dans l’empreinte');
check(verifyPassword('MotDePasseAssezLong!2026', hash), 'le bon mot de passe est accepté');
check(!verifyPassword('MotDePasseAssezLong!2027', hash), 'un mot de passe faux est refusé');
check(!verifyPassword('', hash), 'un mot de passe vide est refusé');
check(
  hashPassword('identique') !== hashPassword('identique'),
  'deux empreintes du même mot de passe diffèrent (sel aléatoire)',
);

// ---------------------------------------------------------------------------
console.log(
  failures === 0
    ? '\n\x1b[32mTous les contrôles passent.\x1b[0m\n'
    : `\n\x1b[31m${failures} contrôle(s) en échec.\x1b[0m\n`,
);
process.exit(failures === 0 ? 0 : 1);
