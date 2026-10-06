import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from '../_lib/db';
import {
  clearSessionCookie,
  createSessionToken,
  readSession,
  setSessionCookie,
  verifyPassword,
} from '../_lib/auth';
import { asText, fail, handleError, json, readJsonBody } from '../_lib/http';

// /api/auth/login | logout | me — regroupées via le segment dynamique
// [action], le palier gratuit de Vercel plafonnant le nombre de fonctions.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = String(req.query.action ?? '');

  try {
    switch (action) {
      case 'login':
        return await login(req, res);
      case 'logout':
        return logout(res);
      case 'me':
        return await me(req, res);
      default:
        return fail(res, 404, 'UNKNOWN_ACTION', `Action « ${action} » inconnue.`);
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function login(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return fail(res, 405, 'METHOD_NOT_ALLOWED', 'POST attendu.');
  }

  const body = readJsonBody<{ email?: unknown; password?: unknown }>(req);
  const email = asText(body.email, 320).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return fail(res, 400, 'MISSING_CREDENTIALS', 'Email et mot de passe requis.');
  }

  const sql = getSql();
  const rows = (await sql`
    SELECT id, email, password_hash FROM admin_users WHERE email = ${email}
  `) as Record<string, unknown>[];

  const user = rows[0];

  // Même réponse pour « compte inconnu » et « mot de passe faux » : les
  // distinguer permettrait d'énumérer les adresses existantes.
  const invalid = () =>
    fail(res, 401, 'INVALID_CREDENTIALS', 'Email ou mot de passe incorrect.');

  if (!user) return invalid();
  if (!verifyPassword(password, String(user.password_hash))) return invalid();

  const userId = Number(user.id);
  const token = await createSessionToken({ userId, email: String(user.email) });

  await sql`UPDATE admin_users SET last_login_at = now() WHERE id = ${userId}`;

  setSessionCookie(res, token);
  json(res, 200, { email: String(user.email) });
}

function logout(res: VercelResponse) {
  clearSessionCookie(res);
  json(res, 200, { ok: true });
}

async function me(req: VercelRequest, res: VercelResponse) {
  const session = await readSession(req);
  if (!session) {
    return fail(res, 401, 'NOT_AUTHENTICATED', 'Session absente ou expirée.');
  }
  json(res, 200, { email: session.email });
}
