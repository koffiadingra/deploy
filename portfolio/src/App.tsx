import { Suspense, lazy } from 'react';
import { LanguageProvider } from './i18n/LanguageProvider';
import { ContentProvider } from './content/ContentProvider';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

// `lazy` place l'admin dans un fichier séparé, téléchargé seulement si l'on
// ouvre /admin : un visiteur ordinaire n'en reçoit rien.
const AdminApp = lazy(() => import('./admin/AdminApp'));

// Deux pages seulement : lire le chemin une fois suffit, sans bibliothèque de
// routage. On passe de l'une à l'autre par un lien ordinaire, donc par un
// chargement complet — l'admin repart d'un état propre.
// vercel.json renvoie /admin vers index.html, sans quoi un accès direct
// donnerait une 404 du serveur statique.
function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.replace(/\/+$/, '') === '/admin';
}

export default function App() {
  if (isAdminRoute()) {
    return (
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center">
            <p className="label">Chargement de l’administration…</p>
          </div>
        }
      >
        <AdminApp />
      </Suspense>
    );
  }

  return (
    <LanguageProvider>
      <ContentProvider>
        {/* Lien d'évitement : première cible du clavier, invisible sans focus. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
        >
          Aller au contenu
        </a>

        <Nav />

        <main id="main">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <Contact />
        </main>

        <Footer />
      </ContentProvider>
    </LanguageProvider>
  );
}
