import React, { useState, useMemo, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';

// --- Dictionnaire de textes (i18n) ---
const copy = (lang) => {
  const dict = {
    fr: {
      // --- Navigation ---
      nav_home: 'Accueil', nav_search: 'Rechercher', nav_rankings: 'Classements', nav_players: 'Pour les Joueurs', nav_coaches: 'Pour les Coachs', nav_organizers: 'Pour les Organisateurs', nav_concierge: 'Conciergerie', nav_contact: 'Contact',
      nav_login: 'Connexion', nav_signup: 'Inscription', nav_dashboard: 'Tableau de Bord', nav_logout: 'Déconnexion',

      // --- Hero Section ---
      h1_top: 'Trouvez, Comparez, Progressez.',
      h1_highlight: 'Votre Avenir Sportif Commence Ici.',
      h1_sub: 'La plateforme qui transforme votre potentiel en performance. Accédez à des milliers de tournois, camps, et académies. Évaluez la compétition avec nos classements exclusifs.',
      cta_primary: 'Trouver une opportunité',
      cta_secondary: 'Je suis un organisateur',
      
      // --- Social Proof ---
      social_proof_title: 'Ils nous font confiance pour façonner l\'avenir du sport',

      // --- Search Section ---
      search_title: 'Trouvez votre prochaine opportunité',
      search_subtitle: 'Utilisez nos filtres pour découvrir l\'expérience parfaite pour votre développement.',
      search_keyword: 'Mot-clé (nom, ville...)',
      filter_type: 'Type d\'opportunité', filter_sport: 'Sport', filter_level: 'Niveau', filter_country: 'Pays', filter_date_start: 'Date de début', filter_date_end: 'Date de fin', filter_gender: 'Genre', filter_category: 'Catégorie d\'âge',
      type_all: 'Toutes', type_tournament: 'Tournoi', type_camp: 'Camp', type_academy: 'Académie', type_coach: 'Coach', type_venue: 'Lieu',
      view_list: 'Liste', view_map: 'Carte',
      gender_all: 'Tous', gender_male: 'Masculin', gender_female: 'Féminin', gender_mixed: 'Mixte',
      no_results: 'Aucune opportunité ne correspond à vos critères. Essayez d\'ajuster vos filtres.',
      
      // --- Testimonials ---
      testimonials_title: 'Ce que notre communauté en dit',
      testimonials_player_quote: '"Grâce à TSK, j\'ai trouvé un camp d\'été en Espagne qui a complètement changé mon jeu. Les classements m\'ont aidé à choisir un événement avec le bon niveau de compétition."',
      testimonials_player_name: 'Lucas, Joueur U17',
      testimonials_coach_quote: '"L\'outil d\'analyse de la compétition est un game-changer. Je peux préparer ma saison en identifiant les tournois les plus pertinents et en étudiant les équipes que nous allons affronter. Un gain de temps inestimable."',
      testimonials_coach_name: 'Coach Dubois, Club de Basket',
      testimonials_organizer_quote: '"Inscrire notre tournoi sur TSK nous a donné une visibilité internationale que nous n\'aurions jamais eue autrement. La gestion des inscriptions est simple et efficace. Nous avons eu 20% de participants en plus cette année."',
      testimonials_organizer_name: 'Marie, Organisatrice Paris Youth Cup',

      // --- Rankings ---
      rankings_title: 'Classements TSK',
      rankings_subtitle: 'Suivez la progression, évaluez la compétition et identifiez les meilleures opportunités.',
      rankings_tab_teams: 'Classement des Équipes', rankings_tab_tournaments: 'Classement des Tournois',
      rankings_col_rank: 'Rang', rankings_col_team: 'Équipe', rankings_col_category: 'Catégorie', rankings_col_played: 'Joués', rankings_col_elo: 'Classement TSK',
      rankings_col_tournament: 'Tournoi', rankings_col_prestige: 'Score Prestige', rankings_col_top_teams: 'Équipes du Top 20',
      
      // --- Personas ---
      players_title: 'Pour les Joueurs',
      players_subtitle: 'Votre talent est unique. Votre prochaine étape vous attend.',
      players_s1_title: 'Rejoignez une Travel Team', players_s1_text: 'Inscrivez-vous en solo ou en petit groupe pour rejoindre des équipes compétitives formées pour des tournois spécifiques. Une opportunité unique de voyager et de vous mesurer aux meilleurs.',
      players_s2_title: 'Intégrez un Camp de Perfectionnement', players_s2_text: 'Trouvez des camps d\'été ou des stages intensifs pour développer vos compétences avec des coachs de renom.',
      players_cta: 'Découvrir les opportunités',
      coaches_title: 'Pour les Coachs',
      coaches_subtitle: 'De la recherche à la stratégie. Gagnez un avantage compétitif.',
      coaches_s1_title: 'Alertes Personnalisées', coaches_s1_text: 'Enregistrez vos filtres de recherche et recevez des notifications dès qu\'une nouvelle opportunité correspondant à vos critères est ajoutée.',
      coaches_s2_title: 'Analyse de la Compétition', coaches_s2_text: 'Utilisez nos classements et les résultats passés pour préparer vos équipes et définir votre stratégie pour la saison.',
      coaches_cta: 'Optimiser ma saison',
      organizers_title: 'Pour les Organisateurs',
      organizers_subtitle: 'Donnez à votre événement la visibilité qu\'il mérite. Rejoignez notre plateforme globale.',
      organizers_standard_cta: 'Inscrire votre événement',

      // --- Concierge ---
      concierge_section_title: 'Conciergerie TSK',
      concierge_section_subtitle: 'L\'excellence sur-mesure pour les joueurs, les coachs et les organisateurs.',
      concierge_for_players_title: 'Pour les Joueurs & Familles',
      concierge_for_players_text: 'Concentrez-vous sur la performance, nous gérons la logistique. Voyage, hébergement, et services sur place pour une expérience sans stress.',
      concierge_for_coaches_title: 'Pour les Coachs & Clubs',
      concierge_for_coaches_text: 'Simplifiez l\'organisation de vos déplacements. Nous proposons des solutions de groupe pour le transport, l\'hébergement et la planification.',
      concierge_for_organizers_title: 'Pour les Organisateurs',
      concierge_for_organizers_text: 'Sublimez votre événement. De la production vidéo à la gestion des réseaux sociaux, nos services premium maximisent votre impact.',
      concierge_cta: 'Demander un entretien confidentiel',
      
      // --- Roadmap & Footer ---
      roadmap_title: 'Notre Feuille de Route pour la Communauté',
      roadmap_subtitle: 'Nous faisons évoluer constamment la plateforme avec des fonctionnalités qui vous servent.',
      footer_text: '© 2025 TSK — Le sport pour tous, simplifié.',
      
      // --- Contact Page ---
      contact_title: 'Contactez-nous',
      contact_subtitle: 'Une question, une suggestion, ou besoin d\'aide ? Notre équipe est là pour vous répondre.',
      contact_reason_player: 'Je suis un joueur / parent',
      contact_reason_coach: 'Je suis un coach / club',
      contact_reason_organizer: 'Je suis un organisateur',
      contact_reason_concierge: 'Je souhaite en savoir plus sur la Conciergerie',
      contact_reason_other: 'Autre',
      contact_name: 'Votre nom',
      contact_email: 'Votre email',
      contact_subject: 'Sujet de votre message',
      contact_message: 'Votre message',
      contact_send: 'Envoyer le message',
      contact_success: 'Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.',
      
      // --- Auth Page ---
      auth_login_title: 'Se connecter à votre compte',
      auth_signup_title: 'Créer un compte TSK',
      auth_email: 'Adresse email',
      auth_password: 'Mot de passe',
      auth_login_btn: 'Connexion',
      auth_signup_btn: 'Créer mon compte',
      auth_no_account: 'Pas encore de compte ?',
      auth_has_account: 'Déjà un compte ?',

      // --- Dashboard & Propose ---
      dashboard_welcome: 'Bienvenue sur votre tableau de bord',
      dashboard_propose_cta: 'Proposer une opportunité',
      propose_title: 'Proposer une nouvelle opportunité',
      propose_subtitle: 'Remplissez ce formulaire pour ajouter votre événement, camp ou académie à la plateforme TSK.',
      propose_name: 'Nom de l\'opportunité',
      propose_submit: 'Soumettre pour validation',
      propose_success: 'Merci ! Votre opportunité a été soumise et sera examinée par notre équipe.',
    },
  };
  return dict[lang] || dict['fr'];
};

// --- Mock Data ---
const allOpportunities = [
  { id: 1, type: 'Tournoi', name: 'La Roda Future Stars', sport: 'Basketball', level: 'Elite', country: 'Espagne', continent: 'Europe', date: '2025-07-15', gender: 'Masculin', category: 'U16', ageGroup: 'Formation' },
  { id: 2, type: 'Tournoi', name: 'Bataille d’Alsace', sport: 'Basketball', level: 'Elite', country: 'France', continent: 'Europe', date: '2025-05-20', gender: 'Féminin', category: 'U15', ageGroup: 'Formation' },
  { id: 3, type: 'Tournoi', name: 'Paris Youth Cup', sport: 'Football', level: 'Competition', country: 'France', continent: 'Europe', date: '2025-06-10', gender: 'Masculin', category: 'U15', ageGroup: 'Formation' },
  { id: 4, type: 'Camp', name: 'Berlin Skills Camp', sport: 'Tennis', level: 'Decouverte', country: 'Allemagne', continent: 'Europe', date: '2025-08-01', gender: 'Mixte', category: 'U14', ageGroup: 'Pré-formation' },
];
const rankingsData = [
    { rank: 1, team: 'Paris Elite U15', category: 'U15 Football', played: 22, elo: 1850 },
    { rank: 2, team: 'Madrid Baloncesto U16', category: 'U16 Basketball', played: 25, elo: 1820 },
];
const tournamentRankingsData = [
    { rank: 1, name: 'La Roda Future Stars', country: 'Espagne', prestigeScore: 95.2, top20Teams: 8 },
    { rank: 2, name: 'Munich Football Fest', country: 'Allemagne', prestigeScore: 92.8, top20Teams: 6 },
];

// --- Composants UI Primitifs ---
const PrimaryBtn = ({ children, href, onClick, type = 'button' }) => <button type={type} onClick={onClick} className="cursor-pointer inline-block rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-700 disabled:opacity-50">{children}</button>;
const SecondaryBtn = ({ children, href, onClick }) => <a href={href} onClick={onClick} className="cursor-pointer inline-block rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-300 hover:bg-slate-50">{children}</a>;
const CardBase = ({ children, className = '' }) => <div className={`rounded-xl border border-slate-200 bg-white ${className}`}>{children}</div>;

// --- NOUVEAUX COMPOSANTS DE PAGE ---

const ContactPage = ({ T }) => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900">{T.contact_title}</h2>
        <p className="mt-4 text-slate-600">{T.contact_subtitle}</p>
        
        {submitted ? (
          <CardBase className="mt-12 p-8 text-center">
            <p className="text-lg font-semibold text-green-600">{T.contact_success}</p>
          </CardBase>
        ) : (
          <CardBase className="mt-12 p-8 text-left">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">{T.contact_subject}</label>
                <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                  <option>{T.contact_reason_player}</option>
                  <option>{T.contact_reason_coach}</option>
                  <option>{T.contact_reason_organizer}</option>
                  <option>{T.contact_reason_concierge}</option>
                  <option>{T.contact_reason_other}</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.contact_name}</label>
                  <input type="text" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.contact_email}</label>
                  <input type="email" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{T.contact_message}</label>
                <textarea rows="4" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
              </div>
              <div className="text-center">
                <PrimaryBtn type="submit">{T.contact_send}</PrimaryBtn>
              </div>
            </form>
          </CardBase>
        )}
      </div>
    </section>
  );
};

