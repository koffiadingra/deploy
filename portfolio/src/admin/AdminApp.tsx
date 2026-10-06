import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, LogOut, RefreshCw } from 'lucide-react';
import type { ContentBundle } from '../content/types';
import { ApiError, fetchAdminContent, login, logout, whoami } from './api';
import { ProfileSection } from './sections/ProfileSection';
import {
  EducationSection,
  ExperiencesSection,
  ListsSection,
  ProjectsSection,
  SkillsSection,
} from './sections/ContentSections';
import '../styles/globals.css';

// Trois états : vérification de la session, écran de connexion, panneau
// d'édition.
//
// Rien ici ne protège quoi que ce soit : ce code est téléchargé par le
// navigateur et contournable. La protection est côté serveur, où chaque route
// de /api/admin/* vérifie le cookie. L'écran de connexion sert au confort.
export default function AdminApp() {
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const [content, setContent] = useState<ContentBundle | null>(null);
  const [loadError, setLoadError] = useState('');

  const reload = useCallback(async () => {
    try {
      const bundle = await fetchAdminContent();
      setContent(bundle);
      setLoadError(
        bundle
          ? ''
          : 'La base est vide. Lancez /api/setup pour créer les tables et insérer le contenu du CV.',
      );
    } catch (caught) {
      if (caught instanceof ApiError && caught.isUnauthenticated) {
        setSession(null);
        return;
      }
      setLoadError(caught instanceof Error ? caught.message : 'Chargement impossible.');
    }
  }, []);

  // Le cookie étant HttpOnly, JavaScript ne peut pas le lire : seul le serveur
  // peut dire si la session existe.
  useEffect(() => {
    let active = true;
    whoami()
      .then((user) => {
        if (active) setSession(user);
      })
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (session) void reload();
  }, [session, reload]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="label">Vérification de la session…</p>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onSuccess={setSession} />;
  }

  const handleAuthError = () => setSession(null);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-edge bg-ink/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-5 py-3">
          <h1 className="font-display text-lg uppercase tracking-[0.18em] text-bone">
            Administration
          </h1>
          <span className="hidden font-mono text-[11px] text-faint sm:block">
            {session.email}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              className="inline-flex items-center gap-2 border border-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-signal hover:text-signal"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voir le site
            </a>
            <button
              type="button"
              onClick={() => void reload()}
              className="inline-flex items-center gap-2 border border-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-signal hover:text-signal"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Recharger
            </button>
            <button
              type="button"
              onClick={() => {
                void logout().finally(() => setSession(null));
              }}
              className="inline-flex items-center gap-2 border border-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-signal hover:text-signal"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
        <div className="hazard h-1 w-full" aria-hidden="true" />
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {loadError ? (
          <p role="alert" className="mb-6 border border-signal bg-inset px-4 py-3 text-sm text-signal">
            {loadError}
          </p>
        ) : null}

        {content ? (
          <>
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted">
              Les modifications sont visibles immédiatement sur le site. Le réseau de
              diffusion garde la page en cache une minute : en navigation privée, comptez
              jusqu’à soixante secondes avant de voir le changement.
            </p>

            <ProfileSection
              profile={content.profile}
              onChanged={reload}
              onAuthError={handleAuthError}
            />
            <ExperiencesSection content={content} onChanged={reload} onAuthError={handleAuthError} />
            <ProjectsSection content={content} onChanged={reload} onAuthError={handleAuthError} />
            <SkillsSection content={content} onChanged={reload} onAuthError={handleAuthError} />
            <EducationSection content={content} onChanged={reload} onAuthError={handleAuthError} />
            <ListsSection content={content} onChanged={reload} onAuthError={handleAuthError} />
          </>
        ) : null}
      </main>
    </div>
  );
}

function LoginScreen({ onSuccess }: { onSuccess: (user: { email: string }) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      onSuccess(await login(email, password));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Connexion impossible.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} className="panel w-full max-w-sm p-6">
        <h1 className="font-display text-xl uppercase tracking-[0.18em] text-bone">
          Administration
        </h1>
        <div className="hazard my-4 h-1 w-16" aria-hidden="true" />

        <label htmlFor="login-email" className="label mb-2 block">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-4 w-full border border-edge bg-inset px-3 py-2 text-sm text-bone focus:border-signal focus:outline-none"
        />

        <label htmlFor="login-password" className="label mb-2 block">
          Mot de passe
        </label>
        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-5 w-full border border-edge bg-inset px-3 py-2 text-sm text-bone focus:border-signal focus:outline-none"
        />

        {/* role="alert" fait annoncer l'échec par les lecteurs d'écran. */}
        {error ? (
          <p role="alert" className="mb-4 border border-signal bg-inset px-3 py-2 text-sm text-signal">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-signal px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-bone disabled:opacity-50"
        >
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>

        <a
          href="/"
          className="mt-5 block text-center font-mono text-[11px] text-faint hover:text-signal"
        >
          Retour au site
        </a>
      </form>
    </div>
  );
}
