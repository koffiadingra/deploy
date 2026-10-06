import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isDatabaseConfigured } from './_lib/db';
import { readContentBundle } from './_lib/repository';
import { handleError, json, rejectMethod } from './_lib/http';

// GET /api/content — contenu public, sans authentification.
// Mise en cache CDN 60 s, puis ancienne réponse servie pendant le
// rafraîchissement : une visite ordinaire ne touche pas la base, au prix d'une
// minute de latence après une modification.
// Répond 204 si la base n'est pas configurée ou si /api/setup n'a jamais été
// lancé : le site affiche alors son contenu de repli, ce n'est pas une panne.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (rejectMethod(req, res, ['GET'])) return;

  try {
    if (!isDatabaseConfigured()) {
      res.status(204).end();
      return;
    }

    const bundle = await readContentBundle();
    if (!bundle) {
      res.status(204).end();
      return;
    }

    json(res, 200, bundle, 'public, s-maxage=60, stale-while-revalidate=600');
  } catch (error) {
    handleError(res, error);
  }
}