const AuthPage = ({ T, onLogin, navigateTo }) => {
  const [isLogin, setIsLogin] = useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email: e.target.email.value }); // Mock login
    navigateTo('dashboard');
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-md px-4">
        <CardBase className="p-8">
          <h2 className="text-2xl font-bold text-center text-slate-900">
            {isLogin ? T.auth_login_title : T.auth_signup_title}
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.auth_email}</label>
              <input type="email" name="email" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.auth_password}</label>
              <input type="password" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
            <div>
              <PrimaryBtn type="submit" className="w-full">{isLogin ? T.auth_login_btn : T.auth_signup_btn}</PrimaryBtn>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-orange-600 hover:underline">
              {isLogin ? T.auth_no_account + ' ' + T.nav_signup : T.auth_has_account + ' ' + T.nav_login}
            </button>
          </div>
        </CardBase>
      </div>
    </section>
  );
};

const DashboardPage = ({ T, user, navigateTo }) => (
  <section className="py-20 bg-slate-50">
    <div className="mx-auto max-w-4xl px-4 text-center">
      <h2 className="text-3xl font-bold text-slate-900">{T.dashboard_welcome}</h2>
      <p className="mt-4 text-slate-600">{user.email}</p>
      <div className="mt-12">
        <PrimaryBtn onClick={() => navigateTo('propose')}>{T.dashboard_propose_cta}</PrimaryBtn>
      </div>
    </div>
  </section>
);

