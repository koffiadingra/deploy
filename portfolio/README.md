# Portfolio — Koffi Jean Emmanuel Martial ADINGRA

Portfolio bilingue (français / anglais) d'un développeur full-stack.
React 18 + TypeScript + Vite 6 + Tailwind CSS v4.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # vérifie les types puis compile dans build/
npm run typecheck  # types uniquement
npm run preview    # sert le contenu de build/
```

---

## 1. Le correctif de fond : la chaîne de build Tailwind

L'archive d'origine venait d'un export Figma Make. `src/index.css` était un
**CSS Tailwind déjà compilé et figé** (2 557 lignes), et `vite.config.ts` ne
chargeait aucun plugin Tailwind.

Conséquence : toute nouvelle classe utilitaire écrite dans un composant
(`bg-signal`, `mt-32`, n'importe quoi d'absent du fichier gelé) ne produisait
**aucun style**. Le site n'était plus modifiable.

Correctif :

| Avant | Après |
|---|---|
| `plugins: [react()]` | `plugins: [react(), tailwindcss()]` |
| `import './index.css'` (artefact compilé) | `import './styles/globals.css'` (source) |
| `src/index.css` figé | supprimé — regénéré à chaque build |

Référence : <https://tailwindcss.com/docs/installation/using-vite>

---

## 2. Le système bilingue

Context API React, sans librairie externe : deux langues et ~80 chaînes ne
justifient pas le poids de `i18next`.

```
src/i18n/
├── config.ts             types Lang, Localized<T>, résolution de la langue initiale
├── ui.ts                 dictionnaire des textes d'interface (fr / en)
└── LanguageProvider.tsx  Provider + hook useI18n()
```

### Principe clé : impossible d'oublier une traduction

Le français est la référence, l'anglais en dérive **par le typage** :

```ts
const fr = { 'nav.home': 'Accueil', /* ... */ } as const;
export type UiKey = keyof typeof fr;             // union des clés françaises
const en: Record<UiKey, string> = { /* ... */ }; // TS exige TOUTES les clés
```

Ajoutez une clé en français sans la traduire → `npm run typecheck` échoue.
Ce garde-fou s'est déclenché pendant le développement : un script
d'accentuation avait modifié `'nav.experience'` en `'nav.expérience'`,
TypeScript l'a signalé immédiatement.

> Les **clés** restent en ASCII : ce sont des identifiants, pas du texte affiché.
> Seules les **valeurs** portent des accents.

### Deux fonctions exposées

| Fonction | Usage | Exemple |
|---|---|---|
| `t(clé)` | textes d'interface | `t('nav.projects')` |
| `pick(objet)` | données métier bilingues | `pick(project.summary)` |

`pick` est déclaré avec `function <T>` et non avec une arrow function : dans un
fichier `.tsx`, `<T>(...) => ...` serait interprété comme une balise JSX.

### Langue au premier chargement

1. choix précédent du visiteur (`localStorage`, clé `portfolio.lang`)
2. langue du navigateur (`navigator.language`)
3. français par défaut

À chaque changement, `document.documentElement.lang` est mis à jour — nécessaire
pour les lecteurs d'écran et pour le référencement.

### Ajouter une troisième langue

1. `LANGUAGES = ['fr', 'en', 'es'] as const` dans `config.ts`
2. compléter `LANGUAGE_LABELS`
3. `npm run typecheck` → TypeScript liste tout ce qui manque

---

## 3. Les données

Aucun texte de contenu n'est écrit en dur dans un composant.

```
src/data/
├── profile.ts    coordonnées, langues parlées, savoir-être, centres d'intérêt
├── career.ts     expérience professionnelle + formations
├── projects.ts   projets (2 en vedette, 7 repliés)
└── skills.ts     compétences groupées par usage
```

Chaque fichier indique sa **source** en commentaire (CV page 1, ou ancien
`Projects.tsx`) et signale les points non vérifiés.

### Points à confirmer

Deux CV ont servi de source : la version française (05/08) et la version
anglaise (06/08). Elles ne disent pas exactement la même chose.

| Point | Détail |
|---|---|
| Email | Les **deux** CV écrivent `@epietch.eu`. `epietch.eu` n'est pas un domaine connu, `epitech.eu` l'est et c'est ce qu'utilisait l'ancien site. `@epitech.eu` a été retenu, mais la coquille apparaît deux fois. |
| Téléphone | Les deux CV donnent `+225 05 86 90 36 07` — ancien site : `+225 07 78 90 95 37`. Le CV a été retenu. |
| Localisation | CV français : « Mobilité ». CV anglais : « Wales », au même emplacement, alors que l'adresse reste Bassam. Le site affiche Grand-Bassam et mentionne la mobilité séparément. |
| Niveau d'anglais | CV français : « Niveau scolaire ». CV anglais : « Advanced academic level ». Le CV anglais étant plus récent, c'est lui qui est affiché. |
| Centres d'intérêt | Le CV français cite la biologie moléculaire, le CV anglais ne la cite plus. Elle est conservée. |
| Liens de dépôt | Aucun fourni. Champs `repo` / `demo` vides. |

### CV téléchargeable selon la langue

`profile.cvFile` est un objet `Localized` : le bouton du héros lit
`pick(profile.cvFile)`, donc un visiteur en anglais télécharge la version
anglaise, un visiteur en français la version française.

### Ajouter un lien de dépôt

Renseignez le champ dans `src/data/projects.ts` — le bouton apparaît tout seul :

```ts
{ id: 'facturation', repo: 'https://github.com/...', demo: 'https://...' }
```

---

## 4. Deux changements de comportement assumés

**Les pourcentages de compétences ont été supprimés.** L'ancien site affichait
« Vue.js 98 %, React 95 % ». Ces chiffres ne reposaient sur aucune mesure et,
sur un profil junior, ils se retournent contre le candidat en entretien.
Remplacés par deux états défendables : *Utilisé en projet* / *En apprentissage*.

**Le formulaire de contact n'envoyait rien.** Il affichait « Message envoyé avec
succès ! » sans faire la moindre requête. Il construit désormais un lien
`mailto:` et ouvre la messagerie du visiteur, avec `encodeURIComponent` sur le
sujet et le corps — sans quoi un `&` ou un saut de ligne tronquerait l'URL.

Pour un envoi réellement automatique, brancher un service tiers (Formspree,
EmailJS, Resend) ou une petite route serveur dans `handleSubmit`
(`src/components/Contact.tsx`).

---

## 5. Le design

Direction : **panneau de maintenance d'une machine industrielle**. Pas de néon
cyberpunk, pas de dégradés violets.

Tous les tokens sont déclarés dans `src/styles/globals.css`, bloc `@theme`.
En Tailwind v4, une variable déclarée là devient automatiquement une classe :
`--color-signal` → `bg-signal`, `text-signal`, `border-signal`.

| Token | Valeur | Rôle |
|---|---|---|
| `--color-ink` | `#131110` | fond, châssis |
| `--color-panel` | `#1b1917` | surface surélevée |
| `--color-inset` | `#232120` | surface creusée |
| `--color-signal` | `#ff6a13` | orange sécurité : action, lien, accent |
| `--color-live` | `#56d6a0` | LED d'état « en ligne » |
| `--font-display` | Saira Condensed | titres, style étiquette gravée |
| `--font-sans` | IBM Plex Sans | texte courant |
| `--font-mono` | IBM Plex Mono | légendes, données, étiquettes |
| `--ease-servo` | `cubic-bezier(.2,0,0,1)` | course de servomoteur, jamais de rebond |

