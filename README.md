# TSK App

SPA React/Vite pour explorer des opportunités sportives, avec routage client, internationalisation et données simulées via une couche de services.

## Fonctionnalités
- Routage `react-router-dom` pour l'accueil, le tableau de bord protégé, la proposition d'opportunité, l'authentification, le contact et la page "Qui sommes-nous".
- Internationalisation avec `i18next`/`react-i18next` et dictionnaires externalisés dans `src/i18n/resources.js`.
- Recherche filtrable des opportunités (type, sport, niveau, pays, genre, catégorie, plage de dates) avec bascule liste/carte.
- Données fournies par un service mock (`src/services/mockApi.js`) pour préparer l'intégration back-end (opportunités, classements équipes/tournois).
- Composants réutilisables pour l'accueil (témoignages, roadmap, accompagnement clubs/joueurs/organisateurs) et layout (header, footer, sélecteur de langue).

## Prérequis
- Node.js 18+
- npm 9+

## Installation
```bash
npm ci
```

## Développement
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Structure clé
- `src/i18n/`: configuration i18n et ressources de traduction.
- `src/components/`: pages, layout et composants d'accueil.
- `src/services/mockApi.js`: couche de services async simulée pour les données.
- `public/_redirects`: redirection SPA Netlify vers `index.html`.
- `netlify.toml`: configuration de build Netlify (`npm run build`, publish `dist`, Node 18, `NPM_FLAGS=--no-package-lock`).

## Déploiement Netlify
1. S'assurer que l'install npm a accès au registre pour récupérer `i18next`, `react-i18next` et `react-router-dom` si le cache Netlify est vide.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Variables recommandées (déjà présentes dans `netlify.toml`):
   - `NODE_VERSION=18`
   - `NPM_FLAGS=--no-package-lock`

## Dépannage
- Si l'installation échoue à cause d'un accès restreint au registre npm, lancer `npm ci` dans un environnement avec accès réseau ou préchauffer le cache Netlify.
- Si la build échoue sur Netlify, vérifier que les dépendances sont bien résolues et que `netlify.toml` est pris en compte.