const ProposeOpportunityPage = ({ T }) => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  
  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900">{T.propose_title}</h2>
        <p className="mt-4 text-slate-600">{T.propose_subtitle}</p>
        
        {submitted ? (
           <CardBase className="mt-12 p-8 text-center">
            <p className="text-lg font-semibold text-green-600">{T.propose_success}</p>
          </CardBase>
        ) : (
          <CardBase className="mt-12 p-8 text-left">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">{T.propose_name}</label>
                <input type="text" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
              </div>
              {/* Simplified form for brevity. Add other fields like in Search component */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_type}</label>
                  <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option>{T.type_tournament}</option>
                    <option>{T.type_camp}</option>
                    <option>{T.type_academy}</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_sport}</label>
                  <input type="text" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
              </div>
              <div className="text-center">
                <PrimaryBtn type="submit">{T.propose_submit}</PrimaryBtn>
              </div>
            </form>
          </CardBase>
        )}
      </div>
    </section>
  );
};

// --- COMPOSANTS DE L'ANCIENNE PAGE D'ACCUEIL ---
// ... (Hero, SocialProof, Search, Testimonials, Rankings, ForPlayers, etc. are defined here as before) ...
const LanguageSwitcher = ({ lang, setLang }) => { /* ... implementation from previous code ... */ };
const Hero = ({ T }) => { /* ... */ };
const SocialProof = ({ T }) => { /* ... */ };
const Search = ({ T }) => { /* ... */ };
const Testimonials = ({ T }) => { /* ... */ };
const Rankings = ({ T }) => { /* ... */ };
const ForPlayers = ({ T }) => { /* ... */ };
const ForCoaches = ({ T }) => { /* ... */ };
const ForOrganizers = ({ T }) => { /* ... */ };
const Concierge = ({ T }) => { /* ... */ };
const Roadmap = ({ T }) => { /* ... */ };

