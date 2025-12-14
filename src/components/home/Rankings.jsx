import React, { useEffect, useState } from "react";
import CardBase from "../ui/CardBase";
import { fetchTeamRankings, fetchTournamentRankings } from "../../services/mockApi";

const Rankings = ({ T }) => {
  const [view, setView] = useState('teams');
  const [teamRankings, setTeamRankings] = useState([]);
  const [tournamentRankings, setTournamentRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([fetchTeamRankings(), fetchTournamentRankings()])
      .then(([teams, tournaments]) => {
        if (!active) return;
        setTeamRankings(teams);
        setTournamentRankings(tournaments);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError('Impossible de charger les classements.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="rankings" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{T.rankings_title}</h2>
            <p className="mt-2 text-slate-600">{T.rankings_subtitle}</p>
          </div>
          <div className="inline-flex rounded-md shadow-sm ring-1 ring-slate-200">
            <button onClick={() => setView('teams')} className={`px-4 py-2 text-sm font-medium rounded-l-md ${view === 'teams' ? 'bg-orange-600 text-white' : 'bg-white text-slate-700'}`}>
              {T.rankings_tab_teams}
            </button>
            <button onClick={() => setView('tournaments')} className={`px-4 py-2 text-sm font-medium rounded-r-md ${view === 'tournaments' ? 'bg-orange-600 text-white' : 'bg-white text-slate-700'}`}>
              {T.rankings_tab_tournaments}
            </button>
          </div>
        </div>

        <CardBase className="mt-10 overflow-hidden">
          {loading ? (
            <p className="px-6 py-4 text-slate-600">{T.loading || 'Chargement en cours...'}</p>
          ) : error ? (
            <p className="px-6 py-4 text-red-600">{error}</p>
          ) : view === 'teams' ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">{T.rankings_col_rank}</th>
                  <th className="px-6 py-3 font-medium">{T.rankings_col_team}</th>
                  <th className="px-6 py-3 font-medium">{T.rankings_col_category}</th>
                  <th className="px-6 py-3 font-medium text-center">{T.rankings_col_played}</th>
                  <th className="px-6 py-3 font-medium text-right">Elo</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {teamRankings.map((team, index) => (
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
                {tournamentRankings.map((t, index) => (
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

export default Rankings;
