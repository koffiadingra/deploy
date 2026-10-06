import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './db.js';

// Mots de passe hachés avec scrypt (sel aléatoire par compte), sessions
// portées par un JWT signé dans un cookie HttpOnly + Secure + SameSite=Strict.

const COOKIE_NAME = 'portfolio_session';
const SESSION_SECONDS = 60 * 60 * 8; // 8 heures

// N = 2^15 : compromis usuel entre résistance au forçage et temps de réponse.
const SCRYPT_N = 32768;
const SCRYPT_r = 8;
const SCRYPT_p = 1;
const KEY_LENGTH = 64;
// scrypt exige ~128 × N × r octets : la limite Node par défaut (32 Mo) est
// trop basse pour N = 32768.
const SCRYPT_MAXMEM = 64 * 1024 * 1024;

// Empreinte au format N:r:p:sel_hex:empreinte_hex.
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_r,
    p: SCRYPT_p,
    maxmem: SCRYPT_MAXMEM,
  });
  return [
    SCRYPT_N,
    SCRYPT_r,
    SCRYPT_p,
    salt.toString('hex'),
    derived.toString('hex'),
  ].join(':');
}

// Compare avec timingSafeEqual, dont la durée ne dépend pas de l'endroit où
// les octets diffèrent : un `===` s'arrêterait au premier écart, et ce délai
// mesurable permettrait de deviner l'empreinte octet par octet.
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(':');
  if (parts.length !== 5) return false;

  const [n, r, p, saltHex, hashHex] = parts;
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');

  let derived: Buffer;
  try {
    derived = scryptSync(password, salt, expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: SCRYPT_MAXMEM,
    });
  } catch {
    return false;
  }

  // timingSafeEqual lève si les longueurs diffèrent.
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'AUTH_SECRET est absente ou trop courte (32 caractères minimum). Générez-la avec : openssl rand -base64 48',
    );
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: number;
  email: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(payload.userId))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(secretKey());
}

// `null` si le cookie est absent, altéré ou expiré.
export async function readSession(req: VercelRequest): Promise<SessionPayload | null> {
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    const userId = Number(payload.sub);
    if (!Number.isFinite(userId)) return null;
    return { userId, email: String(payload.email ?? '') };
  } catch {
    return null;
  }
}

export function setSessionCookie(res: VercelResponse, token: string): void {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}`,
  );
}

export function clearSessionCookie(res: VercelResponse): void {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
  );
}

// req.cookies vient du runtime Vercel ; le découpage manuel sert de repli pour
// que le module reste utilisable sans simuler tout l'objet requête.
function readCookie(req: VercelRequest, name: string): string | null {
  const fromRuntime = req.cookies?.[name];
  if (fromRuntime) return fromRuntime;

  const header = req.headers.cookie;
  if (!header) return null;

  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    if (part.slice(0, index).trim() === name) {
      return decodeURIComponent(part.slice(index + 1).trim());
    }
  }
  return null;
}

export async function adminExists(): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`SELECT 1 FROM admin_users LIMIT 1`) as unknown[];
  return rows.length > 0;
}
