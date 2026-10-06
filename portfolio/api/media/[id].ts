import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readMedia } from '../_lib/repository.js';
import { fail, handleError, rejectMethod } from '../_lib/http.js';

// GET /api/media/:id — sert un fichier stocké en base (portrait, CV).
// Cache d'un an possible car un identifiant ne désigne jamais deux contenus :
// téléverser crée une nouvelle ligne, donc une nouvelle URL.
// Le type MIME est relu depuis une liste fermée et jamais renvoyé tel quel :
// une valeur inattendue annoncée au navigateur pourrait lui faire exécuter le
// fichier au lieu de l'afficher.

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
  'application/pdf',
]);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (rejectMethod(req, res, ['GET'])) return;

  const id = String(req.query.id ?? '');

  // Évite un aller-retour vers la base pour toute URL fabriquée.
  if (!UUID_PATTERN.test(id)) {
    return fail(res, 400, 'INVALID_ID', 'Identifiant de média invalide.');
  }

  try {
    const media = await readMedia(id);
    if (!media) {
      return fail(res, 404, 'MEDIA_NOT_FOUND', 'Fichier introuvable.');
    }

    const mimeType = ALLOWED_MIME.has(media.mimeType)
      ? media.mimeType
      : 'application/octet-stream';

    const bytes = Buffer.from(media.dataBase64, 'base64');

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', String(bytes.byteLength));
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // `inline` ouvre le PDF dans l'onglet. Le nom est filtré pour qu'un
    // guillemet ou un saut de ligne ne puisse pas forger d'autres en-têtes.
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${media.filename.replace(/["\\\r\n]/g, '')}"`,
    );

    res.status(200).send(bytes);
  } catch (error) {
    handleError(res, error);
  }
}
