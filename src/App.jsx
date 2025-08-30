import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";

// --- Dictionnaire de textes (i18n) ---
const copy = (lang) => {
  const dict = {
    fr: {
      nav_home: 'Accueil', nav_opportunity: 'Trouver une opportunité', nav_for_who: 'Pour...', nav_players: 'Les Joueurs', nav_coaches: 'Les Coachs', nav_organizers: 'Les Organisateurs', nav_clubs: 'Les Clubs', nav_contact: 'Contact', nav_about_us: 'Qui sommes-nous ?', nav_tournaments: 'Tournois', nav_camps: 'Camps', nav_academies: 'Académies', nav_travel_teams: 'Travel Teams',
      nav_login: 'Connexion', nav_signup: 'Inscription', nav_dashboard: 'Tableau de Bord', nav_logout: 'Déconnexion',
      h1_top: 'Moteur de recherche d’événements sportifs',
      h1_highlight: '',
      h1_sub: 'Que vous soyez joueur, coach, club ou équipe, accédez à notre annuaire multisport répertoriant des milliers de tournois, camps et académies.',
      cta_primary: 'Trouver une opportunité', cta_secondary: 'Je suis un organisateur',
      social_proof_title: 'Ils nous font confiance pour façonner l\'avenir du sport',
      search_title: 'Trouvez votre prochaine opportunité', search_subtitle: 'Utilisez nos filtres pour découvrir l\'expérience parfaite pour votre développement.',
      search_keyword: 'Mot-clé (nom, ville...)',
      filter_type: 'Type d\'opportunité', filter_sport: 'Sport', filter_level: 'Niveau', filter_country: 'Pays', filter_date_start: 'Date de début', filter_date_end: 'Date de fin', filter_gender: 'Genre', filter_category: 'Catégorie d\'âge',
      type_all: 'Toutes', type_tournament: 'Tournoi', type_camp: 'Camp', type_academy: 'Académie', type_coach: 'Coach personnel', type_venue: 'Lieu / Infrastructure', type_travel_team: 'Travel Team',
      contextual_help_travel_team: 'Une Travel Team est une équipe sélective constituée spécialement pour un déplacement ou un tournoi (hors cadre club habituel).',
      contextual_help_venue: 'Lieux où joueurs, coachs, clubs et organisateurs peuvent s’entraîner, louer des terrains, organiser des matchs ou accueillir des tournois (basket center, playground couvert, etc.).',
      view_list: 'Liste', view_map: 'Carte',
      gender_all: 'Tous', gender_male: 'Masculin', gender_female: 'Féminin', gender_mixed: 'Mixte',
      filter_all: 'Tous',
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
      rankings_col_tournament: 'Tournoi', rankings_col_prestige: 'Score Prestige', rankings_col_top_teams: 'Équipes du Top 20', rankings_col_country: 'Pays',
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
      clubs_title: 'Pour les Clubs',
      clubs_subtitle: 'Planifiez la saison de toutes vos équipes en un seul endroit.',
      clubs_s1_title: 'Tout centraliser',
      clubs_s1_text: 'Trouvez des tournois adaptés par catégorie d’âge, suivez les performances et valorisez vos résultats.',
      clubs_s2_title: 'Gagner du temps',
      clubs_s2_text: 'Gérez les inscriptions de plusieurs équipes et simplifiez la logistique.',
      clubs_cta: 'Découvrir nos solutions Clubs',
      clubs_tip: 'Astuce : créez un compte club, enregistrez vos filtres par catégories d’âge et recevez des alertes lorsqu’un nouveau tournoi correspond à vos critères.',
      organizers_title: 'Pour les Organisateurs',
      organizers_subtitle: 'Donnez à votre événement la visibilité qu\'il mérite. Rejoignez notre plateforme globale.',
      organizers_standard_cta: 'Inscrire votre événement',
      accompagnement_section_title: 'Services d’accompagnement TSK',
      accompagnement_section_subtitle: 'Un accompagnement sur-mesure pour joueurs, coachs, clubs et organisateurs.',
      accompagnement_for_players_title: 'Pour les Joueurs & Familles',
      accompagnement_for_players_text: 'Concentrez-vous sur la performance, nous gérons la logistique. Voyage, hébergement, et services sur place pour une expérience sans stress.',
      accompagnement_for_coaches_title: 'Pour les Coachs & Clubs',
      accompagnement_for_coaches_text: 'Simplifiez l\'organisation de vos déplacements. Nous proposons des solutions de groupe pour le transport, l\'hébergement et la planification.',
      accompagnement_for_organizers_title: 'Pour les Organisateurs',
      accompagnement_for_organizers_text: 'Sublimez votre événement. De la production vidéo à la gestion des réseaux sociaux, nos services premium maximisent votre impact.',
      accompagnement_cta: 'Parler à un conseiller',
      roadmap_title: 'Notre Feuille de Route pour la Communauté',
      roadmap_subtitle: 'Nous faisons évoluer constamment la plateforme avec des fonctionnalités qui vous servent.',
      footer_text: '© 2025 TSK — Le sport pour tous, simplifié.',
      contact_title: 'Contactez-nous',
      contact_subtitle: 'Une question, une suggestion, ou besoin d\'aide ? Notre équipe est là pour vous répondre.',
      contact_reason_player: 'Je suis un joueur / parent',
      contact_reason_coach: 'Je suis un coach',
      contact_reason_club: 'Je représente un club',
      contact_reason_organizer: 'Je suis un organisateur',
      contact_reason_accompagnement: 'Je souhaite en savoir plus sur les services d’accompagnement',
      contact_reason_other: 'Autre',
      contact_name: 'Votre nom',
      contact_email: 'Votre email',
      contact_subject: 'Sujet de votre message',
      contact_message: 'Votre message',
      contact_send: 'Envoyer le message',
      contact_success: 'Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.',
      about_us_title: 'Notre Mission',
      about_us_subtitle: 'Rendre le sport accessible et révéler le potentiel de chaque athlète.',
      about_us_p1: 'TSK Sport est né d\'une passion commune pour le sport et d\'un constat simple : l\'accès à l\'information et aux opportunités sportives est fragmenté et complexe. Notre plateforme a pour but de centraliser, de simplifier et de démocratiser l\'accès au développement sportif.',
      about_us_p2: 'Nous connectons les joueurs, les coachs, les clubs et les organisateurs pour créer un écosystème vertueux où le talent peut s\'épanouir. Grâce à nos outils de recherche, nos classements et nos services, nous accompagnons chaque acteur du monde sportif dans son parcours vers l\'excellence.',
      auth_login_title: 'Se connecter à votre compte',
      auth_signup_title: 'Créer un compte TSK',
      auth_email: 'Adresse email',
      auth_password: 'Mot de passe',
      auth_login_btn: 'Connexion',
      auth_signup_btn: 'Créer mon compte',
      auth_no_account: 'Pas encore de compte ?',
      auth_has_account: 'Déjà un compte ?',
      dashboard_welcome: 'Bienvenue sur votre tableau de bord',
      dashboard_propose_cta: 'Proposer une opportunité',
      propose_title: 'Proposer une nouvelle opportunité',
      propose_subtitle: 'Remplissez ce formulaire pour ajouter votre événement, camp ou académie à la plateforme TSK.',
      propose_name: 'Nom de l\'opportunité',
      propose_submit: 'Soumettre pour validation',
      propose_success: 'Merci ! Votre opportunité a été soumise et sera examinée par notre équipe.',
      alt_logo: 'Logo TSK',
      alt_hero: 'Jeune athlète concentré avant une compétition',
      alt_organizers_bg: 'Vue aérienne d\'un tournoi de sport',
      alt_accompagnement_bg: 'Bureau de planification',
      alt_map_placeholder: 'Vue carte bientôt disponible'
    },
    en: {
      nav_home: 'Home', nav_opportunity: 'Find Opportunity', nav_for_who: 'For...', nav_players: 'Players', nav_coaches: 'Coaches', nav_organizers: 'Organizers', nav_clubs: 'Clubs', nav_contact: 'Contact', nav_about_us: 'About Us', nav_tournaments: 'Tournaments', nav_camps: 'Camps', nav_academies: 'Academies', nav_travel_teams: 'Travel Teams',
      nav_login: 'Login', nav_signup: 'Sign Up', nav_dashboard: 'Dashboard', nav_logout: 'Logout',
      h1_top: 'Sports Event Search Engine',
      h1_highlight: '',
      h1_sub: 'Whether you are a player, coach, club, or team, access our multi-sport directory listing thousands of tournaments, camps, and academies.',
      cta_primary: 'Find an opportunity', cta_secondary: 'I am an organizer',
      social_proof_title: 'Trusted by them to shape the future of sports',
      search_title: 'Find Your Next Opportunity', search_subtitle: 'Use our filters to discover the perfect experience for your development.',
      search_keyword: 'Keyword (name, city...)',
      filter_type: 'Opportunity Type', filter_sport: 'Sport', filter_level: 'Level', filter_country: 'Country', filter_date_start: 'Start Date', filter_date_end: 'End Date', filter_gender: 'Gender', filter_category: 'Age Category',
      type_all: 'All', type_tournament: 'Tournament', type_camp: 'Camp', type_academy: 'Academy', type_coach: 'Personal Coach', type_venue: 'Venue / Infrastructure', type_travel_team: 'Travel Team',
      contextual_help_travel_team: 'A Travel Team is a selective team formed specifically for a trip or tournament (outside the usual club framework).',
      contextual_help_venue: 'Venues where players, coaches, clubs, and organizers can train, rent courts, organize matches, or host tournaments (basketball center, indoor playground, etc.).',
      view_list: 'List', view_map: 'Map',
      gender_all: 'All', gender_male: 'Male', gender_female: 'Female', gender_mixed: 'Mixed',
      filter_all: 'All',
      no_results: 'No opportunities match your criteria. Try adjusting your filters.',
      testimonials_title: 'What our community is saying',
      testimonials_player_quote: '"Thanks to TSK, I found a summer camp in Spain that completely changed my game. The rankings helped me choose an event with the right level of competition."',
      testimonials_player_name: 'Lucas, U17 Player',
      testimonials_coach_quote: '"The competition analysis tool is a game-changer. I can prepare my season by identifying the most relevant tournaments and studying the teams we will face. An invaluable time saver."',
      testimonials_coach_name: 'Coach Dubois, Basketball Club',
      testimonials_organizer_quote: '"Listing our tournament on TSK gave us international visibility we would never have had otherwise. Registration management is simple and effective. We had 20% more participants this year."',
      testimonials_organizer_name: 'Marie, Paris Youth Cup Organizer',
      rankings_title: 'TSK Rankings',
      rankings_subtitle: 'Track progress, assess the competition, and identify the best opportunities.',
      rankings_tab_teams: 'Team Rankings', rankings_tab_tournaments: 'Tournament Rankings',
      rankings_col_rank: 'Rank', rankings_col_team: 'Team', rankings_col_category: 'Category', rankings_col_played: 'Played', rankings_col_elo: 'TSK Rating',
      rankings_col_tournament: 'Tournament', rankings_col_prestige: 'Prestige Score', rankings_col_top_teams: 'Top 20 Teams', rankings_col_country: 'Country',
      players_title: 'For Players',
      players_subtitle: 'Your talent is unique. Your next step awaits.',
      players_s1_title: 'Join a Travel Team', players_s1_text: 'Sign up solo or in a small group to join competitive teams formed for specific tournaments. A unique opportunity to travel and compete against the best.',
      players_s2_title: 'Join a Development Camp', players_s2_text: 'Find summer camps or intensive clinics to develop your skills with renowned coaches.',
      players_cta: 'Discover opportunities',
      coaches_title: 'For Coaches',
      coaches_subtitle: 'From scouting to strategy. Gain a competitive edge.',
      coaches_s1_title: 'Custom Alerts', coaches_s1_text: 'Save your search filters and receive notifications as soon as a new opportunity matching your criteria is added.',
      coaches_s2_title: 'Competition Analysis', coaches_s2_text: 'Use our rankings and past results to prepare your teams and define your strategy for the season.',
      coaches_cta: 'Optimize my season',
      clubs_title: 'For Clubs',
      clubs_subtitle: 'Plan the season for all your teams in one place.',
      clubs_s1_title: 'Centralize Everything',
      clubs_s1_text: 'Find suitable tournaments by age category, track performance, and showcase your results.',
      clubs_s2_title: 'Save Time',
      clubs_s2_text: 'Manage registrations for multiple teams and simplify logistics.',
      clubs_cta: 'Discover our Club Solutions',
      clubs_tip: 'Tip: create a club account, save your filters by age category, and receive alerts when a new tournament matches your criteria.',
      organizers_title: 'For Organizers',
      organizers_subtitle: 'Give your event the visibility it deserves. Join our global platform.',
      organizers_standard_cta: 'List your event',
      accompagnement_section_title: 'TSK Support Services',
      accompagnement_section_subtitle: 'Tailored support for players, coaches, clubs, and organizers.',
      accompagnement_for_players_title: 'For Players & Families',
      accompagnement_for_players_text: 'Focus on performance, we handle the logistics. Travel, accommodation, and on-site services for a stress-free experience.',
      accompagnement_for_coaches_title: 'For Coaches & Clubs',
      accompagnement_for_coaches_text: 'Simplify your travel arrangements. We offer group solutions for transportation, lodging, and scheduling.',
      accompagnement_for_organizers_title: 'For Organizers',
      accompagnement_for_organizers_text: 'Elevate your event. From video production to social media management, our premium services maximize your impact.',
      accompagnement_cta: 'Speak to an advisor',
      roadmap_title: 'Our Community Roadmap',
      roadmap_subtitle: 'We are constantly evolving the platform with features that serve you.',
      footer_text: '© 2025 TSK — Sports for everyone, simplified.',
      contact_title: 'Contact Us',
      contact_subtitle: 'Have a question, a suggestion, or need help? Our team is here to answer you.',
      contact_reason_player: 'I am a player / parent',
      contact_reason_coach: 'I am a coach',
      contact_reason_club: 'I represent a club',
      contact_reason_organizer: 'I am an organizer',
      contact_reason_accompagnement: 'I want to know more about support services',
      contact_reason_other: 'Other',
      contact_name: 'Your name',
      contact_email: 'Your email',
      contact_subject: 'Subject of your message',
      contact_message: 'Your message',
      contact_send: 'Send message',
      contact_success: 'Thank you! Your message has been sent. We will get back to you as soon as possible.',
      about_us_title: 'Our Mission',
      about_us_subtitle: 'Making sports accessible and unlocking every athlete\'s potential.',
      about_us_p1: 'TSK Sport was born from a shared passion for sports and a simple observation: access to sports information and opportunities is fragmented and complex. Our platform aims to centralize, simplify, and democratize access to sports development.',
      about_us_p2: 'We connect players, coaches, clubs, and organizers to create a virtuous ecosystem where talent can flourish. Through our search tools, rankings, and services, we support every actor in the sports world on their journey to excellence.',
      auth_login_title: 'Log in to your account',
      auth_signup_title: 'Create a TSK account',
      auth_email: 'Email address',
      auth_password: 'Password',
      auth_login_btn: 'Login',
      auth_signup_btn: 'Create my account',
      auth_no_account: 'Don\'t have an account yet?',
      auth_has_account: 'Already have an account?',
      dashboard_welcome: 'Welcome to your dashboard',
      dashboard_propose_cta: 'Propose an opportunity',
      propose_title: 'Propose a New Opportunity',
      propose_subtitle: 'Fill out this form to add your event, camp, or academy to the TSK platform.',
      propose_name: 'Opportunity Name',
      propose_submit: 'Submit for review',
      propose_success: 'Thank you! Your opportunity has been submitted and will be reviewed by our team.',
      alt_logo: 'TSK Logo',
      alt_hero: 'Young athlete focused before a competition',
      alt_organizers_bg: 'Aerial view of a sports tournament',
      alt_accompagnement_bg: 'Planning desk',
      alt_map_placeholder: 'Map view coming soon'
    },
    es: {
      nav_home: 'Inicio', nav_opportunity: 'Encontrar Oportunidad', nav_for_who: 'Para...', nav_players: 'Jugadores', nav_coaches: 'Entrenadores', nav_organizers: 'Organizadores', nav_clubs: 'Clubes', nav_contact: 'Contacto', nav_about_us: 'Quiénes somos', nav_tournaments: 'Torneos', nav_camps: 'Campamentos', nav_academies: 'Academias', nav_travel_teams: 'Equipos de Viaje',
      nav_login: 'Iniciar Sesión', nav_signup: 'Registrarse', nav_dashboard: 'Panel', nav_logout: 'Cerrar Sesión',
      h1_top: 'Motor de búsqueda de eventos deportivos',
      h1_highlight: '',
      h1_sub: 'Ya seas jugador, entrenador, club o equipo, accede a nuestro directorio multideporte que lista miles de torneos, campamentos y academias.',
      cta_primary: 'Encontrar una oportunidad', cta_secondary: 'Soy un organizador',
      social_proof_title: 'Confían en nosotros para dar forma al futuro del deporte',
      search_title: 'Encuentra tu Próxima Oportunidad', search_subtitle: 'Usa nuestros filtros para descubrir la experiencia perfecta para tu desarrollo.',
      search_keyword: 'Palabra clave (nombre, ciudad...)',
      filter_type: 'Tipo de oportunidad', filter_sport: 'Deporte', filter_level: 'Nivel', filter_country: 'País', filter_date_start: 'Fecha de inicio', filter_date_end: 'Fecha de fin', filter_gender: 'Género', filter_category: 'Categoría de edad',
      type_all: 'Todos', type_tournament: 'Torneo', type_camp: 'Campamento', type_academy: 'Academia', type_coach: 'Entrenador personal', type_venue: 'Lugar / Infraestructura', type_travel_team: 'Equipo de Viaje',
      contextual_help_travel_team: 'Un Travel Team es un equipo selectivo formado específicamente para un viaje o torneo (fuera del marco habitual del club).',
      contextual_help_venue: 'Lugares donde jugadores, entrenadores, clubes y organizadores pueden entrenar, alquilar canchas, organizar partidos o albergar torneos (centro de baloncesto, cancha cubierta, etc.).',
      view_list: 'Lista', view_map: 'Mapa',
      gender_all: 'Todos', gender_male: 'Masculino', gender_female: 'Femenino', gender_mixed: 'Mixto',
      filter_all: 'Todos',
      no_results: 'Ninguna oportunidad coincide con tus criterios. Intenta ajustar tus filtros.',
      testimonials_title: 'Lo que nuestra comunidad dice',
      testimonials_player_quote: '"Gracias a TSK, encontré un campamento de verano en España que cambió mi juego por completo. Los rankings me ayudaron a elegir un evento con el nivel de competencia adecuado."',
      testimonials_player_name: 'Lucas, Jugador U17',
      testimonials_coach_quote: '"La herramienta de análisis de la competencia es revolucionaria. Puedo preparar mi temporada identificando los torneos más relevantes y estudiando a los equipos que enfrentaremos. Un ahorro de tiempo inestimable."',
      testimonials_coach_name: 'Entrenador Dubois, Club de Baloncesto',
      testimonials_organizer_quote: '"Inscribir nuestro torneo en TSK nos dio una visibilidad internacional que nunca hubiéramos tenido. La gestión de inscripciones es simple y eficaz. Tuvimos un 20% más de participantes este año."',
      testimonials_organizer_name: 'Marie, Organizadora de la Paris Youth Cup',
      rankings_title: 'Rankings TSK',
      rankings_subtitle: 'Sigue el progreso, evalúa la competencia e identifica las mejores oportunidades.',
      rankings_tab_teams: 'Rankings de Equipos', rankings_tab_tournaments: 'Rankings de Torneos',
      rankings_col_rank: 'Rango', rankings_col_team: 'Equipo', rankings_col_category: 'Categoría', rankings_col_played: 'Jugados', rankings_col_elo: 'Puntuación TSK',
      rankings_col_tournament: 'Torneo', rankings_col_prestige: 'Puntuación de Prestigio', rankings_col_top_teams: 'Equipos Top 20', rankings_col_country: 'País',
      players_title: 'Para Jugadores',
      players_subtitle: 'Tu talento es único. Tu próximo paso te espera.',
      players_s1_title: 'Únete a un Equipo de Viaje', players_s1_text: 'Inscríbete solo o en un grupo pequeño para unirte a equipos competitivos formados para torneos específicos. Una oportunidad única para viajar y competir contra los mejores.',
      players_s2_title: 'Únete a un Campamento de Desarrollo', players_s2_text: 'Encuentra campamentos de verano o cursos intensivos para desarrollar tus habilidades con entrenadores de renombre.',
      players_cta: 'Descubrir oportunidades',
      coaches_title: 'Para Entrenadores',
      coaches_subtitle: 'De la búsqueda a la estrategia. Obtén una ventaja competitiva.',
      coaches_s1_title: 'Alertas Personalizadas', coaches_s1_text: 'Guarda tus filtros de búsqueda y recibe notificaciones tan pronto como se agregue una nueva oportunidad que coincida con tus criterios.',
      coaches_s2_title: 'Análisis de la Competencia', coaches_s2_text: 'Utiliza nuestros rankings y resultados pasados para preparar a tus equipos y definir tu estrategia para la temporada.',
      coaches_cta: 'Optimizar mi temporada',
      clubs_title: 'Para Clubes',
      clubs_subtitle: 'Planifica la temporada de todos tus equipos en un solo lugar.',
      clubs_s1_title: 'Centralizar todo',
      clubs_s1_text: 'Encuentra torneos adecuados por categoría de edad, sigue el rendimiento y valora tus resultados.',
      clubs_s2_title: 'Ahorrar tiempo',
      clubs_s2_text: 'Gestiona las inscripciones de varios equipos y simplifica la logística.',
      clubs_cta: 'Descubrir nuestras soluciones para Clubes',
      clubs_tip: 'Consejo: cree una cuenta de club, guarde sus filtros por categoría de edad y reciba alertas cuando un nuevo torneo coincida con sus criterios.',
      organizers_title: 'Para Organizadores',
      organizers_subtitle: 'Dale a tu evento la visibilidad que merece. Únete a nuestra plataforma global.',
      organizers_standard_cta: 'Inscribe tu evento',
      accompagnement_section_title: 'Servicios de Acompañamiento TSK',
      accompagnement_section_subtitle: 'Un apoyo a medida para jugadores, entrenadores, clubes y organizadores.',
      accompagnement_for_players_title: 'Para Jugadores y Familias',
      accompagnement_for_players_text: 'Concéntrese en el rendimiento, nosotros nos encargamos de la logística. Viajes, alojamiento y servicios in situ para una experiencia sin estrés.',
      accompagnement_for_coaches_title: 'Para Entrenadores y Clubes',
      accompagnement_for_coaches_text: 'Simplifica la organización de tus viajes. Ofrecemos soluciones grupales para transporte, alojamiento y planificación.',
      accompagnement_for_organizers_title: 'Para Organizadores',
      accompagnement_for_organizers_text: 'Realza tu evento. Desde la producción de video hasta la gestión de redes sociales, nuestros servicios premium maximizan tu impacto.',
      accompagnement_cta: 'Hablar con un asesor',
      roadmap_title: 'Nuestra Hoja de Ruta para la Comunidad',
      roadmap_subtitle: 'Estamos constantemente evolucionando la plataforma con características que te sirven.',
      footer_text: '© 2025 TSK — Deporte para todos, simplificado.',
      contact_title: 'Contáctanos',
      contact_subtitle: '¿Tienes una pregunta, una sugerencia o necesitas ayuda? Nuestro equipo está aquí para responderte.',
      contact_reason_player: 'Soy un jugador / padre',
      contact_reason_coach: 'Soy un entrenador',
      contact_reason_club: 'Represento a un club',
      contact_reason_organizer: 'Soy un organizador',
      contact_reason_accompagnement: 'Quiero saber más sobre los servicios de acompañamiento',
      contact_reason_other: 'Otro',
      contact_name: 'Tu nombre',
      contact_email: 'Tu correo electrónico',
      contact_subject: 'Asunto de tu mensaje',
      contact_message: 'Tu mensaje',
      contact_send: 'Enviar mensaje',
      contact_success: '¡Gracias! Tu mensaje ha sido enviado. Nos pondremos en contacto contigo lo antes posible.',
      about_us_title: 'Nuestra Misión',
      about_us_subtitle: 'Hacer el deporte accesible y revelar el potencial de cada atleta.',
      about_us_p1: 'TSK Sport nació de una pasión compartida por el deporte y una simple observación: el acceso a la información y a las oportunidades deportivas está fragmentado y es complejo. Nuestra plataforma tiene como objetivo centralizar, simplificar y democratizar el acceso al desarrollo deportivo.',
      about_us_p2: 'Conectamos a jugadores, entrenadores, clubes y organizadores para crear un ecosistema virtuoso donde el talento pueda florecer. A través de nuestras herramientas de búsqueda, clasificaciones y servicios, apoyamos a cada actor del mundo del deporte en su camino hacia la excelencia.',
      auth_login_title: 'Iniciar sesión en tu cuenta',
      auth_signup_title: 'Crear una cuenta TSK',
      auth_email: 'Dirección de correo electrónico',
      auth_password: 'Contraseña',
      auth_login_btn: 'Iniciar sesión',
      auth_signup_btn: 'Crear mi cuenta',
      auth_no_account: '¿Aún no tienes una cuenta?',
      auth_has_account: '¿Ya tienes una cuenta?',
      dashboard_welcome: 'Bienvenido a tu panel',
      dashboard_propose_cta: 'Proponer una oportunidad',
      propose_title: 'Proponer una Nueva Oportunidad',
      propose_subtitle: 'Completa este formulario para agregar tu evento, campamento o academia a la plataforma TSK.',
      propose_name: 'Nombre de la Oportunidad',
      propose_submit: 'Enviar para revisión',
      propose_success: '¡Gracias! Tu oportunidad ha sido enviada y será revisada por nuestro equipo.',
      alt_logo: 'Logo TSK',
      alt_hero: 'Joven atleta concentrado antes de una competición',
      alt_organizers_bg: 'Vista aérea de un torneo deportivo',
      alt_accompagnement_bg: 'Escritorio de planificación',
      alt_map_placeholder: 'Vista de mapa disponible pronto'
    },
    de: {
      nav_home: 'Startseite', nav_opportunity: 'Gelegenheit finden', nav_for_who: 'Für...', nav_players: 'Spieler', nav_coaches: 'Trainer', nav_organizers: 'Veranstalter', nav_clubs: 'Vereine', nav_contact: 'Kontakt', nav_about_us: 'Über uns', nav_tournaments: 'Turniere', nav_camps: 'Camps', nav_academies: 'Akademien', nav_travel_teams: 'Reiseteams',
      nav_login: 'Anmelden', nav_signup: 'Registrieren', nav_dashboard: 'Dashboard', nav_logout: 'Abmelden',
      h1_top: 'Suchmaschine für Sportveranstaltungen',
      h1_highlight: '',
      h1_sub: 'Ob Spieler, Trainer, Verein oder Team, greifen Sie auf unser Multisportverzeichnis zu, das Tausende von Turnieren, Camps und Akademien auflistet.',
      cta_primary: 'Eine Gelegenheit finden', cta_secondary: 'Ich bin ein Veranstalter',
      social_proof_title: 'Sie vertrauen uns, die Zukunft des Sports zu gestalten',
      search_title: 'Finde deine nächste Gelegenheit', search_subtitle: 'Nutze unsere Filter, um die perfekte Erfahrung für deine Entwicklung zu entdecken.',
      search_keyword: 'Stichwort (Name, Stadt...)',
      filter_type: 'Art der Gelegenheit', filter_sport: 'Sport', filter_level: 'Niveau', filter_country: 'Land', filter_date_start: 'Startdatum', filter_date_end: 'Enddatum', filter_gender: 'Geschlecht', filter_category: 'Alterskategorie',
      type_all: 'Alle', type_tournament: 'Turnier', type_camp: 'Camp', type_academy: 'Akademie', type_coach: 'Personal Trainer', type_venue: 'Ort / Infrastruktur', type_travel_team: 'Reiseteam',
      contextual_help_travel_team: 'Ein Travel Team ist eine Auswahlmannschaft, die speziell für eine Reise oder ein Turnier gebildet wird (außerhalb des üblichen Vereinsrahmens).',
      contextual_help_venue: 'Orte, an denen Spieler, Trainer, Vereine und Organisatoren trainieren, Plätze mieten, Spiele organisieren oder Turniere ausrichten können (Basketballzentrum, überdachter Spielplatz usw.).',
      view_list: 'Liste', view_map: 'Karte',
      gender_all: 'Alle', gender_male: 'Männlich', gender_female: 'Weiblich', gender_mixed: 'Gemischt',
      filter_all: 'Alle',
      no_results: 'Keine Gelegenheiten entsprechen Ihren Kriterien. Versuchen Sie, Ihre Filter anzupassen.',
      testimonials_title: 'Was unsere Gemeinschaft sagt',
      testimonials_player_quote: '"Dank TSK habe ich ein Sommercamp in Spanien gefunden, das mein Spiel komplett verändert hat. Die Ranglisten haben mir geholfen, ein Event mit dem richtigen Wettbewerbsniveau auszuwählen."',
      testimonials_player_name: 'Lucas, U17-Spieler',
      testimonials_coach_quote: '"Das Wettbewerbsanalyse-Tool ist ein Game-Changer. Ich kann meine Saison vorbereiten, indem ich die relevantesten Turniere identifiziere und die Teams studiere, gegen die wir antreten werden. Eine unschätzbare Zeitersparnis."',
      testimonials_coach_name: 'Trainer Dubois, Basketballverein',
      testimonials_organizer_quote: '"Die Auflistung unseres Turniers auf TSK hat uns eine internationale Sichtbarkeit verschafft, die wir sonst nie gehabt hätten. Die Anmeldungsverwaltung ist einfach und effektiv. Wir hatten dieses Jahr 20 % mehr Teilnehmer."',
      testimonials_organizer_name: 'Marie, Organisatorin des Paris Youth Cup',
      rankings_title: 'TSK-Ranglisten',
      rankings_subtitle: 'Verfolgen Sie den Fortschritt, bewerten Sie den Wettbewerb und identifizieren Sie die besten Möglichkeiten.',
      rankings_tab_teams: 'Team-Ranglisten', rankings_tab_tournaments: 'Turnier-Ranglisten',
      rankings_col_rank: 'Rang', rankings_col_team: 'Team', rankings_col_category: 'Kategorie', rankings_col_played: 'Gespielt', rankings_col_elo: 'TSK-Bewertung',
      rankings_col_tournament: 'Turnier', rankings_col_prestige: 'Prestige-Punktzahl', rankings_col_top_teams: 'Top-20-Teams', rankings_col_country: 'Land',
      players_title: 'Für Spieler',
      players_subtitle: 'Dein Talent ist einzigartig. Dein nächster Schritt wartet.',
      players_s1_title: 'Tritt einem Reiseteam bei', players_s1_text: 'Melde dich allein oder in einer kleinen Gruppe an, um wettbewerbsfähigen Teams beizutreten, die für bestimmte Turniere gebildet werden. Eine einzigartige Gelegenheit zu reisen und sich mit den Besten zu messen.',
      players_s2_title: 'Nimm an einem Entwicklungscamp teil', players_s2_text: 'Finde Sommercamps oder Intensivkurse, um deine Fähigkeiten mit renommierten Trainern zu entwickeln.',
      players_cta: 'Möglichkeiten entdecken',
      coaches_title: 'Für Trainer',
      coaches_subtitle: 'Von der Suche zur Strategie. Verschaffen Sie sich einen Wettbewerbsvorteil.',
      coaches_s1_title: 'Benutzerdefinierte Benachrichtigungen', coaches_s1_text: 'Speichern Sie Ihre Suchfilter und erhalten Sie Benachrichtigungen, sobald eine neue Gelegenheit hinzugefügt wird, die Ihren Kriterien entspricht.',
      coaches_s2_title: 'Wettbewerbsanalyse', coaches_s2_text: 'Nutzen Sie unsere Ranglisten und vergangenen Ergebnisse, um Ihre Teams vorzubereiten und Ihre Strategie für die Saison festzulegen.',
      coaches_cta: 'Meine Saison optimieren',
      clubs_title: 'Für Vereine',
      clubs_subtitle: 'Planen Sie die Saison für alle Ihre Teams an einem Ort.',
      clubs_s1_title: 'Alles zentralisieren',
      clubs_s1_text: 'Finden Sie passende Turniere nach Altersklasse, verfolgen Sie die Leistungen und werten Sie Ihre Ergebnisse auf.',
      clubs_s2_title: 'Zeit sparen',
      clubs_s2_text: 'Verwalten Sie die Anmeldungen für mehrere Teams und vereinfachen Sie die Logistik.',
      clubs_cta: 'Entdecken Sie unsere Vereinslösungen',
      clubs_tip: 'Tipp: Erstellen Sie ein Vereinskonto, speichern Sie Ihre Filter nach Altersklassen und erhalten Sie Benachrichtigungen, wenn ein neues Turnier Ihren Kriterien entspricht.',
      organizers_title: 'Für Veranstalter',
      organizers_subtitle: 'Geben Sie Ihrer Veranstaltung die Sichtbarkeit, die sie verdient. Treten Sie unserer globalen Plattform bei.',
      organizers_standard_cta: 'Ihre Veranstaltung eintragen',
      accompagnement_section_title: 'TSK Begleitdienste',
      accompagnement_section_subtitle: 'Maßgeschneiderte Unterstützung für Spieler, Trainer, Vereine und Organisatoren.',
      accompagnement_for_players_title: 'Für Spieler & Familien',
      accompagnement_for_players_text: 'Konzentrieren Sie sich auf die Leistung, wir kümmern uns um die Logistik. Reisen, Unterkunft und Dienstleistungen vor Ort für ein stressfreies Erlebnis.',
      accompagnement_for_coaches_title: 'Für Trainer & Vereine',
      accompagnement_for_coaches_text: 'Vereinfachen Sie Ihre Reiseorganisation. Wir bieten Gruppenlösungen für Transport, Unterkunft und Planung.',
      accompagnement_for_organizers_title: 'Für Veranstalter',
      accompagnement_for_organizers_text: 'Werten Sie Ihre Veranstaltung auf. Von der Videoproduktion bis zum Social-Media-Management maximieren unsere Premium-Services Ihre Wirkung.',
      accompagnement_cta: 'Mit einem Berater sprechen',
      roadmap_title: 'Unsere Community-Roadmap',
      roadmap_subtitle: 'Wir entwickeln die Plattform ständig mit Funktionen weiter, die Ihnen dienen.',
      footer_text: '© 2025 TSK — Sport für alle, vereinfacht.',
      contact_title: 'Kontaktieren Sie uns',
      contact_subtitle: 'Haben Sie eine Frage, einen Vorschlag oder benötigen Sie Hilfe? Unser Team ist hier, um Ihnen zu antworten.',
      contact_reason_player: 'Ich bin ein Spieler / Elternteil',
      contact_reason_coach: 'Ich bin ein Trainer',
      contact_reason_club: 'Ich vertrete einen Verein',
      contact_reason_organizer: 'Ich bin ein Veranstalter',
      contact_reason_accompagnement: 'Ich möchte mehr über die Unterstützungsdienste erfahren',
      contact_reason_other: 'Andere',
      contact_name: 'Ihr Name',
      contact_email: 'Ihre E-Mail',
      contact_subject: 'Betreff Ihrer Nachricht',
      contact_message: 'Ihre Nachricht',
      contact_send: 'Nachricht senden',
      contact_success: 'Vielen Dank! Ihre Nachricht wurde gesendet. Wir werden uns so schnell wie möglich bei Ihnen melden.',
      about_us_title: 'Unsere Mission',
      about_us_subtitle: 'Den Sport zugänglich machen und das Potenzial jedes Athleten freisetzen.',
      about_us_p1: 'TSK Sport entstand aus einer gemeinsamen Leidenschaft für den Sport und einer einfachen Beobachtung: Der Zugang zu Sportinformationen und -möglichkeiten ist fragmentiert und komplex. Unsere Plattform zielt darauf ab, den Zugang zur sportlichen Entwicklung zu zentralisieren, zu vereinfachen und zu demokratisieren.',
      about_us_p2: 'Wir verbinden Spieler, Trainer, Vereine und Organisatoren, um ein förderliches Ökosystem zu schaffen, in dem Talent gedeihen kann. Durch unsere Suchwerkzeuge, Ranglisten und Dienstleistungen unterstützen wir jeden Akteur in der Sportwelt auf seinem Weg zur Exzellenz.',
      auth_login_title: 'In Ihr Konto einloggen',
      auth_signup_title: 'Ein TSK-Konto erstellen',
      auth_email: 'E-Mail-Adresse',
      auth_password: 'Passwort',
      auth_login_btn: 'Anmelden',
      auth_signup_btn: 'Mein Konto erstellen',
      auth_no_account: 'Noch kein Konto?',
      auth_has_account: 'Haben Sie bereits ein Konto?',
      dashboard_welcome: 'Willkommen in Ihrem Dashboard',
      dashboard_propose_cta: 'Eine Gelegenheit vorschlagen',
      propose_title: 'Eine neue Gelegenheit vorschlagen',
      propose_subtitle: 'Füllen Sie dieses Formular aus, um Ihre Veranstaltung, Ihr Camp oder Ihre Akademie zur TSK-Plattform hinzuzufügen.',
      propose_name: 'Name der Gelegenheit',
      propose_submit: 'Zur Überprüfung einreichen',
      propose_success: 'Vielen Dank! Ihre Gelegenheit wurde eingereicht und wird von unserem Team überprüft.',
      alt_logo: 'TSK Logo',
      alt_hero: 'Junger Athlet vor dem Wettkampf',
      alt_organizers_bg: 'Luftaufnahme eines Sportturniers',
      alt_accompagnement_bg: 'Planungstisch',
      alt_map_placeholder: 'Kartenansicht bald verfügbar'
    }
  };
  return dict[lang] || dict['fr'];
};

