import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readSession } from '../_lib/auth.js';
import {
  asBoolean,
  asEnum,
  asInteger,
  asLocalizedList,
  asLocalizedText,
  asText,
  asTextArray,
  asUrl,
  fail,
  handleError,
  json,
  readJsonBody,
} from '../_lib/http.js';
import {
  createEducation,
  createExperience,
  createListItem,
  createProject,
  createSkill,
  createSkillGroup,
  deleteRow,
  insertMedia,
  isTableKey,
  readContentBundle,
  reorder,
  setProfileMedia,
  updateEducation,
  updateExperience,
  updateListItem,
  updateProfile,
  updateProject,
  updateSkill,
  updateSkillGroup,
  type MediaSlot,
  type TableKey,
} from '../_lib/repository.js';
import { LIST_KINDS, SKILL_ICONS } from '../../src/content/types.js';

// Toutes les écritures du site :
//   GET    /api/admin/content           contenu complet, sans cache
//   PUT    /api/admin/profile           informations et textes
//   POST   /api/admin/media             téléversement photo ou CV
//   DELETE /api/admin/media/:slot       retour au fichier statique
//   POST   /api/admin/reorder           nouvel ordre d'une liste
//   POST   /api/admin/:ressource        création
//   PUT    /api/admin/:ressource/:id    modification
//   DELETE /api/admin/:ressource/:id    suppression
//
// Le segment attrape-tout [...path] les regroupe dans une seule fonction, le
// palier gratuit de Vercel plafonnant leur nombre.
// La session est vérifiée une fois avant tout aiguillage : impossible
// d'oublier une route.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const session = await readSession(req);
    if (!session) {
      return fail(res, 401, 'NOT_AUTHENTICATED', 'Session absente ou expirée.');
    }

    // req.query.path (peuplé par Vercel depuis le nom de fichier [...path].ts)
    // s'est révélé vide en production pour des requêtes qui contenaient
    // pourtant bien un sous-chemin. req.url, lui, est toujours fiable : les
    // segments en sont donc extraits directement plutôt que de dépendre du
    // routage dynamique de la plateforme.
    const pathname = (req.url ?? '').split('?')[0];
    const afterPrefix = pathname.replace(/^\/api\/admin\/?/, '');
    const segments = afterPrefix ? afterPrefix.split('/').filter(Boolean).map(decodeURIComponent) : [];
    const [first, second] = segments;
    const method = req.method ?? 'GET';

    if (first === 'content' && method === 'GET') {
      const bundle = await readContentBundle();
      return json(res, 200, bundle ?? null);
    }

    if (first === 'profile' && method === 'PUT') {
      return await handleProfile(req, res);
    }

    if (first === 'media') {
      if (method === 'POST') return await handleMediaUpload(req, res);
      if (method === 'DELETE') return await handleMediaClear(res, second);
      return fail(res, 405, 'METHOD_NOT_ALLOWED', 'POST ou DELETE attendu.');
    }

    if (first === 'reorder' && method === 'POST') {
      return await handleReorder(req, res);
    }

    if (first && isTableKey(first)) {
      return await handleResource(req, res, first, second);
    }

    return fail(res, 404, 'UNKNOWN_ROUTE', `Route « ${segments.join('/')} » inconnue.`);
  } catch (error) {
    handleError(res, error);
  }
}

async function handleProfile(req: VercelRequest, res: VercelResponse) {
  const body = readJsonBody(req);

  await updateProfile({
    fullName: asText(body.fullName, 200),
    initials: asText(body.initials, 8),
    email: asText(body.email, 320),
    phone: asText(body.phone, 40),
    phoneHref: asText(body.phoneHref, 40),
    githubUrl: asUrl(body.githubUrl),
    linkedinUrl: asUrl(body.linkedinUrl),
    gitlabUrl: asUrl(body.gitlabUrl),
    role: asLocalizedText(body.role, 120),
    location: asLocalizedText(body.location, 200),
    nationality: asLocalizedText(body.nationality, 120),
    availability: asLocalizedText(body.availability, 200),
    pitch: asLocalizedText(body.pitch, 1200),
    bio1: asLocalizedText(body.bio1, 2500),
    bio2: asLocalizedText(body.bio2, 2500),
  });

  json(res, 200, { ok: true });
}

const MEDIA_SLOTS: readonly MediaSlot[] = ['portrait', 'cv_fr', 'cv_en'];

const SLOT_MIME: Record<MediaSlot, string[]> = {
  portrait: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
  cv_fr: ['application/pdf'],
  cv_en: ['application/pdf'],
};

// Vercel refuse un corps au-delà de 4,5 Mo. Le base64 alourdit d'un tiers :
// 3 Mo de fichier font ~4 Mo transmis. Au-delà, la plateforme couperait la
// requête avant ce code et l'erreur serait incompréhensible côté interface.
const MAX_FILE_BYTES = 3 * 1024 * 1024;

