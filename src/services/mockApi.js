const mockOpportunities = [
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

const mockTeamRankings = [
  { rank: 1, team: 'Paris Elite U15', category: 'U15 Football', played: 22, elo: 1850 },
  { rank: 2, team: 'Madrid Baloncesto U16', category: 'U16 Basketball', played: 25, elo: 1820 },
  { rank: 3, team: 'Berlin Tennis Talents U14', category: 'U14 Tennis', played: 18, elo: 1795 },
  { rank: 4, team: 'Lyon ASVEL U16', category: 'U16 Basketball', played: 24, elo: 1780 },
  { rank: 5, team: 'FC Bayern Junior U15', category: 'U15 Football', played: 20, elo: 1765 },
];

const mockTournamentRankings = [
  { rank: 1, name: 'La Roda Future Stars', country: 'Espagne', prestigeScore: 95.2, top20Teams: 8 },
  { rank: 2, name: 'Munich Football Fest', country: 'Allemagne', prestigeScore: 92.8, top20Teams: 6 },
  { rank: 3, name: 'Bataille d’Alsace', country: 'France', prestigeScore: 89.5, top20Teams: 5 },
];

const clone = (payload) =>
  typeof structuredClone === 'function'
    ? structuredClone(payload)
    : JSON.parse(JSON.stringify(payload));

const respond = (payload, delay = 150) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(clone(payload)), delay);
  });

export const fetchOpportunities = () => respond(mockOpportunities);
export const fetchTeamRankings = () => respond(mockTeamRankings);
export const fetchTournamentRankings = () => respond(mockTournamentRankings);