// --- Locales util ---
const locales = { fr: 'fr-FR', en: 'en-US', es: 'es-ES', de: 'de-DE' };

// --- Mock Data ---
const allOpportunities = [
  { id: 1, type: 'Tournoi', name: 'La Roda Future Stars', sport: 'Basketball', level: 'Elite', country: 'Espagne', continent: 'Europe', date: '2025-07-15', gender: 'Masculin', category: 'U16', ageGroup: 'Formation' },
  { id: 2, type: 'Tournoi', name: 'Bataille d’Alsace', sport: 'Basketball', level: 'Elite', country: 'France', continent: 'Europe', date: '2025-05-20', gender: 'Féminin', category: 'U15', ageGroup: 'Formation' },
  { id: 3, type: 'Tournoi', name: 'Paris Youth Cup', sport: 'Football', level: 'Competition', country: 'France', continent: 'Europe', date: '2025-06-10', gender: 'Masculin', category: 'U15', ageGroup: 'Formation' },
  { id: 4, type: 'Camp', name: 'Berlin Skills Camp', sport: 'Tennis', level: 'Loisir', country: 'Allemagne', continent: 'Europe', date: '2025-08-01', gender: 'Mixte', category: 'U14', ageGroup: 'Pré-formation' },
  { id: 5, type: 'Académie', name: 'Madrid Tennis Academy', sport: 'Tennis', level: 'Competition', country: 'Espagne', continent: 'Europe', date: '2025-09-05', gender: 'Féminin', category: 'U16', ageGroup: 'Formation' },
  { id: 6, type: 'Tournoi', name: 'Munich Football Fest', sport: 'Football', level: 'Elite', country: 'Allemagne', continent: 'Europe', date: '2025-07-22', gender: 'Masculin', category: 'U14', ageGroup: 'Pré-formation' },
  { id: 7, type: 'Camp', name: 'Lyon Hoops Camp', sport: 'Basketball', level: 'Loisir', country: 'France', continent: 'Europe', date: '2025-06-30', gender: 'Mixte', category: 'U14', ageGroup: 'Pré-formation' },
  { id: 8, type: 'Académie', name: 'IMG Academy', sport: 'Football', level: 'Elite', country: 'USA', continent: 'Amérique du Nord', date: '2025-08-10', gender: 'Masculin', category: 'U17', ageGroup: 'Formation' },
  { id: 9, type: 'Coach personnel', name: 'Coach Martin - Shooting Expert', sport: 'Basketball', level: 'Elite', country: 'France', continent: 'Europe', date: '2025-01-01', gender: 'Mixte', category: 'all', ageGroup: 'all' },
  { id: 10, type: 'Lieu / Infrastructure', name: 'Hoops Factory Paris', sport: 'Basketball', level: 'all', country: 'France', continent: 'Europe', date: '2025-01-01', gender: 'Mixte', category: 'all', ageGroup: 'all' },
  { id: 11, type: 'Tournoi', name: 'Toronto Youth Games', sport: 'Football', level: 'Competition', country: 'Canada', continent: 'Amérique du Nord', date: '2025-07-20', gender: 'Mixte', category: 'U12', ageGroup: 'Pré-formation' },
  { id: 12, type: 'Camp', name: 'Rio de Janeiro Beach Soccer', sport: 'Football', level: 'Loisir', country: 'Brésil', continent: 'Amérique du Sud', date: '2025-08-05', gender: 'Masculin', category: 'U18', ageGroup: 'Formation' },
  { id: 13, type: 'Tournoi', name: 'London Premier Cup', sport: 'Football', level: 'Elite', country: 'Angleterre', continent: 'Europe', date: '2025-06-15', gender: 'Masculin', category: 'U19', ageGroup: 'Formation' },
  { id: 14, type: 'Académie', name: 'Sydney Sports Academy', sport: 'Tennis', level: 'Elite', country: 'Australie', continent: 'Océanie', date: '2025-01-10', gender: 'Mixte', category: 'U21', ageGroup: 'Formation' },
  { id: 15, type: 'Camp', name: 'Shanghai Basketball Camp', sport: 'Basketball', level: 'Competition', country: 'Chine', continent: 'Asie', date: '2025-07-25', gender: 'Masculin', category: 'U20', ageGroup: 'Formation' },
  { id: 16, type: 'Tournoi', name: 'Tokyo Junior Masters', sport: 'Tennis', level: 'Elite', country: 'Japon', continent: 'Asie', date: '2025-04-10', gender: 'Féminin', category: 'U18', ageGroup: 'Formation' },
  { id: 17, type: 'Tournoi', name: 'Belgrade Future Stars', sport: 'Basketball', level: 'Elite', country: 'Serbie', continent: 'Europe', date: '2025-08-20', gender: 'Masculin', category: 'U13', ageGroup: 'Pré-formation' },
  { id: 18, type: 'Tournoi', name: 'Mini Basket Tournoi', sport: 'Basketball', level: 'Loisir', country: 'France', continent: 'Europe', date: '2025-09-15', gender: 'Mixte', category: 'U11', ageGroup: 'Pré-formation' },
  { id: 19, type: 'Travel Team', name: 'TSK Select U16 Europe', sport: 'Basketball', level: 'Elite', country: 'France', continent: 'Europe', date: '2025-07-05', gender: 'Masculin', category: 'U16', ageGroup: 'Formation' },
  { id: 20, type: 'Travel Team', name: 'TSK Elite Showcase U15', sport: 'Football', level: 'Competition', country: 'Espagne', continent: 'Europe', date: '2025-06-25', gender: 'Mixte', category: 'U15', ageGroup: 'Formation' },
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
const PrimaryBtn = ({ children, onClick, type = 'button', className = '', ...rest }) => (
  <button type={type} onClick={onClick} className={`cursor-pointer inline-block rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-700 disabled:opacity-50 ${className}`} {...rest}>
    {children}
  </button>
);
const SecondaryBtn = ({ children, onClick, ...rest }) => (
  <button onClick={onClick} className="cursor-pointer inline-block rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-md ring-1 ring-inset ring-slate-300 hover:bg-slate-50" {...rest}>
    {children}
  </button>
);
const CardBase = ({ children, className = '' }) => <div className={`rounded-xl border border-slate-200 bg-white ${className}`}>{children}</div>;

// --- Pages ---
const QuiSommesNousPage = ({ T }) => (
  <section id="about-us" className="py-20 bg-slate-50">
    <div className="mx-auto max-w-3xl px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">{T.about_us_title}</h2>
        <p className="mt-4 text-lg text-slate-600">{T.about_us_subtitle}</p>
      </div>
      <CardBase className="mt-12 p-8">
        <div className="text-left space-y-4 text-slate-700">
          <p>{T.about_us_p1}</p>
          <p>{T.about_us_p2}</p>
        </div>
      </CardBase>
    </div>
  </section>
);

const ContactPage = ({ T }) => {
  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900">{T.contact_title}</h2>
        <p className="mt-4 text-slate-600">{T.contact_subtitle}</p>

        <CardBase className="mt-12 p-8 text-left">
          <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" data-netlify-recaptcha="true" className="space-y-6">
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-700">{T.contact_subject}</label>
              <select name="subject" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option>{T.contact_reason_player}</option>
                <option>{T.contact_reason_coach}</option>
                <option>{T.contact_reason_club}</option>
                <option>{T.contact_reason_organizer}</option>
                <option>{T.contact_reason_accompagnement}</option>
                <option>{T.contact_reason_other}</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">{T.contact_name}</label>
                <input type="text" name="name" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{T.contact_email}</label>
                <input type="email" name="email" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.contact_message}</label>
              <textarea name="message" rows="4" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
            </div>
            <div data-netlify-recaptcha="true"></div>
            <div className="text-center">
              <PrimaryBtn type="submit">{T.contact_send}</PrimaryBtn>
            </div>
          </form>
        </CardBase>
      </div>
    </section>
  );
};

