// Comme dev-server.mjs, mais sans PGlite : getSql() utilise DATABASE_URL tel
// quel, donc ce serveur parle à la vraie base Neon décrite dans .env.
// Lancer avec : node --env-file=.env scripts/dev-server-live.mjs

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const PORT = Number(process.env.PORT ?? 4300);
const DIST = process.env.DIST_DIR ?? join(process.cwd(), 'dist');

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/ est absent. Lancez d’abord : npm run build');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL est absente. Lancez avec : node --env-file=.env scripts/dev-server-live.mjs');
  process.exit(1);
}

const handlers = {
  setup: (await import('../api/setup.ts')).default,
  content: (await import('../api/content.ts')).default,
  auth: (await import('../api/auth/[action].ts')).default,
  admin: (await import('../api/admin/[...path].ts')).default,
  media: (await import('../api/media/[id].ts')).default,
};

function adapt(req, res, query, body) {
  req.query = query;
  req.body = body;
  req.cookies = Object.fromEntries(
    (req.headers.cookie ?? '')
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const i = part.indexOf('=');
        return [part.slice(0, i), decodeURIComponent(part.slice(i + 1))];
      }),
  );

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.send = (payload) => {
    if (payload === undefined || payload === null) return res.end();
    res.end(Buffer.isBuffer(payload) ? payload : String(payload));
    return res;
  };
  res.json = (payload) => {
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify(payload));
  };
  return [req, res];
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
};

async function readBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return undefined;
  const text = Buffer.concat(chunks).toString('utf8');
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  try {
    if (path.startsWith('/api/')) {
      const body = await readBody(req);
      const query = Object.fromEntries(url.searchParams);
      const rest = path.slice('/api/'.length).split('/').filter(Boolean);

      if (rest[0] === 'setup') return handlers.setup(...adapt(req, res, query, body));
      if (rest[0] === 'content') return handlers.content(...adapt(req, res, query, body));
      if (rest[0] === 'auth') {
        return handlers.auth(...adapt(req, res, { ...query, action: rest[1] }, body));
      }
      if (rest[0] === 'media') return handlers.media(...adapt(req, res, { ...query, id: rest[1] }, body));
      if (rest[0] === 'admin') {
        return handlers.admin(...adapt(req, res, { ...query, path: rest.slice(1) }, body));
      }

      res.statusCode = 404;
      return res.end('{"error":{"code":"NOT_FOUND","message":"Route inconnue."}}');
    }

    const safe = normalize(path).replace(/^(\.\.[/\\])+/, '');
    const candidate = join(DIST, safe);
    const file = existsSync(candidate) && extname(candidate) ? candidate : join(DIST, 'index.html');

    const content = await readFile(file);
    res.setHeader('Content-Type', MIME[extname(file)] ?? 'application/octet-stream');
    res.end(content);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Erreur serveur');
  }
});

server.listen(PORT, () => {
  console.log(`\n  Site      http://localhost:${PORT}`);
  console.log(`  Admin     http://localhost:${PORT}/admin`);
  console.log(`  Base      Neon (réelle) — DATABASE_URL de .env\n`);
});
