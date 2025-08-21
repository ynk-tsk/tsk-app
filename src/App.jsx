import React, { useState, useMemo, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';

/**
 * TSK — Plateforme Sportive Écosystème (React)
 * Rôle: Chef de produit — expérience accessible pour l'écosystème sportif (U11–U21)
 * Ligne UX: Découvrir (Joueur/Coach/Orga) → Planifier → Participer → Progresser (Classements)
 * Positionnement: Plateforme centrale et globale pour les opportunités sportives (tournois, camps, académies, coachs, lieux).
 * Internationalisation: fr, es, de.
 *
 * MVP v2 Améliorations:
 * - Injection de preuve sociale (logos, témoignages) pour renforcer la confiance.
 * - Message principal affiné pour être plus orienté vers l'action et les bénéfices.
 * - Moteur de recherche amélioré avec recherche par mot-clé et plage de dates.
 * - Liens cliquables dans les classements pour suggérer des profils détaillés.
 */

// --- Dictionnaire de textes (i18n) ---
const copy = (lang) => {
  const dict = {
    fr: {
      nav_search: 'Rechercher', nav_rankings: 'Classements', nav_players: 'Pour les Joueurs', nav_coaches: 'Pour les Coachs', nav_organizers: 'Pour les Organisateurs', nav_concierge: 'Conciergerie',
      
      h1_top: 'Trouvez, Comparez, Progressez.',
      h1_highlight: 'Votre Avenir Sportif Commence Ici.',
      h1_sub: 'La plateforme qui transforme votre potentiel en performance. Accédez à des milliers de tournois, camps, et académies. Évaluez la compétition avec nos classements exclusifs.',
      
      cta_primary: 'Trouver une opportunité',
      cta_secondary: 'Je suis un organisateur',
      
      social_proof_title: 'Ils nous font confiance pour façonner l\'avenir du sport',

      search_title: 'Trouvez votre prochaine opportunité',
      search_subtitle: 'Utilisez nos filtres pour découvrir l\'expérience parfaite pour votre développement.',
      search_keyword: 'Mot-clé (nom, ville...)',
      
      filter_type: 'Type d\'opportunité', filter_sport: 'Sport', filter_level: 'Niveau', filter_country: 'Pays', filter_date_start: 'Date de début', filter_date_end: 'Date de fin', filter_gender: 'Genre', filter_category: 'Catégorie d\'âge',
      
      type_all: 'Toutes', type_tournament: 'Tournoi', type_camp: 'Camp', type_academy: 'Académie', type_coach: 'Coach', type_venue: 'Lieu',
      
      view_list: 'Liste', view_map: 'Carte',
      
      gender_all: 'Tous', gender_male: 'Masculin', gender_female: 'Féminin', gender_mixed: 'Mixte',
      
      no_results: 'Aucune opportunité ne correspond à vos critères. Essayez d\'ajuster vos filtres.',
      
      testimonials_title: 'Ce que notre communauté en dit',
      testimonials_player_quote: '"Grâce à TSK, j\'ai trouvé un camp d\'été en Espagne qui a complètement changé mon jeu. Les classements m\'ont aidé à choisir un événement avec le bon niveau de compétition."',
      testimonials_player_name: 'Lucas, Joueur U17',
      testimonials_coach_quote: '"L\'outil d\'analyse de la compétition est un game-changer. Je peux préparer ma saison en identifiant les tournois les plus pertinents et en étudiant les équipes que nous allons affronter. Un gain de temps inestimable."',
      testimonials_coach_name: 'Coach Dubois, Club de Basket',
      testimonials_organizer_quote: '"Inscrire notre tournoi sur TSK nous a donné une visibilité internationale que nous n\'aurions jamais eue autrement. La gestion des inscriptions est simple et efficace. Nous avons eu 20% de participants en plus cette année."',
      testimonials_organizer_name: 'Marie, Organisatrice Paris Youth Cup',

      rankings_title: 'Classements TSK',
      rankings_subtitle: 'Suivez la progression, évaluez la compétition et identifiez les meilleures opportunités.',
      rankings_tab_teams: 'Classement des Équipes', rankings_tab_tournaments: 'Classement des Tournois',
      rankings_col_rank: 'Rang', rankings_col_team: 'Équipe', rankings_col_category: 'Catégorie', rankings_col_played: 'Joués', rankings_col_elo: 'Classement TSK',
      rankings_col_tournament: 'Tournoi', rankings_col_prestige: 'Score Prestige', rankings_col_top_teams: 'Équipes du Top 20',
      
      players_title: 'Pour les Joueurs',
      players_subtitle: 'Votre talent est unique. Votre prochaine étape vous attend.',
      players_s1_title: 'Rejoignez une Travel Team', players_s1_text: 'Inscrivez-vous en solo ou en petit groupe pour rejoindre des équipes compétitives formées pour des tournois spécifiques. Une opportunité unique de voyager et de vous mesurer aux meilleurs.',
      players_s2_title: 'Intégrez un Camp de Perfectionnement', players_s2_text: 'Trouvez des camps d\'été ou des stages intensifs pour développer vos compétences avec des coachs de renom.',
      players_cta: 'Découvrir les opportunités',
      player_testimonial_short: '"J\'ai trouvé le camp parfait en quelques clics. Une expérience incroyable!"',

      coaches_title: 'Pour les Coachs',
      coaches_subtitle: 'De la recherche à la stratégie. Gagnez un avantage compétitif.',
      coaches_s1_title: 'Alertes Personnalisées', coaches_s1_text: 'Enregistrez vos filtres de recherche et recevez des notifications dès qu\'une nouvelle opportunité correspondant à vos critères est ajoutée.',
      coaches_s2_title: 'Analyse de la Compétition', coaches_s2_text: 'Utilisez nos classements et les résultats passés pour préparer vos équipes et définir votre stratégie pour la saison.',
      coaches_cta: 'Optimiser ma saison',
      coach_testimonial_short: '"Les alertes personnalisées sont un outil puissant pour ne rater aucune opportunité."',

      organizers_title: 'Pour les Organisateurs',
      organizers_subtitle: 'Donnez à votre événement la visibilité qu\'il mérite. Rejoignez notre plateforme globale.',
      organizers_standard_title: 'Inscription Standard', organizers_standard_subtitle: 'Gratuit',
      organizers_standard_feature1: 'Visibilité auprès d\'une audience mondiale', organizers_standard_feature2: 'Gestion simple des inscriptions',
      organizers_standard_cta: 'Inscrire votre événement',
      organizer_testimonial_short: '"La visibilité obtenue via TSK a dépassé toutes nos attentes."',

      concierge_section_title: 'Conciergerie TSK', concierge_section_subtitle: 'L\'excellence sur-mesure pour les joueurs, les coachs et les organisateurs.',
      concierge_for_players_title: 'Pour les Joueurs & Familles', concierge_for_players_text: 'Concentrez-vous sur la performance, nous gérons la logistique. Voyage, hébergement, et services sur place pour une expérience sans stress.',
      concierge_for_coaches_title: 'Pour les Coachs & Clubs', concierge_for_coaches_text: 'Simplifiez l\'organisation de vos déplacements. Nous proposons des solutions de groupe pour le transport, l\'hébergement et la planification.',
      concierge_for_organizers_title: 'Pour les Organisateurs', concierge_for_organizers_text: 'Sublimez votre événement. De la production vidéo à la gestion des réseaux sociaux, nos services premium maximisent votre impact.',
      concierge_cta: 'Demander un entretien confidentiel',
      
      roadmap_title: 'Notre Feuille de Route pour la Communauté', roadmap_subtitle: 'Nous faisons évoluer constamment la plateforme avec des fonctionnalités qui vous servent.',
      
      footer_text: '© 2025 TSK — Le sport pour tous, simplifié.',
    },
    // English, Spanish, and German translations would follow a similar, expanded structure.
  };
  return dict[lang] || dict['fr'];
};

// --- Mock Data ---
const allOpportunities = [
  { id: 1, type: 'Tournoi', name: 'La Roda Future Stars', sport: 'Basketball', level: 'Elite', country: 'Espagne', continent: 'Europe', date: '2025-07-15', gender: 'Masculin', category: 'U16', ageGroup: 'Formation' },
  { id: 2, type: 'Tournoi', name: 'Bataille d’Alsace', sport: 'Basketball', level: 'Elite', country: 'France', continent: 'Europe', date: '2025-05-20', gender: 'Féminin', category: 'U15', ageGroup: 'Formation' },
  { id: 3, type: 'Tournoi', name: 'Paris Youth Cup', sport: 'Football', level: 'Competition', country: 'France', continent: 'Europe', date: '2025-06-10', gender: 'Masculin', category: 'U15', ageGroup: 'Formation' },
  { id: 4, type: 'Camp', name: 'Berlin Skills Camp', sport: 'Tennis', level: 'Decouverte', country: 'Allemagne', continent: 'Europe', date: '2025-08-01', gender: 'Mixte', category: 'U14', ageGroup: 'Pré-formation' },
  { id: 5, type: 'Académie', name: 'Madrid Tennis Academy', sport: 'Tennis', level: 'Competition', country: 'Espagne', continent: 'Europe', date: '2025-09-05', gender: 'Féminin', category: 'U16', ageGroup: 'Formation' },
  { id: 6, type: 'Tournoi', name: 'Munich Football Fest', sport: 'Football', level: 'Elite', country: 'Allemagne', continent: 'Europe', date: '2025-07-22', gender: 'Masculin', category: 'U14', ageGroup: 'Pré-formation' },
  { id: 7, type: 'Camp', name: 'Lyon Hoops Camp', sport: 'Basketball', level: 'Decouverte', country: 'France', continent: 'Europe', date: '2025-06-30', gender: 'Mixte', category: 'U14', ageGroup: 'Pré-formation' },
  { id: 8, type: 'Académie', name: 'IMG Academy', sport: 'Football', level: 'Elite', country: 'USA', continent: 'Amérique du Nord', date: '2025-08-10', gender: 'Masculin', category: 'U17', ageGroup: 'Formation' },
  { id: 9, type: 'Coach', name: 'Coach Martin - Shooting Expert', sport: 'Basketball', level: 'Elite', country: 'France', continent: 'Europe', date: '2025-01-01', gender: 'Mixte', category: 'all', ageGroup: 'all' },
  { id: 10, type: 'Lieu', name: 'Hoops Factory Paris', sport: 'Basketball', level: 'all', country: 'France', continent: 'Europe', date: '2025-01-01', gender: 'Mixte', category: 'all', ageGroup: 'all' },
  { id: 11, type: 'Tournoi', name: 'Toronto Youth Games', sport: 'Football', level: 'Competition', country: 'Canada', continent: 'Amérique du Nord', date: '2025-07-20', gender: 'Mixte', category: 'U12', ageGroup: 'Pré-formation' },
  { id: 12, type: 'Camp', name: 'Rio de Janeiro Beach Soccer', sport: 'Football', level: 'Decouverte', country: 'Brésil', continent: 'Amérique du Sud', date: '2025-08-05', gender: 'Masculin', category: 'U18', ageGroup: 'Formation' },
  { id: 13, type: 'Tournoi', name: 'London Premier Cup', sport: 'Football', level: 'Elite', country: 'Angleterre', continent: 'Europe', date: '2025-06-15', gender: 'Masculin', category: 'U19', ageGroup: 'Formation' },
  { id: 14, type: 'Académie', name: 'Sydney Sports Academy', sport: 'Tennis', level: 'Elite', country: 'Australie', continent: 'Océanie', date: '2025-01-10', gender: 'Mixte', category: 'U21', ageGroup: 'Formation' },
  { id: 15, type: 'Camp', name: 'Shanghai Basketball Camp', sport: 'Basketball', level: 'Competition', country: 'Chine', continent: 'Asie', date: '2025-07-25', gender: 'Masculin', category: 'U20', ageGroup: 'Formation' },
  { id: 16, type: 'Tournoi', name: 'Tokyo Junior Masters', sport: 'Tennis', level: 'Elite', country: 'Japon', continent: 'Asie', date: '2025-04-10', gender: 'Féminin', category: 'U18', ageGroup: 'Formation' },
  { id: 17, type: 'Tournoi', name: 'Belgrade Future Stars', sport: 'Basketball', level: 'Elite', country: 'Serbie', continent: 'Europe', date: '2025-08-20', gender: 'Masculin', category: 'U13', ageGroup: 'Pré-formation' },
  { id: 18, type: 'Tournoi', name: 'Mini Basket Tournoi', sport: 'Basketball', level: 'Decouverte', country: 'France', continent: 'Europe', date: '2025-09-15', gender: 'Mixte', category: 'U11', ageGroup: 'Pré-formation' },
];
const rankingsData = [
    { rank: 1, team: 'Paris Elite U15', category: 'U15 Football', played: 22, elo: 1850 },
    { rank: 2, team: 'Madrid Baloncesto U16', category: 'U16 Basketball', played: 25, elo: 1820 },
    { rank: 3, team: 'Berlin Tennis Talents U14', category: 'U14 Tennis', played: 18, elo: 1795 },
    { rank: 4, team: 'Lyon ASVEL U16', category: 'U16 Basketball', played: 24, elo: 1780 },
    { rank: 5, team: 'FC Bayern Junior U15', category: 'U15 Football', played: 20, elo: 1765 },
];
const tournamentRankingsData = [
    { rank: 1, name: 'La Roda Future Stars', country: 'Espagne', prestigeScore: 95.2, top20Teams: 8 },
    { rank: 2, name: 'Munich Football Fest', country: 'Allemagne', prestigeScore: 92.8, top20Teams: 6 },
    { rank: 3, name: 'Bataille d’Alsace', country: 'France', prestigeScore: 89.5, top20Teams: 5 },
];

// --- Composants UI Primitifs ---
const NavBtn = ({ children, href }) => <a href={href} className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100">{children}</a>;
const PrimaryBtn = ({ children, href, onClick }) => <a href={href} onClick={onClick} className="cursor-pointer inline-block rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-700">{children}</a>;
const SecondaryBtn = ({ children, href, onClick }) => <a href={href} onClick={onClick} className="cursor-pointer inline-block rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-300 hover:bg-slate-50">{children}</a>;
const CardBase = ({ children, className = '' }) => <div className={`rounded-xl border border-slate-200 bg-white ${className}`}>{children}</div>;

// --- Composants de Section ---
const LanguageSwitcher = ({ lang, setLang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const languages = { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch' };
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    return (
        <div className="relative" ref={wrapperRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100">
                <span>{languages[lang]}</span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                        {Object.entries(languages).map(([key, name]) => (
                            <a href="#" key={key} onClick={(e) => { e.preventDefault(); setLang(key); setIsOpen(false); }} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{name}</a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Header = ({ T, lang, setLang }) => (
  <header className="sticky top-0 z-40 w-full backdrop-blur-sm border-b border-slate-200 bg-white/80">
    <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="logo.jpg" alt="TSK Logo" className="h-10 w-10 rounded-lg" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/f97316/white?text=TSK'; }}/>
        <div className="font-semibold text-slate-800">TSK Sport</div>
      </div>
      <nav className="hidden md:flex items-center gap-1">
        <NavBtn href="#search">{T.nav_search}</NavBtn>
        <NavBtn href="#rankings">{T.nav_rankings}</NavBtn>
        <NavBtn href="#players">{T.nav_players}</NavBtn>
        <NavBtn href="#coaches">{T.nav_coaches}</NavBtn>
        <NavBtn href="#organizers">{T.nav_organizers}</NavBtn>
        <NavBtn href="#concierge">{T.nav_concierge}</NavBtn>
        <LanguageSwitcher lang={lang} setLang={setLang} />
      </nav>
    </div>
  </header>
);

const Hero = ({ T }) => (
  <section className="relative text-center py-20 md:py-32 overflow-hidden">
    <div className="absolute inset-0">
        <img src="hero-background.jpg" alt="Young athlete focused before a competition" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1920x1080/1e293b/f8fafc?text=Focus'; }}/>
        <div className="absolute inset-0 bg-black/50"></div>
    </div>
    <div className="relative mx-auto max-w-4xl px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
        {T.h1_top} <span className="text-orange-500">{T.h1_highlight}</span>
      </h1>
      <p className="mt-6 text-lg text-slate-200 font-medium">{T.h1_sub}</p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <PrimaryBtn href="#search">{T.cta_primary}</PrimaryBtn>
        <SecondaryBtn href="#organizers">{T.cta_secondary}</SecondaryBtn>
      </div>
    </div>
  </section>
);

const SocialProof = ({ T }) => (
  <div className="bg-white py-12">
    <div className="mx-auto max-w-7xl px-4">
      <h3 className="text-center text-sm font-semibold text-slate-600 tracking-wider uppercase">{T.social_proof_title}</h3>
      <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
          <img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=LigueSport" alt="LigueSport Logo" />
        </div>
        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
          <img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=FédéJeunes" alt="FédéJeunes Logo" />
        </div>
        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
          <img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=NextGen+Events" alt="NextGen Events Logo" />
        </div>
        <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
          <img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=ProForma" alt="ProForma Logo" />
        </div>
        <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1">
          <img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=Athletico" alt="Athletico Logo" />
        </div>
      </div>
    </div>
  </div>
);

const Search = ({ T }) => {
  const [filters, setFilters] = useState({ type: 'all', sport: 'all', level: 'all', country: 'all', date: '', dateEnd: '', gender: 'all', category: 'all', keyword: '' });
  const [opportunities, setOpportunities] = useState(allOpportunities);
  const [view, setView] = useState('list');

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({...prev, [name]: value }));
  };

  useEffect(() => {
    let filtered = allOpportunities;
    if (filters.keyword) {
        const lowerKeyword = filters.keyword.toLowerCase();
        filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(lowerKeyword) ||
            t.country.toLowerCase().includes(lowerKeyword) ||
            t.sport.toLowerCase().includes(lowerKeyword)
        );
    }
    if (filters.type !== 'all') filtered = filtered.filter(t => t.type === filters.type);
    if (filters.sport !== 'all') filtered = filtered.filter(t => t.sport === filters.sport);
    if (filters.level !== 'all') filtered = filtered.filter(t => t.level === filters.level);
    if (filters.country !== 'all') filtered = filtered.filter(t => t.country === filters.country);
    if (filters.gender !== 'all') filtered = filtered.filter(t => t.gender === filters.gender);
    if (filters.category !== 'all') filtered = filtered.filter(t => t.category === filters.category);
    if (filters.date) filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.date));
    if (filters.dateEnd) filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateEnd));
    setOpportunities(filtered);
  }, [filters]);

  const types = { 'Tournoi': T.type_tournament, 'Camp': T.type_camp, 'Académie': T.type_academy, 'Coach': T.type_coach, 'Lieu': T.type_venue };
  const sports = [...new Set(allOpportunities.map(t => t.sport))];
  const levels = ['Decouverte', 'Competition', 'Elite'];
  const countriesByContinent = allOpportunities.reduce((acc, curr) => {
    if (curr.continent) {
        if (!acc[curr.continent]) acc[curr.continent] = [];
        if (!acc[curr.continent].includes(curr.country)) acc[curr.continent].push(curr.country);
    }
    return acc;
  }, {});
  const genders = { 'Masculin': T.gender_male, 'Féminin': T.gender_female, 'Mixte': T.gender_mixed };
  const categoriesByAgeGroup = allOpportunities.reduce((acc, curr) => {
      if (curr.ageGroup && curr.ageGroup !== 'all') {
          if (!acc[curr.ageGroup]) acc[curr.ageGroup] = [];
          if (!acc[curr.ageGroup].includes(curr.category)) acc[curr.ageGroup].push(curr.category);
      }
      return acc;
  }, {});

  const ViewToggle = () => (
    <div className="flex items-center justify-center gap-2">
        <button onClick={() => setView('list')} className={`px-4 py-2 text-sm font-semibold rounded-md ${view === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-slate-600'}`}>
            {T.view_list}
        </button>
        <button onClick={() => setView('map')} className={`px-4 py-2 text-sm font-semibold rounded-md ${view === 'map' ? 'bg-orange-600 text-white' : 'bg-white text-slate-600'}`}>
            {T.view_map}
        </button>
    </div>
  );

  return (
    <section id="search" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">{T.search_title}</h2>
          <p className="mt-4 text-slate-600">{T.search_subtitle}</p>
        </div>
        <CardBase className="mt-12 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-slate-700">{T.search_keyword}</label>
              <input type="text" name="keyword" onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_type}</label>
              <select name="type" onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.type_all}</option>
                {Object.entries(types).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_sport}</label>
              <select name="sport" onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.gender_all}</option>
                {sports.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_level}</label>
              <select name="level" onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.gender_all}</option>
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_country}</label>
              <select name="country" onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.gender_all}</option>
                {Object.entries(countriesByContinent).map(([continent, countries]) => (
                    <optgroup label={continent} key={continent}>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_gender}</label>
              <select name="gender" onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.gender_all}</option>
                {Object.entries(genders).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_category}</label>
              <select name="category" onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.gender_all}</option>
                {Object.entries(categoriesByAgeGroup).map(([ageGroup, categories]) => (
                    <optgroup label={ageGroup} key={ageGroup}>
                        {categories.sort().map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_date_start}</label>
              <input type="date" name="date" onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_date_end}</label>
              <input type="date" name="dateEnd" onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
          </div>
        </CardBase>
        <div className="mt-8 flex justify-center">
            <ViewToggle />
        </div>
        
        {view === 'list' ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.length > 0 ? opportunities.map(t => (
                <CardBase key={t.id} className="p-6 transition hover:shadow-lg hover:-translate-y-1">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-semibold text-orange-600">{t.type}</p>
                        <h3 className="mt-1 font-semibold text-slate-800">{t.name}</h3>
                        <p className="text-xs text-slate-500">{t.country} • {t.sport} {t.category !== 'all' ? `• ${t.category}` : ''}</p>
                    </div>
                    {t.level !== 'all' && <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.level === 'Elite' ? 'bg-red-100 text-red-800' : 
                        t.level === 'Competition' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }`}>{t.level}</span>}
                </div>
                {t.date !== '2025-01-01' && <p className="mt-4 text-sm text-slate-600">Date: {new Date(t.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                </CardBase>
            )) : (
                <p className="col-span-full text-center text-slate-600">{T.no_results}</p>
            )}
            </div>
        ) : (
            <div className="mt-8">
                <CardBase className="h-96 w-full flex items-center justify-center">
                    <img src="https://placehold.co/1200x400/e2e8f0/64748b?text=Vue+Carte+Bient%C3%B4t+Disponible" alt="Map view placeholder" className="w-full h-full object-cover rounded-xl"/>
                </CardBase>
            </div>
        )}
      </div>
    </section>
  );
};

const Testimonials = ({ T }) => (
  <section className="py-20 bg-white">
    <div className="mx-auto max-w-7xl px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">{T.testimonials_title}</h2>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <CardBase className="p-8 flex flex-col">
          <p className="text-slate-600 italic flex-grow">"{T.testimonials_player_quote}"</p>
          <p className="mt-4 font-semibold text-slate-800">{T.testimonials_player_name}</p>
        </CardBase>
        <CardBase className="p-8 flex flex-col">
          <p className="text-slate-600 italic flex-grow">"{T.testimonials_coach_quote}"</p>
          <p className="mt-4 font-semibold text-slate-800">{T.testimonials_coach_name}</p>
        </CardBase>
        <CardBase className="p-8 flex flex-col">
          <p className="text-slate-600 italic flex-grow">"{T.testimonials_organizer_quote}"</p>
          <p className="mt-4 font-semibold text-slate-800">{T.testimonials_organizer_name}</p>
        </CardBase>
      </div>
    </div>
  </section>
);

const Rankings = ({ T }) => {
    const [activeTab, setActiveTab] = useState('teams');

    const TabButton = ({ isActive, onClick, children }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${isActive ? 'bg-orange-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
        >
            {children}
        </button>
    );

    return (
        <section id="rankings" className="py-20 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-900">{T.rankings_title}</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-slate-600">{T.rankings_subtitle}</p>
                </div>
                <div className="mt-8 flex justify-center gap-2">
                    <TabButton isActive={activeTab === 'teams'} onClick={() => setActiveTab('teams')}>{T.rankings_tab_teams}</TabButton>
                    <TabButton isActive={activeTab === 'tournaments'} onClick={() => setActiveTab('tournaments')}>{T.rankings_tab_tournaments}</TabButton>
                </div>
                <CardBase className="mt-8 overflow-x-auto">
                    {activeTab === 'teams' ? (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">{T.rankings_col_rank}</th>
                                    <th className="px-6 py-3 font-medium">{T.rankings_col_team}</th>
                                    <th className="px-6 py-3 font-medium">{T.rankings_col_category}</th>
                                    <th className="px-6 py-3 font-medium text-center">{T.rankings_col_played}</th>
                                    <th className="px-6 py-3 font-medium text-right">{T.rankings_col_elo}</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-800">
                                {rankingsData.map((team, index) => (
                                    <tr key={team.rank} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="px-6 py-4 font-bold text-slate-500">{team.rank}</td>
                                        <td className="px-6 py-4 font-semibold"><a href="#" className="text-orange-600 hover:underline">{team.team}</a></td>
                                        <td className="px-6 py-4 text-slate-600">{team.category}</td>
                                        <td className="px-6 py-4 text-center text-slate-600">{team.played}</td>
                                        <td className="px-6 py-4 font-bold text-right text-orange-600">{team.elo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">{T.rankings_col_rank}</th>
                                    <th className="px-6 py-3 font-medium">{T.rankings_col_tournament}</th>
                                    <th className="px-6 py-3 font-medium">{T.rankings_col_country}</th>
                                    <th className="px-6 py-3 font-medium text-center">{T.rankings_col_top_teams}</th>
                                    <th className="px-6 py-3 font-medium text-right">{T.rankings_col_prestige}</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-800">
                                {tournamentRankingsData.map((t, index) => (
                                    <tr key={t.rank} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="px-6 py-4 font-bold text-slate-500">{t.rank}</td>
                                        <td className="px-6 py-4 font-semibold"><a href="#" className="text-orange-600 hover:underline">{t.name}</a></td>
                                        <td className="px-6 py-4 text-slate-600">{t.country}</td>
                                        <td className="px-6 py-4 text-center text-slate-600">{t.top20Teams}</td>
                                        <td className="px-6 py-4 font-bold text-right text-orange-600">{t.prestigeScore.toFixed(1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardBase>
            </div>
        </section>
    );
};

const ForPlayers = ({ T }) => (
    <section id="players" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900">{T.players_title}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-600">{T.players_subtitle}</p>
            <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
                <CardBase className="p-8">
                    <h3 className="text-xl font-semibold text-slate-800">{T.players_s1_title}</h3>
                    <p className="mt-2 text-slate-600">{T.players_s1_text}</p>
                </CardBase>
                <CardBase className="p-8">
                    <h3 className="text-xl font-semibold text-slate-800">{T.players_s2_title}</h3>
                    <p className="mt-2 text-slate-600">{T.players_s2_text}</p>
                </CardBase>
            </div>
            <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-slate-500 italic">{T.player_testimonial_short}</p>
            </div>
            <div className="mt-8">
                <PrimaryBtn href="#">{T.players_cta}</PrimaryBtn>
            </div>
        </div>
    </section>
);

const ForCoaches = ({ T }) => (
    <section id="coaches" className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900">{T.coaches_title}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-600">{T.coaches_subtitle}</p>
            <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
                <CardBase className="p-8">
                    <h3 className="text-xl font-semibold text-slate-800">{T.coaches_s1_title}</h3>
                    <p className="mt-2 text-slate-600">{T.coaches_s1_text}</p>
                </CardBase>
                <CardBase className="p-8">
                    <h3 className="text-xl font-semibold text-slate-800">{T.coaches_s2_title}</h3>
                    <p className="mt-2 text-slate-600">{T.coaches_s2_text}</p>
                </CardBase>
            </div>
            <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-slate-500 italic">{T.coach_testimonial_short}</p>
            </div>
            <div className="mt-8">
                <PrimaryBtn href="#">{T.coaches_cta}</PrimaryBtn>
            </div>
        </div>
    </section>
);

const ForOrganizers = ({ T }) => (
    <section id="organizers" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-slate-900">{T.organizers_title}</h2>
                    <p className="mt-4 max-w-xl mx-auto md:mx-0 text-slate-600">{T.organizers_subtitle}</p>
                    <div className="mt-6 border-t border-slate-200 pt-4">
                        <p className="text-slate-500 italic">{T.organizer_testimonial_short}</p>
                    </div>
                    <div className="mt-6 flex gap-4 justify-center md:justify-start">
                        <PrimaryBtn href="#">{T.organizers_standard_cta}</PrimaryBtn>
                        <SecondaryBtn href="#concierge">Services Premium</SecondaryBtn>
                    </div>
                </div>
                <div className="relative h-80 rounded-xl overflow-hidden">
                    <img src="organizers-background.jpg" alt="Vue aérienne d'un tournoi de sport" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/800x600/f97316/white?text=Event'; }}/>
                </div>
            </div>
        </div>
    </section>
);

const Concierge = ({ T }) => (
    <section id="concierge" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
            <img src="concierge-background.jpg" className="w-full h-full object-cover opacity-20" alt="Planning desk" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1920x1080/1e293b/f8fafc?text=Strategy'; }}/>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{T.concierge_section_title}</h2>
            <p className="mt-4 max-w-3xl mx-auto text-slate-300">{T.concierge_section_subtitle}</p>
            <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
                <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-orange-400">{T.concierge_for_players_title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{T.concierge_for_players_text}</p>
                </div>
                <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-orange-400">{T.concierge_for_coaches_title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{T.concierge_for_coaches_text}</p>
                </div>
                <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-orange-400">{T.concierge_for_organizers_title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{T.concierge_for_organizers_text}</p>
                </div>
            </div>
            <div className="mt-12">
                <PrimaryBtn href="#">{T.concierge_cta}</PrimaryBtn>
            </div>
        </div>
    </section>
);

const Roadmap = ({ T }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    const ctx = chartRef.current.getContext('2d');
    const roadmapData = [
        { task: 'Enrichissement Contenu', pillar: 'Intelligence', start: 0, end: 3 },
        { task: 'Refonte Filtres', pillar: 'Fluidité', start: 0, end: 2 },
        { task: 'Pipeline Scraping V1', pillar: 'Intelligence', start: 3, end: 8 },
        { task: 'Lancement TLI 2.0', pillar: 'Intelligence', start: 4, end: 9 },
        { task: 'Vue Cartographique', pillar: 'Fluidité', start: 5, end: 8 },
        { task: 'Version Anglaise', pillar: 'Écosystème', start: 6, end: 9 },
        { task: 'Profils Utilisateurs', pillar: 'Écosystème', start: 7, end: 9 },
    ];
    const pillarColors = { 'Fluidité': 'rgba(234, 88, 12, 0.8)', 'Intelligence': 'rgba(16, 185, 129, 0.8)', 'Écosystème': 'rgba(107, 114, 128, 0.8)' };

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: roadmapData.map(d => d.task),
        datasets: [{
          data: roadmapData.map(d => [d.start, d.end]),
          backgroundColor: roadmapData.map(d => pillarColors[d.pillar]),
          borderSkipped: false,
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        scales: {
          x: { min: 0, max: 18, title: { display: true, text: 'Mois', color: '#475569' }, ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
          y: { ticks: { color: '#334155' }, grid: { display: false } }
        },
        plugins: { legend: { display: false } }
      }
    });
    return () => chartInstance.current.destroy();
  }, []);

  return (
    <section id="roadmap" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900">{T.roadmap_title}</h2>
        <p className="text-slate-600 text-center mt-4">{T.roadmap_subtitle}</p>
        <CardBase className="mt-12 p-6 h-96">
          <canvas ref={chartRef}></canvas>
        </CardBase>
      </div>
    </section>
  );
};

const Footer = ({ T }) => (
  <footer className="border-t border-slate-200">
    <div className="mx-auto max-w-7xl px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-3 text-slate-500">
      <div>{T.footer_text}</div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-slate-800">Mentions légales</a>
        <a href="#" className="hover:text-slate-800">Contact</a>
      </div>
    </div>
  </footer>
);

// --- Composant Principal ---
export default function App() {
  const [lang, setLang] = useState('fr');
  const T = copy(lang);
  
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-screen bg-white">
      <Header T={T} lang={lang} setLang={setLang} />
      <main>
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
      </main>
      <Footer T={T} />
    </div>
  );
}
