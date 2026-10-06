import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// Pilote HTTP de Neon : une requête = un appel HTTPS isolé, sans connexion
// persistante. Un pilote classique (`pg`) ouvrirait une connexion par
// invocation serverless et épuiserait le quota.
// Les requêtes s'écrivent en gabarit étiqueté — sql`... ${valeur}` — pour que
// les valeurs deviennent des paramètres liés. Jamais de concaténation.

let cached: NeonQueryFunction<false, false> | null = null;

// Injection de dépendance pour les tests : scripts/test-database.mjs branche
// ici un PostgreSQL local afin d'exécuter repository.ts contre une vraie base.
export function setSqlClient(client: NeonQueryFunction<false, false> | null): void {
  cached = client;
}

// Création paresseuse : le module reste importable sans DATABASE_URL, et une
// variable manquante donne un message clair au lieu d'un plantage au démarrage.
export function getSql(): NeonQueryFunction<false, false> {
  if (cached) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new DatabaseNotConfiguredError(
      'DATABASE_URL est absente. Ajoutez-la dans Vercel > Settings > Environment Variables, ou dans .env.local en développement.',
    );
  }

  cached = neon(url);
  return cached;
}

// Variable d'environnement manquante, à distinguer d'une vraie panne SQL.
export class DatabaseNotConfiguredError extends Error {
  readonly code = 'DB_NOT_CONFIGURED';
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
