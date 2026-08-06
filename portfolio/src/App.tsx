import { LanguageProvider } from './i18n/LanguageProvider';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

/**
 * Racine de l'application.
 *
 * <LanguageProvider> enveloppe tout : chaque section appelle useI18n()
 * et se re-rend automatiquement au changement de langue. Aucun texte
 * n'est ecrit en dur dans les composants.
 */
export default function App() {
  return (
    <LanguageProvider>
      {/* Lien d'evitement : premiere cible du clavier, permet de sauter
          la navigation. Invisible tant qu'il n'a pas le focus.
          Doc : https://www.w3.org/WAI/WCAG22/Techniques/general/G1 */}
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
    </LanguageProvider>
  );
}