---

## 6. Le robot — `src/components/Robot.tsx`

Une tête SVG dont les yeux suivent le curseur. Trois comportements :

1. **suivi** — les yeux se déplacent, la tête s'incline de ±5°
2. **veille** — après 4 s sans mouvement, balayage sinusoïdal lent
3. **clignement** — un volet passe devant la visière à intervalle irrégulier

### Décisions techniques

**Aucun `state` React pour l'animation.** Un `setState` par `pointermove`
déclencherait un rendu React complet à ~120 Hz. L'écriture se fait directement
dans le DOM via des `ref`, à l'intérieur d'une boucle `requestAnimationFrame`.
React gère la structure, la boucle gère le mouvement.
<https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref>

**Lissage par interpolation linéaire.**

```js
position += (cible - position) * 0.12;
```

La position rattrape la cible au lieu de l'atteindre d'un bloc. C'est ce qui
donne la course légèrement molle d'un servomoteur.

**`transform` en attribut SVG, pas en CSS.** `rotate(angle, cx, cy)` prend son
centre en paramètre, ce qui évite de gérer `transform-origin` / `transform-box`
selon les navigateurs.
<https://developer.mozilla.org/fr/docs/Web/SVG/Attribute/transform>

**Nettoyage.** Le `return` de l'effet annule la frame et retire les écouteurs.
Sans lui, la boucle continuerait après le démontage.

---

## 7. Accessibilité

| Point | Mise en œuvre |
|---|---|
| `prefers-reduced-motion` | coupé **en CSS et en JS** — la boucle du robot ne démarre pas |
| Focus clavier | `:focus-visible` avec contour orange sur 2 px |
| Lien d'évitement | première cible du clavier, saute la navigation |
| Langue du document | `<html lang>` synchronisé avec la langue choisie |
| Sélecteur de langue | `role="group"` + `aria-pressed` |
| Zone d'état du formulaire | `role="status"` + `aria-live="polite"` |
| Décorations | `aria-hidden="true"` (rail, tirets, bandes) |

---

## 8. Résultats mesurés

```
npx tsc -b     → 0 erreur
npm run build  → ✓ built in 4.5s
```

| | Avant | Après |
|---|---|---|
| JS (gzip) | 117,21 kB | **62,51 kB** |
| Dépendances npm | 200 paquets | **55 paquets** |

Les ~50 dépendances Radix UI et `motion` ont été retirées : le dossier
`components/ui/` n'était plus utilisé, et tout le mouvement passe par du CSS et
`requestAnimationFrame`.

---

## 9. Déploiement

Le projet est déjà sur Vercel. Réglages :

- **Build command** : `npm run build`
- **Output directory** : `build`

Le CV (`public/CV-….pdf`) et le portrait (`public/portrait.png`) sont servis
statiquement.

---

## Arborescence

```
src/
├── App.tsx                    assemblage des sections
├── main.tsx                   point d'entrée
├── styles/globals.css         tokens @theme + composants + reduced-motion
├── i18n/                      config, dictionnaire, provider
├── data/                      profile, career, projects, skills
├── hooks/
│   ├── usePrefersReducedMotion.ts
│   └── useActiveSection.ts    IntersectionObserver
└── components/
    ├── Robot.tsx              élément signature
    ├── Nav.tsx                barre + rail d'axe latéral
    ├── LanguageSwitch.tsx
    ├── Ui.tsx                 SectionHeader, Tag, Brackets
    ├── Hero.tsx  About.tsx  Experience.tsx
    ├── Projects.tsx  Skills.tsx  Education.tsx
    └── Contact.tsx  Footer.tsx
```