async function handleMediaUpload(req: VercelRequest, res: VercelResponse) {
  const body = readJsonBody(req);

  const slot = body.slot as MediaSlot;
  if (!MEDIA_SLOTS.includes(slot)) {
    return fail(res, 400, 'INVALID_SLOT', 'Emplacement attendu : portrait, cv_fr ou cv_en.');
  }

  const mimeType = asText(body.mimeType, 100);
  if (!SLOT_MIME[slot].includes(mimeType)) {
    return fail(
      res,
      415,
      'UNSUPPORTED_TYPE',
      `Type de fichier refusé pour « ${slot} ». Attendu : ${SLOT_MIME[slot].join(', ')}.`,
    );
  }

  const dataBase64 = typeof body.dataBase64 === 'string' ? body.dataBase64 : '';
  if (!dataBase64) {
    return fail(res, 400, 'EMPTY_FILE', 'Aucun contenu de fichier reçu.');
  }

  const byteSize = Buffer.byteLength(dataBase64, 'base64');
  if (byteSize > MAX_FILE_BYTES) {
    return fail(
      res,
      413,
      'FILE_TOO_LARGE',
      `Fichier de ${(byteSize / 1024 / 1024).toFixed(1)} Mo : la limite est de 3 Mo.`,
    );
  }

  // Les séparateurs sont retirés pour que le nom ne désigne jamais un chemin.
  const filename = asText(body.filename, 160).replace(/[/\\]/g, '_') || 'fichier';

  const mediaId = await insertMedia(filename, mimeType, dataBase64);
  await setProfileMedia(slot, mediaId);

  json(res, 201, { id: mediaId, url: `/api/media/${mediaId}`, byteSize });
}

// Détache le média : le chemin statique reprend la main.
async function handleMediaClear(res: VercelResponse, slot: string | undefined) {
  if (!slot || !MEDIA_SLOTS.includes(slot as MediaSlot)) {
    return fail(res, 400, 'INVALID_SLOT', 'Emplacement attendu : portrait, cv_fr ou cv_en.');
  }
  await setProfileMedia(slot as MediaSlot, null);
  json(res, 200, { ok: true });
}

async function handleReorder(req: VercelRequest, res: VercelResponse) {
  const body = readJsonBody(req);
  const resource = asText(body.resource, 40);

  if (!isTableKey(resource)) {
    return fail(res, 400, 'UNKNOWN_RESOURCE', `Ressource « ${resource} » inconnue.`);
  }

  const ids = Array.isArray(body.ids)
    ? body.ids.map((value) => asInteger(value, 0)).filter((value) => value > 0)
    : [];

  if (ids.length === 0) {
    return fail(res, 400, 'EMPTY_ORDER', 'Aucun identifiant fourni.');
  }

  await reorder(resource, ids);
  json(res, 200, { ok: true });
}

async function handleResource(
  req: VercelRequest,
  res: VercelResponse,
  resource: TableKey,
  idSegment: string | undefined,
) {
  const method = req.method ?? 'GET';

  if (method === 'DELETE') {
    const id = asInteger(idSegment, 0);
    if (id <= 0) return fail(res, 400, 'INVALID_ID', 'Identifiant manquant ou invalide.');
    await deleteRow(resource, id);
    return json(res, 200, { ok: true });
  }

  if (method !== 'POST' && method !== 'PUT') {
    return fail(res, 405, 'METHOD_NOT_ALLOWED', 'POST, PUT ou DELETE attendu.');
  }

  const body = readJsonBody(req);
  const isUpdate = method === 'PUT';
  const id = isUpdate ? asInteger(idSegment, 0) : 0;

  if (isUpdate && id <= 0) {
    return fail(res, 400, 'INVALID_ID', 'Identifiant manquant ou invalide.');
  }

  switch (resource) {
    case 'experiences': {
      const item = {
        role: asLocalizedText(body.role, 200),
        company: asText(body.company, 200),
        place: asLocalizedText(body.place, 200),
        period: asLocalizedText(body.period, 120),
        current: asBoolean(body.current),
        tasks: asLocalizedList(body.tasks),
        stack: asTextArray(body.stack, 40, 80),
      };
      if (isUpdate) {
        await updateExperience(id, item);
        return json(res, 200, { id });
      }
      return json(res, 201, { id: await createExperience(item) });
    }

    case 'education': {
      const item = {
        title: asLocalizedText(body.title, 250),
        school: asLocalizedText(body.school, 250),
        period: asLocalizedText(body.period, 120),
        detail: asLocalizedText(body.detail, 1200),
      };
      if (isUpdate) {
        await updateEducation(id, item);
        return json(res, 200, { id });
      }
      return json(res, 201, { id: await createEducation(item) });
    }

    case 'projects': {
      const item = {
        featured: asBoolean(body.featured),
        title: asLocalizedText(body.title, 250),
        role: asLocalizedText(body.role, 150),
        summary: asLocalizedText(body.summary, 1500),
        highlights: asLocalizedList(body.highlights),
        stack: asTextArray(body.stack, 40, 80),
        repo: asUrl(body.repo),
        demo: asUrl(body.demo),
      };
      if (isUpdate) {
        await updateProject(id, item);
        return json(res, 200, { id });
      }
      return json(res, 201, { id: await createProject(item) });
    }

    case 'skill-groups': {
      const item = {
        title: asLocalizedText(body.title, 120),
        icon: asEnum(body.icon, SKILL_ICONS),
      };
      if (isUpdate) {
        await updateSkillGroup(id, item);
        return json(res, 200, { id });
      }
      return json(res, 201, { id: await createSkillGroup(item) });
    }

    case 'skills': {
      const item = {
        name: asText(body.name, 120),
        level: asEnum(body.level, ['project', 'learning'] as const),
      };
      if (isUpdate) {
        await updateSkill(id, item);
        return json(res, 200, { id });
      }
      const groupId = asInteger(body.groupId, 0);
      if (groupId <= 0) {
        return fail(res, 400, 'MISSING_GROUP', 'Une compétence doit appartenir à un groupe.');
      }
      return json(res, 201, { id: await createSkill(groupId, item) });
    }

    case 'list-items': {
      const item = {
        kind: asEnum(body.kind, LIST_KINDS),
        label: asLocalizedText(body.label, 150),
        detail: asLocalizedText(body.detail, 150),
      };
      if (isUpdate) {
        await updateListItem(id, item);
        return json(res, 200, { id });
      }
      return json(res, 201, { id: await createListItem(item) });
    }
  }
}
