# Portfolio — Koffi Jean Emmanuel Martial ADINGRA

Portfolio bilingue (français / anglais) d'un développeur full-stack.
React 18 + TypeScript + Vite 6 + Tailwind CSS v4.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # vérifie les types puis compile dans dist/
npm run typecheck  # types uniquement
npm run preview    # sert le contenu de dist/

npm run dev:local  # site + API en local, PostgreSQL en mémoire (sans compte Neon)
npm run test:db    # tests du schéma et des requêtes SQL
```

> L'espace d'administration (`/admin`) et sa base de données sont décrits
> aux sections **10 à 12**.

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

Le projet est déjà sur Vercel. `vercel.json` est versionné à la racine du
projet, donc **aucun réglage à faire dans l'interface** :

```json
{ "framework": "vite", "buildCommand": "npm run build", "outputDirectory": "dist" }
```

Vercel attend `dist` par défaut pour un projet Vite. L'export Figma Make
produisait `build`, d'où l'erreur *« No Output Directory named "dist" found »* :
le build réussissait, mais Vercel cherchait le résultat au mauvais endroit.
`vite.config.ts` produit désormais dans `dist`.

> Si l'interface Vercel contient encore un *Output Directory* saisi à la main,
> videz le champ : un réglage d'interface l'emporte sur `vercel.json`.

Le dossier de sortie est ignoré par Git (`.gitignore`) : `build` y a été ajouté,
`dist` y était déjà. L'ancien `build/` était versionné par erreur, pensez à le
retirer du dépôt :
```bash
git rm -r --cached portfolio/build && git commit -m "chore: ne plus versionner la sortie de build"
```

Le CV (`public/CV-….pdf`) et le portrait (`public/portrait.png`) sont servis
statiquement.

---

---

## 10. Espace d'administration

Depuis `/admin`, tout le contenu du site s'édite sans toucher au code :
profil, textes de présentation, photo, CV, expériences, formations, projets,
compétences, langues, savoir-être et centres d'intérêt.

### Architecture en une phrase

Le site reste une application monopage servie en statique ; les écritures
passent par cinq fonctions serverless dans `api/`, qui parlent à une base
PostgreSQL hébergée chez Neon.

```
Navigateur ──► /api/content        (lecture publique, mise en cache 60 s)
           ──► /api/auth/*         (connexion, déconnexion, session)
           ──► /api/admin/*        (écritures — exige une session)
           ──► /api/media/:id      (photo et CV stockés en base)
           ──► /api/setup          (installation, protégée par jeton)
                      │
                      ▼
                  Neon PostgreSQL
```

### Variables d'environnement

Les noms sont définis, les valeurs vous appartiennent. Le fichier
`.env.example` les liste avec la façon de les générer. Sur Vercel :
**Settings > Environment Variables**.

| Variable | Rôle | Comment l'obtenir |
|---|---|---|
| `DATABASE_URL` | Connexion Neon | Neon Console > Connection string > **Pooled connection** (doit contenir `?sslmode=require`) |
| `AUTH_SECRET` | Signature des sessions | `openssl rand -base64 48` — 32 caractères minimum |
| `ADMIN_EMAIL` | Identifiant du compte | votre adresse |
| `ADMIN_PASSWORD` | Mot de passe initial | 12 caractères minimum ; lu une seule fois, à l'installation |
| `SETUP_TOKEN` | Protège `/api/setup` | `openssl rand -hex 32` |

Aucune valeur ne doit être commitée : `.env` et `.env.local` sont ignorés par
Git.

### Mise en service

1. Créer un projet sur **neon.tech**, copier la chaîne de connexion *poolée*.
2. Renseigner les cinq variables sur Vercel, puis redéployer.
3. Lancer l'installation une fois :

```bash
curl -X POST https://votre-site.vercel.app/api/setup \
     -H "x-setup-token: VOTRE_SETUP_TOKEN"
```

Cette requête crée les 9 tables, le compte administrateur, et insère le
contenu du CV. Elle est **idempotente** : la relancer ne duplique rien et
n'écrase aucune modification.

4. Ouvrir `/admin` et se connecter.

> Une fois l'installation faite, vous pouvez supprimer `SETUP_TOKEN` de
> Vercel : la route se désactive d'elle-même en son absence.

### Travailler en local, sans compte Neon

```bash
npm run build
npm run dev:local        # http://localhost:4300
```

`scripts/dev-server.mjs` sert le site construit et exécute **les vraies
fonctions** de `api/` au-dessus d'un PostgreSQL en mémoire (PGlite). Base
recréée et contenu réinstallé à chaque démarrage, effacés à l'arrêt.
Identifiants affichés dans la console.

### Tester la couche base de données

```bash
npm run test:db
```

Exécute le schéma et le code de `api/_lib/` contre un vrai PostgreSQL.
Vérifie notamment : contraintes `CHECK`, clés étrangères, `ON DELETE CASCADE`
et `SET NULL`, aller-retour des tableaux `text[]`, aller-retour binaire exact
d'un fichier, réordonnancement, hachage et vérification des mots de passe.

---

## 11. Décisions de conception de l'administration

### Le repli d'abord, la base ensuite

Le site affiche d'emblée `src/content/fallback.ts`, le contenu du CV compilé
dans le bundle, puis appelle `/api/content` en arrière-plan et ne remplace le
contenu que si l'appel aboutit.

Conséquence : **base injoignable, mal configurée ou vide, le visiteur voit
quand même le site complet.** Pas d'écran de chargement, pas de saut de mise
en page, pas de page blanche si Neon est en panne. Le seul effet visible est
pour vous : après une modification, le contenu d'origine s'affiche une
fraction de seconde avant d'être remplacé.

Le même fichier sert de semence à `/api/setup` : base et repli partent donc
du même contenu, sans divergence possible.

### Sécurité — ce qui protège réellement

L'écran de connexion de `/admin` ne protège rien : tout ce code est
téléchargé par le navigateur. **La seule protection effective est côté
serveur**, dans `api/admin/[...path].ts`, où la session est vérifiée une
seule fois avant tout aiguillage — impossible d'oublier une route.

| Mesure | Mise en œuvre |
|---|---|
| Mots de passe | scrypt (`node:crypto`), sel aléatoire par compte, comparaison en temps constant |
| Session | JWT signé HMAC-SHA256 (`jose`), cookie `HttpOnly` + `Secure` + `SameSite=Strict`, 8 heures |
| Injection SQL | Requêtes en gabarits étiquetés : toute valeur devient un paramètre lié, jamais du texte concaténé |
| Noms de tables | Jamais interpolés : table de correspondance vers des requêtes écrites en dur |
| URL saisies | `javascript:` et consorts rejetés — une telle URL dans un lien exécuterait du script chez chaque visiteur |
| Fichiers | Type MIME sur liste blanche à l'envoi **et** au service, 3 Mo maximum |
| Énumération de comptes | « compte inconnu » et « mot de passe faux » renvoient le même message |
| Fuite d'information | Les erreurs SQL partent dans les journaux Vercel, jamais dans la réponse |

### Pourquoi les fichiers sont stockés dans Neon

Le portfolio compte trois fichiers : une photo et deux CV, environ 2 Mo au
total, loin des 0,5 Go du palier gratuit Neon. Ajouter un service de stockage
objet aurait voulu dire une variable d'environnement de plus, un compte de
plus, une panne possible de plus — pour trois fichiers.

Pour basculer plus tard vers Vercel Blob, S3 ou Cloudinary, il suffit de
réécrire `api/media/[id].ts` : le reste du code manipule une URL, sans savoir
d'où elle vient.

### Pourquoi cinq fonctions et non vingt

Le palier gratuit de Vercel plafonne le nombre de fonctions serverless par
déploiement. Les segments dynamiques `[action]` et attrape-tout `[...path]`
regroupent toutes les routes dans cinq fichiers, sans rien changer aux URL,
qui restent celles d'une API REST classique.

### Le pilote HTTP de Neon

`@neondatabase/serverless` envoie chaque requête en HTTPS, sans connexion
persistante. C'est ce qu'il faut en serverless, où chaque invocation peut
démarrer un conteneur neuf : un pilote classique ouvrirait une connexion par
invocation et épuiserait le quota.

Deux conséquences traitées dans le code :
- **une seule instruction SQL par requête** — d'où `SCHEMA_STATEMENTS` sous
  forme de tableau plutôt qu'un script séparé par des « ; » ;
- **`BIGSERIAL` revient en chaîne** (un entier 64 bits dépasse la précision
  d'un `number` JavaScript) — d'où `toId()` appliqué à chaque identifiant lu,
  sans quoi `"12" === 12` serait faux et casserait toute comparaison.

### Où ajouter un champ

Un nouveau champ se propage en quatre endroits, et TypeScript signale ceux
que vous oubliez :

1. `api/_lib/schema.ts` — la colonne ;
2. `src/content/types.ts` — le contrat partagé ;
3. `api/_lib/repository.ts` — lecture et écriture ;
4. `src/admin/sections/` — le champ de formulaire.

---

## 12. Arborescence de l'administration

```
api/
├── _lib/
│   ├── db.ts            connexion Neon (+ injection pour les tests)
│   ├── schema.ts        DDL, une instruction par entrée
│   ├── auth.ts          scrypt, JWT, cookie de session
│   ├── http.ts          réponses JSON, validation des entrées
│   └── repository.ts    toutes les requêtes SQL du projet
├── setup.ts             installation idempotente
├── content.ts           GET contenu public
├── auth/[action].ts     login | logout | me
├── admin/[...path].ts   CRUD, session exigée
└── media/[id].ts        photo et CV

src/
├── content/
│   ├── types.ts             contrat partagé API / site / admin
│   ├── fallback.ts          contenu du CV : repli ET semence
│   └── ContentProvider.tsx  repli d'abord, base ensuite
└── admin/
    ├── AdminApp.tsx         connexion + panneau (chargé à la demande)
    ├── api.ts               client HTTP
    ├── fields.tsx           champs réutilisables
    ├── ResourceSection.tsx  liste éditable générique
    └── sections/            profil, et les sections en liste

scripts/
├── dev-server.mjs       site + API en local, PostgreSQL en mémoire
└── test-database.mjs    tests du schéma et des requêtes
```

## Arborescence du site public

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
