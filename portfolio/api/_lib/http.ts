import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseNotConfiguredError } from './db';

export function json(
  res: VercelResponse,
  status: number,
  body: unknown,
  cacheControl = 'no-store',
): void {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', cacheControl);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(status).send(JSON.stringify(body));
}

export function fail(
  res: VercelResponse,
  status: number,
  code: string,
  message: string,
): void {
  json(res, status, { error: { code, message } });
}

// Répond 405 si la méthode ne convient pas. Renvoie `true` quand la requête a
// déjà été traitée, pour que l'appelant arrête là.
export function rejectMethod(
  req: VercelRequest,
  res: VercelResponse,
  allowed: string[],
): boolean {
  if (allowed.includes(req.method ?? '')) return false;
  res.setHeader('Allow', allowed.join(', '));
  fail(res, 405, 'METHOD_NOT_ALLOWED', `Méthode ${req.method} non autorisée ici.`);
  return true;
}

// Le détail de l'erreur part dans les journaux Vercel, jamais dans la réponse :
// un message Postgres peut révéler des noms de tables ou de colonnes.
export function handleError(res: VercelResponse, error: unknown): void {
  if (error instanceof DatabaseNotConfiguredError) {
    fail(res, 503, 'DB_NOT_CONFIGURED', error.message);
    return;
  }

  console.error('[api] erreur non gérée :', error);
  fail(
    res,
    500,
    'INTERNAL_ERROR',
    'Erreur interne. Consultez les journaux de la fonction sur Vercel.',
  );
}

// Vercel analyse déjà le JSON dans req.body ; le cas chaîne couvre une requête
// sans en-tête Content-Type.
export function readJsonBody<T = Record<string, unknown>>(req: VercelRequest): T {
  const body = req.body;
  if (body == null) return {} as T;
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as T;
    } catch {
      return {} as T;
    }
  }
  return body as T;
}

// --- Lecture défensive des champs entrants ---------------------------------
// Tout ce qui vient du réseau peut être absent, d'un autre type ou malveillant,
// y compris depuis l'interface d'administration. Ces fonctions ramènent chaque
// valeur au type attendu avant qu'elle n'approche la base.

export function asText(value: unknown, maxLength = 4000): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export function asTextArray(value: unknown, maxItems = 40, maxLength = 2000): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => asText(entry, maxLength))
    .filter((entry) => entry.length > 0)
    .slice(0, maxItems);
}

export function asBoolean(value: unknown): boolean {
  return value === true;
}

export function asInteger(value: unknown, fallback = 0): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

// Hors liste, retombe sur la première valeur autorisée.
export function asEnum<T extends string>(value: unknown, allowed: readonly T[]): T {
  return allowed.includes(value as T) ? (value as T) : allowed[0];
}

export function asLocalizedText(
  value: unknown,
  maxLength = 4000,
): { fr: string; en: string } {
  const source = (value ?? {}) as Record<string, unknown>;
  return {
    fr: asText(source.fr, maxLength),
    en: asText(source.en, maxLength),
  };
}

export function asLocalizedList(value: unknown): { fr: string[]; en: string[] } {
  const source = (value ?? {}) as Record<string, unknown>;
  return {
    fr: asTextArray(source.fr),
    en: asTextArray(source.en),
  };
}

// Rejette tout ce qui n'est pas http(s), notamment `javascript:` : une telle
// URL dans un lien du site exécuterait du script chez le visiteur qui clique.
export function asUrl(value: unknown): string {
  const text = asText(value, 2000);
  if (!text) return '';
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:' ? text : '';
  } catch {
    return '';
  }
}