const AuthPage = ({ T, onLogin, navigateTo }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email: e.target.email.value });
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
              {isLogin ? `${T.auth_no_account} ${T.nav_signup}` : `${T.auth_has_account} ${T.nav_login}`}
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
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_type}</label>
                  <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option>{T.type_tournament}</option>
                    <option>{T.type_camp}</option>
                    <option>{T.type_academy}</option>
                    <option>{T.type_travel_team}</option>
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

// --- Accueil ---
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
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        <span>{languages[lang]}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {isOpen && (
        <ul role="listbox" className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          {Object.entries(languages).map(([key, name]) => (
            <li key={key}>
              <button
                type="button"
                role="option"
                aria-selected={lang === key}
                onClick={() => { setLang(key); setIsOpen(false); }}
                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Hero = ({ T }) => (
  <section className="relative text-center py-20 md:py-32 overflow-hidden">
    <div className="absolute inset-0">
      <img src="/hero-background.png" alt={T.alt_hero} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/1920x1080/1e293b/f8fafc?text=Focus'; }}/>
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
    <div className="relative mx-auto max-w-4xl px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
        {T.h1_top} <span className="text-orange-500">{T.h1_highlight}</span>
      </h1>
      <p className="mt-6 text-lg text-slate-200 font-medium">{T.h1_sub}</p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <PrimaryBtn onClick={() => { document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' }); }}>{T.cta_primary}</PrimaryBtn>
        <SecondaryBtn onClick={() => { document.getElementById('organizers')?.scrollIntoView({ behavior: 'smooth' }); }}>{T.cta_secondary}</SecondaryBtn>
      </div>
    </div>
  </section>
);

const SocialProof = ({ T }) => (
  <div className="bg-white py-12">
    <div className="mx-auto max-w-7xl px-4">
      <h3 className="text-center text-sm font-semibold text-slate-600 tracking-wider uppercase">{T.social_proof_title}</h3>
      <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1"><img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=LigueSport" alt="LigueSport" /></div>
        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1"><img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=FédéJeunes" alt="FédéJeunes" /></div>
        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1"><img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=NextGen+Events" alt="NextGen Events" /></div>
        <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1"><img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=ProForma" alt="ProForma" /></div>
        <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1"><img className="h-12" src="https://placehold.co/158x48/f1f5f9/64748b?text=Athletico" alt="Athletico" /></div>
      </div>
    </div>
  </div>
);

const Search = ({ T, initialFilter, clearInitialFilter, lang }) => {
  const [filters, setFilters] = useState({ type: 'all', sport: 'all', level: 'all', country: 'all', date: '', dateEnd: '', gender: 'all', category: 'all', keyword: '' });
  const [opportunities, setOpportunities] = useState(allOpportunities);
  const [view, setView] = useState('list');

  useEffect(() => {
    if (initialFilter) {
      setFilters(prev => ({ ...prev, type: initialFilter }));
      clearInitialFilter();
    }
  }, [initialFilter, clearInitialFilter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
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

  const types = { 'Tournoi': T.type_tournament, 'Camp': T.type_camp, 'Académie': T.type_academy, 'Coach personnel': T.type_coach, 'Lieu / Infrastructure': T.type_venue, 'Travel Team': T.type_travel_team };
  const sports = [...new Set(allOpportunities.map(t => t.sport))];
  const levels = ['Loisir', 'Competition', 'Elite'];
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
    <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Mode d'affichage">
      <button onClick={() => setView('list')} role="tab" aria-selected={view === 'list'} className={`px-4 py-2 text-sm font-semibold rounded-md ${view === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-slate-600'}`}>
        {T.view_list}
      </button>
      <button onClick={() => setView('map')} role="tab" aria-selected={view === 'map'} className={`px-4 py-2 text-sm font-semibold rounded-md ${view === 'map' ? 'bg-orange-600 text-white' : 'bg-white text-slate-600'}`}>
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
              <input type="text" name="keyword" value={filters.keyword} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_type}</label>
              <select name="type" value={filters.type} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.type_all}</option>
                {Object.entries(types).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_sport}</label>
              <select name="sport" value={filters.sport} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.filter_all}</option>
                {sports.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_level}</label>
              <select name="level" value={filters.level} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.filter_all}</option>
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_country}</label>
              <select name="country" value={filters.country} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.filter_all}</option>
                {Object.entries(countriesByContinent).map(([continent, countries]) => (
                  <optgroup label={continent} key={continent}>
                    {countries.sort().map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_gender}</label>
              <select name="gender" value={filters.gender} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.filter_all}</option>
                {Object.entries(genders).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_category}</label>
              <select name="category" value={filters.category} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                <option value="all">{T.filter_all}</option>
                {Object.entries(categoriesByAgeGroup).map(([ageGroup, categories]) => (
                  <optgroup label={ageGroup} key={ageGroup}>
                    {categories.sort().map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_date_start}</label>
              <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{T.filter_date_end}</label>
              <input type="date" name="dateEnd" value={filters.dateEnd} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
            </div>
          </div>
           {filters.type === 'Travel Team' && (
            <p className="mt-4 text-xs text-slate-500">
              <span aria-hidden>ⓘ</span> {T.contextual_help_travel_team}
            </p>
          )}
          {filters.type === 'Lieu / Infrastructure' && (
            <p className="mt-4 text-xs text-slate-500">
              <span aria-hidden>ⓘ</span> {T.contextual_help_venue}
            </p>
          )}
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
                    'bg-green-100 text-green-800' // Loisir
                  }`}>{t.level}</span>}
                </div>
                {t.date !== '2025-01-01' && (
                  <p className="mt-4 text-sm text-slate-600">
                    {new Date(t.date).toLocaleDateString(locales[lang] || locales.fr, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </CardBase>
            )) : (
              <p className="col-span-full text-center text-slate-600">{T.no_results}</p>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <CardBase className="h-96 w-full flex items-center justify-center">
              <img src="https://placehold.co/1200x400/e2e8f0/64748b?text=Vue+Carte+Bient%C3%B4t+Disponible" alt={T.alt_map_placeholder} className="w-full h-full object-cover rounded-xl"/>
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
          <p className="text-slate-600 italic flex-grow">{T.testimonials_player_quote}</p>
          <p className="mt-4 font-semibold text-slate-800">{T.testimonials_player_name}</p>
        </CardBase>
        <CardBase className="p-8 flex flex-col">
          <p className="text-slate-600 italic flex-grow">{T.testimonials_coach_quote}</p>
          <p className="mt-4 font-semibold text-slate-800">{T.testimonials_coach_name}</p>
        </CardBase>
        <CardBase className="p-8 flex flex-col">
          <p className="text-slate-600 italic flex-grow">{T.testimonials_organizer_quote}</p>
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
      aria-pressed={isActive}
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
        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Classements">
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
      <div className="mt-8">
        <PrimaryBtn onClick={() => { document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' }); }}>{T.players_cta}</PrimaryBtn>
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
      <div className="mt-8">
        <PrimaryBtn onClick={() => { document.getElementById('rankings')?.scrollIntoView({ behavior: 'smooth' }); }}>{T.coaches_cta}</PrimaryBtn>
      </div>
    </div>
  </section>
);

const ForClubs = ({ T }) => (
    <section id="clubs" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{T.clubs_title}</h2>
          <p className="mt-4 text-slate-600">{T.clubs_subtitle}</p>
          <div className="mt-6 space-y-3 text-slate-700">
            <p><strong>{T.clubs_s1_title} — </strong>{T.clubs_s1_text}</p>
            <p><strong>{T.clubs_s2_title} — </strong>{T.clubs_s2_text}</p>
          </div>
          <div className="mt-8">
            <PrimaryBtn onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
              {T.clubs_cta}
            </PrimaryBtn>
          </div>
        </div>
        <CardBase className="p-8">
          <p className="text-slate-600">
            {T.clubs_tip}
          </p>
        </CardBase>
      </div>
    </section>
  );

const ForOrganizers = ({ T }) => (
  <section id="organizers" className="py-20">
    <div className="mx-auto max-w-7xl px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-900">{T.organizers_title}</h2>
          <p className="mt-4 max-w-xl mx-auto md:mx-0 text-slate-600">{T.organizers_subtitle}</p>
          <div className="mt-6 flex gap-4 justify-center md:justify-start">
            <PrimaryBtn onClick={() => { alert('Redirection vers le portail organisateur'); }}>{T.organizers_standard_cta}</PrimaryBtn>
            <SecondaryBtn onClick={() => { document.getElementById('accompagnement')?.scrollIntoView({ behavior: 'smooth' }); }}>Services Premium</SecondaryBtn>
          </div>
        </div>
        <div className="relative h-80 rounded-xl overflow-hidden">
          <img src="/organizers-background.png" alt={T.alt_organizers_bg} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/800x600/f97316/white?text=Event'; }}/>
        </div>
      </div>
    </div>
  </section>
);

const Accompagnement = ({ T }) => (
  <section id="accompagnement" className="py-20 bg-slate-900 text-white relative overflow-hidden">
    <div className="absolute inset-0">
      <img src="/concierge-background.png" className="w-full h-full object-cover opacity-20" alt={T.alt_accompagnement_bg} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/1920x1080/1e293b/f8fafc?text=Strategy'; }}/>
    </div>
    <div className="relative mx-auto max-w-7xl px-4 text-center">
      <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{T.accompagnement_section_title}</h2>
      <p className="mt-4 max-w-3xl mx-auto text-slate-300">{T.accompagnement_section_subtitle}</p>
      <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
        <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-orange-400">{T.accompagnement_for_players_title}</h3>
          <p className="mt-2 text-sm text-slate-400">{T.accompagnement_for_players_text}</p>
        </div>
        <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-orange-400">{T.accompagnement_for_coaches_title}</h3>
          <p className="mt-2 text-sm text-slate-400">{T.accompagnement_for_coaches_text}</p>
        </div>
        <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-orange-400">{T.accompagnement_for_organizers_title}</h3>
          <p className="mt-2 text-sm text-slate-400">{T.accompagnement_for_organizers_text}</p>
        </div>
      </div>
      <div className="mt-12">
        <PrimaryBtn onClick={() => { alert('Redirection vers le formulaire de contact Accompagnement'); }}>{T.accompagnement_cta}</PrimaryBtn>
      </div>
    </div>
  </section>
);

const Roadmap = ({ T }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    let destroyed = false;
    (async () => {
      const { default: Chart } = await import('chart.js/auto');
      if (destroyed || !chartRef.current) return;

      const ctx = chartRef.current.getContext('2d');
      
      const roadmapData = [
        { task: 'Migration Next.js & SEO Technique', pillar: 'Fondation', start: 0, end: 3 },
        { task: 'Optimisation Vitesse & Core Web Vitals', pillar: 'Fondation', start: 1, end: 4 },
        { task: 'Mise en place Tracking & RGPD', pillar: 'Fondation', start: 2, end: 4 },
        { task: 'Début Scraping & Acquisition Données', pillar: 'Acquisition', start: 3, end: 7 },
        { task: 'Lancement Programmatic SEO', pillar: 'Acquisition', start: 4, end: 9 },
        { task: 'Onboarding v1 & Alertes', pillar: 'Acquisition', start: 5, end: 8 },
        { task: 'Campagnes SEA Ciblées', pillar: 'Acquisition', start: 6, end: 10 },
        { task: 'Début A/B Testing & CRO', pillar: 'Optimisation', start: 9, end: 14 },
        { task: 'Implémentation CRM & Automation', pillar: 'Optimisation', start: 10, end: 16 },
        { task: 'Pilote Écosystème Créateurs', pillar: 'Optimisation', start: 12, end: 18 },
      ];
      
      const pillarColors = { 
        'Fondation': 'rgba(59, 130, 246, 0.8)', // Bleu
        'Acquisition': 'rgba(234, 88, 12, 0.8)', // Orange
        'Optimisation': 'rgba(16, 185, 129, 0.8)' // Vert
      };

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
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { min: 0, max: 18, title: { display: true, text: 'Mois', color: '#475569' }, ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
            y: { ticks: { color: '#334155' }, grid: { display: false } }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: { 
                label: (context) => {
                  const pillar = roadmapData[context.dataIndex].pillar;
                  const start = context.raw[0];
                  const end = context.raw[1];
                  return `${pillar}: Mois ${start} → ${end}`;
                }
              }
            }
          }
        }
      });
    })();

    return () => {
      destroyed = true;
      chartInstance.current?.destroy();
    };
  }, []);

  return (
    <section id="roadmap" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900">{T.roadmap_title}</h2>
        <p className="text-slate-600 text-center mt-4">{T.roadmap_subtitle}</p>
        <CardBase className="mt-12 p-6 h-[500px]">
          <canvas ref={chartRef} aria-label="Feuille de route TSK" role="img"></canvas>
        </CardBase>
      </div>
    </section>
  );
};

const HomePage = ({ T, initialFilter, clearInitialFilter, lang }) => (
  <>
    <Hero T={T} />
    <SocialProof T={T} />
    <Search T={T} initialFilter={initialFilter} clearInitialFilter={clearInitialFilter} lang={lang} />
    <Testimonials T={T} />
    <Rankings T={T} />
    <ForPlayers T={T} />
    <ForCoaches T={T} />
    <ForClubs T={T} />
    <ForOrganizers T={T} />
    <Accompagnement T={T} />
    <Roadmap T={T} />
  </>
);

// --- Header ---
const Header = ({ T, lang, setLang, navigateTo, currentPage, user, onLogout, onFilterSelect }) => {
  const [opportunityDropdown, setOpportunityDropdown] = useState(false);
  const [personaDropdown, setPersonaDropdown] = useState(false);
  const opportunityRef = useRef(null);
  const personaRef = useRef(null);

  const handleScrollTo = useCallback((id) => {
    navigateTo('home');
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
    setPersonaDropdown(false);
  }, [navigateTo]);

  const handleSearchAndFilter = useCallback((type) => {
    onFilterSelect(type);
    navigateTo('home');
    requestAnimationFrame(() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' }));
    setOpportunityDropdown(false);
  }, [navigateTo, onFilterSelect]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (opportunityRef.current && !opportunityRef.current.contains(event.target)) setOpportunityDropdown(false);
      if (personaRef.current && !personaRef.current.contains(event.target)) setPersonaDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NavBtn = ({ page, children }) => (
    <button
      onClick={() => navigateTo(page)}
      className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
      aria-current={currentPage === page ? 'page' : undefined}
    >
      {children}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b border-slate-200 bg-white/80">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt={T.alt_logo} className="h-10 w-10 rounded-lg cursor-pointer" onClick={() => navigateTo('home')} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src='https://placehold.co/40x40/f97316/white?text=TSK'; }}/>
          <div className="font-semibold text-slate-800 cursor-pointer" onClick={() => navigateTo('home')}>TSK Sport</div>
        </div>

        <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
          <NavBtn page="home">{T.nav_home}</NavBtn>

          <div className="relative" ref={opportunityRef}>
            <button
              onClick={() => setOpportunityDropdown(!opportunityDropdown)}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              aria-haspopup="menu"
              aria-expanded={opportunityDropdown}
              aria-controls="menu-opps"
            >
              {T.nav_opportunity}
              <svg className={`w-4 h-4 transition-transform ${opportunityDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {opportunityDropdown && (
              <div id="menu-opps" role="menu" className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <button role="menuitem" onClick={() => handleSearchAndFilter('Tournoi')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_tournaments}</button>
                  <button role="menuitem" onClick={() => handleSearchAndFilter('Camp')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_camps}</button>
                  <button role="menuitem" onClick={() => handleSearchAndFilter('Académie')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_academies}</button>
                  <button role="menuitem" onClick={() => handleSearchAndFilter('Travel Team')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_travel_teams}</button>
                </div>
              </div>
            )}
          </div>

          {currentPage === 'home' && (
            <div className="relative" ref={personaRef}>
              <button
                onClick={() => setPersonaDropdown(!personaDropdown)}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
                aria-haspopup="menu"
                aria-expanded={personaDropdown}
                aria-controls="menu-persona"
              >
                {T.nav_for_who}
                <svg className={`w-4 h-4 transition-transform ${personaDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {personaDropdown && (
                <div id="menu-persona" role="menu" className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <button role="menuitem" onClick={() => handleScrollTo('players')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_players}</button>
                    <button role="menuitem" onClick={() => handleScrollTo('coaches')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_coaches}</button>
                    <button role="menuitem" onClick={() => handleScrollTo('clubs')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_clubs}</button>
                    <button role="menuitem" onClick={() => handleScrollTo('organizers')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{T.nav_organizers}</button>
                  </div>
                </div>
              )}
            </div>
          )}
          <NavBtn page="about-us">{T.nav_about_us}</NavBtn>
          <NavBtn page="contact">{T.nav_contact}</NavBtn>
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

const Footer = ({ T }) => {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-3 text-slate-500">
        <div>{T.footer_text}</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-800">Mentions légales</a>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-slate-800">Haut de page</a>
        </div>
      </div>
    </footer>
  );
};

// --- App ---
export default function App() {
  const [lang, setLang] = useState('fr');
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [initialSearchFilter, setInitialSearchFilter] = useState(null);
  const T = useMemo(() => copy(lang), [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (currentPage === 'home' && !initialSearchFilter) return;
    window.scrollTo(0, 0);
  }, [lang, currentPage, initialSearchFilter]);

  const handleLogin = (userData) => { setUser(userData); };
  const handleLogout = () => { setUser(null); setCurrentPage('home'); };
  const handleFilterSelect = (filter) => { setInitialSearchFilter(filter); };
  const clearInitialFilter = () => { setInitialSearchFilter(null); };

  const renderPage = () => {
    switch (currentPage) {
      case 'about-us': return <QuiSommesNousPage T={T} />;
      case 'contact': return <ContactPage T={T} />;
      case 'auth': return <AuthPage T={T} onLogin={handleLogin} navigateTo={setCurrentPage} />;
      case 'dashboard': return user ? <DashboardPage T={T} user={user} navigateTo={setCurrentPage} /> : <HomePage T={T} initialFilter={initialSearchFilter} clearInitialFilter={clearInitialFilter} lang={lang} />;
      case 'propose': return user ? <ProposeOpportunityPage T={T} /> : <HomePage T={T} initialFilter={initialSearchFilter} clearInitialFilter={clearInitialFilter} lang={lang} />;
      case 'home': default: return <HomePage T={T} initialFilter={initialSearchFilter} clearInitialFilter={clearInitialFilter} lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header T={T} lang={lang} setLang={setLang} navigateTo={setCurrentPage} currentPage={currentPage} user={user} onLogout={handleLogout} onFilterSelect={handleFilterSelect} />
      <main>
        {renderPage()}
      </main>
      <Footer T={T} />
    </div>
  );
}

