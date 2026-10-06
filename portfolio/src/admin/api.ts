import type { ContentBundle } from '../content/types';

// Toutes les requêtes passent par ici pour trois raisons :
//  - `credentials: 'same-origin'` joint le cookie de session, sans quoi
//    chaque écriture reviendrait en 401 ;
//  - une erreur HTTP devient une ApiError porteuse du message du serveur,
//    affiché tel quel au lieu d'un « une erreur est survenue » ;
//  - le cas 401 est repéré pour renvoyer vers l'écran de connexion.

export class ApiError extends Error {
  // Champs déclarés puis affectés : les propriétés de constructeur génèrent du
  // code à l'exécution, ce que l'option `erasableSyntaxOnly` interdit.
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }

  get isUnauthenticated(): boolean {
    return this.status === 401;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(path, {
    method: options.method ?? 'GET',
    credentials: 'same-origin',
    headers: options.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) return null as T;

  const text = await response.text();
  const payload = text ? safeParse(text) : null;

  if (!response.ok) {
    const error = (payload as { error?: { code?: string; message?: string } } | null)?.error;
    throw new ApiError(
      response.status,
      error?.code ?? 'UNKNOWN',
      error?.message ?? `Erreur ${response.status}.`,
    );
  }

  return payload as T;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const login = (email: string, password: string) =>
  request<{ email: string }>('/api/auth/login', { method: 'POST', body: { email, password } });

export const logout = () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' });

export const whoami = () => request<{ email: string }>('/api/auth/me');

// Sans cache : l'éditeur doit voir l'état réel de la base.
export const fetchAdminContent = () => request<ContentBundle | null>('/api/admin/content');

export const saveProfile = (profile: unknown) =>
  request<{ ok: true }>('/api/admin/profile', { method: 'PUT', body: profile });

export const createItem = (resource: string, item: unknown) =>
  request<{ id: number }>(`/api/admin/${resource}`, { method: 'POST', body: item });

export const updateItem = (resource: string, id: number, item: unknown) =>
  request<{ id: number }>(`/api/admin/${resource}/${id}`, { method: 'PUT', body: item });

export const deleteItem = (resource: string, id: number) =>
  request<{ ok: true }>(`/api/admin/${resource}/${id}`, { method: 'DELETE' });

export const reorderItems = (resource: string, ids: number[]) =>
  request<{ ok: true }>('/api/admin/reorder', { method: 'POST', body: { resource, ids } });

export type MediaSlot = 'portrait' | 'cv_fr' | 'cv_en';

// Envoi en base64 dans un corps JSON plutôt qu'en multipart/form-data, que la
// fonction serverless devrait analyser avec une dépendance supplémentaire. Le
// surpoids d'un tiers est acceptable à cette taille.
export async function uploadMedia(
  slot: MediaSlot,
  file: File,
): Promise<{ id: string; url: string; byteSize: number }> {
  const dataBase64 = await fileToBase64(file);
  return request('/api/admin/media', {
    method: 'POST',
    body: { slot, filename: file.name, mimeType: file.type, dataBase64 },
  });
}

export const clearMedia = (slot: MediaSlot) =>
  request<{ ok: true }>(`/api/admin/media/${slot}`, { method: 'DELETE' });

// Renvoie le contenu en base64, sans le préfixe `data:...;base64,` ajouté par
// readAsDataURL.
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
    reader.onload = () => {
      const result = String(reader.result);
      const comma = result.indexOf(',');
      resolve(comma === -1 ? result : result.slice(comma + 1));
    };
    reader.readAsDataURL(file);
  });
}
