# TSK App

SPA React/Vite pour explorer des opportunités sportives, avec routage client, internationalisation et données simulées via une couche de services.

## Explication simple (public néophyte)
- Cette appli est un site vitrine qui montre des opportunités sportives (matchs, tournois, essais) et quelques classements. Elle affiche des pages classiques (accueil, tableau de bord, contact, qui sommes-nous) avec un menu en haut et un pied de page.
- Tout est déjà prêt pour plusieurs langues : le sélecteur change la langue du texte sans recharger la page.
- Les données visibles à l'écran viennent d'un petit service JavaScript. Ce service peut soit lire des "données de démo" incluses dans le code, soit aller chercher de vraies données si vous lui donnez des URLs d'API.
- Si aucune API n'est fournie ou qu'elle ne répond pas, l'appli bascule automatiquement sur les données de démo pour rester fonctionnelle.

## Fonctionnalités
- Routage `react-router-dom` pour l'accueil, le tableau de bord protégé, la proposition d'opportunité, l'authentification, le contact et la page "Qui sommes-nous".
- Internationalisation avec `i18next`/`react-i18next` et dictionnaires externalisés dans `src/i18n/resources.js`.
- Recherche filtrable des opportunités (type, sport, niveau, pays, genre, catégorie, plage de dates) avec bascule liste/carte.
- Données fournies par un service (`src/services/mockApi.js`) qui peut soit servir les mocks embarqués, soit consommer des endpoints distants (opportunités, classements équipes/tournois).
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
- `src/shims/`: remplacements locaux pour `react-router-dom` et `i18next`/`react-i18next` utilisables hors ligne.
- `netlify.toml`: configuration de build Netlify (`npm run build`, publish `dist`, Node 18, `NPM_FLAGS=--no-package-lock`).

## Déploiement Netlify
1. S'assurer que l'install npm a accès au registre pour récupérer `i18next`, `react-i18next` et `react-router-dom` si le cache Netlify est vide.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Variables recommandées (déjà présentes dans `netlify.toml`):
   - `NODE_VERSION=18`
   - `NPM_FLAGS=--no-package-lock`

## Brancher des données réelles
- Renseigner les URLs des endpoints dans les variables Vite (URL absolue ou relative à `VITE_API_BASE_URL`):
  - `VITE_OPPORTUNITIES_URL`
  - `VITE_TEAM_RANKINGS_URL`
  - `VITE_TOURNAMENT_RANKINGS_URL`
  - optionnel: `VITE_API_BASE_URL` pour préfixer les chemins relatifs.
- Le service `src/services/mockApi.js` tentera de récupérer ces endpoints et normalise les champs attendus par l'UI (`type`, `sport`, `level`, `country`, `continent`, `date`, `gender`, `category`, `ageGroup`). En cas d'échec ou de réponse vide, il retombera automatiquement sur les mocks embarqués.
- Si l'API nécessite un token, exposer la variable via `.env`/Netlify et l'injecter côté API (les appels front consomment directement l'URL fournie).

## Dépannage
- Si l'installation échoue à cause d'un accès restreint au registre npm, lancer `npm ci` dans un environnement avec accès réseau ou préchauffer le cache Netlify.
- Si la build échoue sur Netlify, vérifier que les dépendances sont bien résolues et que `netlify.toml` est pris en compte.