const HomePage = ({ T }) => (
  <>
    <Hero T={T} />
    <SocialProof T={T} />
    <Search T={T} />
    <Testimonials T={T} />
    <Rankings T={T} />
    <ForPlayers T={T} />
    <ForCoaches T={T} />
    <ForOrganizers T={T} />
    <Concierge T={T} />
    <Roadmap T={T} />
  </>
);

// --- COMPOSANT HEADER MIS À JOUR ---
const Header = ({ T, lang, setLang, navigateTo, user, onLogout }) => {
  const NavBtn = ({ page, children }) => (
    <button onClick={() => navigateTo(page)} className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100">
      {children}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm border-b border-slate-200 bg-white/80">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="TSK Logo" className="h-10 w-10 rounded-lg cursor-pointer" onClick={() => navigateTo('home')} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/f97316/white?text=TSK'; }}/>
          <div className="font-semibold text-slate-800 cursor-pointer" onClick={() => navigateTo('home')}>TSK Sport</div>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          <NavBtn page="home">{T.nav_home}</NavBtn>
          <NavBtn page="contact">{T.nav_contact}</NavBtn>
          {/* Add other main nav links here if needed */}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NavBtn page="dashboard">{T.nav_dashboard}</NavBtn>
              <button onClick={onLogout} className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100">{T.nav_logout}</button>
            </>
          ) : (
            <>
              <NavBtn page="auth">{T.nav_login}</NavBtn>
              <PrimaryBtn onClick={() => navigateTo('auth')}>{T.nav_signup}</PrimaryBtn>
            </>
          )}
           <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
      </div>
    </header>
  );
};

const Footer = ({ T }) => (
  <footer className="border-t border-slate-200">
    <div className="mx-auto max-w-7xl px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-3 text-slate-500">
      <div>{T.footer_text}</div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-slate-800">Mentions légales</a>
        <button onClick={() => window.scrollTo(0, 0)} className="hover:text-slate-800">Contact</button>
      </div>
    </div>
  </footer>
);

// --- COMPOSANT PRINCIPAL DE L'APPLICATION ---
export default function App() {
  const [lang, setLang] = useState('fr');
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null); // null if logged out, user object if logged in
  const T = copy(lang);
  
  useEffect(() => {
    document.documentElement.lang = lang;
    window.scrollTo(0, 0);
  }, [lang, currentPage]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'contact':
        return <ContactPage T={T} />;
      case 'auth':
        return <AuthPage T={T} onLogin={handleLogin} navigateTo={setCurrentPage} />;
      case 'dashboard':
        return user ? <DashboardPage T={T} user={user} navigateTo={setCurrentPage} /> : <HomePage T={T} />;
      case 'propose':
        return user ? <ProposeOpportunityPage T={T} /> : <HomePage T={T} />;
      case 'home':
      default:
        return <HomePage T={T} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header T={T} lang={lang} setLang={setLang} navigateTo={setCurrentPage} user={user} onLogout={handleLogout} />
      <main>
        {renderPage()}
      </main>
      <Footer T={T} />
    </div>
  );
}
