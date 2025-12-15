import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardBase from "../ui/CardBase";
import { locales } from "../../i18n/i18n";
import { fetchOpportunities } from "../../services/mockApi";
import { useUserData } from "../../hooks/useUserData";
import { PrimaryBtn } from "../ui/Buttons";

const Search = ({ T, initialFilter, clearInitialFilter, lang }) => {
  const [filters, setFilters] = useState({ type: 'all', sport: 'all', level: 'all', country: 'all', date: '', dateEnd: '', gender: 'all', category: 'all', keyword: '' });
  const [allData, setAllData] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list');
  const [statusMessage, setStatusMessage] = useState('');
  const [lastRequestOptions, setLastRequestOptions] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: userData,
    saveSearch,
    removeSavedSearch,
    isOpportunitySaved,
    toggleSavedOpportunity,
    user,
  } = useUserData();

  const formatter = useMemo(() => locales[lang] || locales.fr, [lang]);

  useEffect(() => {
    if (initialFilter) {
      setFilters(prev => ({ ...prev, type: initialFilter }));
      clearInitialFilter();
    }
  }, [initialFilter, clearInitialFilter]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const restoredFilters = {};
    params.forEach((value, key) => {
      if (Object.prototype.hasOwnProperty.call(filters, key)) restoredFilters[key] = value;
    });
    if (Object.keys(restoredFilters).length) {
      setFilters((prev) => ({ ...prev, ...restoredFilters }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;
    const requestOptions = { delay: 250 };
    setLastRequestOptions(requestOptions);
    setLoading(true);
    setError(null);
    setStatusMessage('Mise à jour des opportunités');
    fetchOpportunities(requestOptions)
      .then((data) => {
        if (!active) return;
        setAllData(data);
        setOpportunities(data);
        setStatusMessage(`${data.length} opportunités chargées`);
      })
      .catch(() => {
        if (!active) return;
        setError('Impossible de charger les opportunités pour le moment.');
        setStatusMessage('Erreur lors du chargement');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [location.key]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setStatusMessage(`Filtre ${name} mis à jour`);
  };

  useEffect(() => {
    let filtered = allData;
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
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value);
    });
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true, state: location.state });
  }, [filters, allData, navigate, location.pathname, location.state]);

  useEffect(() => {
    if (!loading && location.state?.scrollPosition >= 0) {
      window.scrollTo(0, location.state.scrollPosition);
    }
    if (location.state?.view) setView(location.state.view);
    if (location.state?.filters) setFilters((prev) => ({ ...prev, ...location.state.filters }));
  }, [loading, location.state]);

  const handleRetry = () => {
    setStatusMessage('Nouvelle tentative de chargement');
    setError(null);
    setLoading(true);
    fetchOpportunities(lastRequestOptions)
      .then((data) => {
        setAllData(data);
        setOpportunities(data);
        setStatusMessage('Opportunités rechargées');
      })
      .catch(() => {
        setError('Impossible de charger les opportunités pour le moment.');
        setStatusMessage('Erreur lors du chargement');
      })
      .finally(() => setLoading(false));
  };

  const handleResetEssentialFilters = () => {
    setFilters((prev) => ({
      ...prev,
      type: 'all',
      sport: 'all',
      country: 'all',
      gender: 'all',
      category: 'all',
      date: '',
      dateEnd: '',
    }));
    setStatusMessage('Filtres essentiels réinitialisés');
  };

  const handleOpportunityClick = (opportunity) => {
    setStatusMessage(`Ouverture de ${opportunity.name}`);
    navigate(`/opportunity/${opportunity.id}`, {
      state: {
        from: `${location.pathname}${location.search}`,
        scrollPosition: window.scrollY,
        filters,
        view,
      },
    });
  };

  const handleSaveSearch = () => {
    const labelParts = [];
    if (filters.keyword) labelParts.push(filters.keyword);
    if (filters.type !== 'all') labelParts.push(filters.type);
    if (filters.country !== 'all') labelParts.push(filters.country);
    const label = labelParts.join(' • ') || T.save_search_action;
    saveSearch(filters, { label });
    setStatusMessage('Recherche sauvegardée localement');
  };

  const handleApplySavedSearch = (search) => {
    setFilters((prev) => ({ ...prev, ...search.filters }));
    setStatusMessage('Filtres restaurés depuis vos favoris');
    navigate({ pathname: location.pathname, search: '' }, { replace: true });
  };

  const handleRemoveSearch = (id) => {
    removeSavedSearch(id);
    setStatusMessage('Recherche supprimée de cet appareil');
  };

  const handleToggleSaveOpportunity = (opportunity, event) => {
    event?.stopPropagation();
    const saved = toggleSavedOpportunity(opportunity);
    setStatusMessage(saved ? 'Opportunité sauvegardée localement' : 'Opportunité retirée de vos favoris');
  };

  const lastVisitLabel = userData.lastVisitTimestamp
    ? new Date(userData.lastVisitTimestamp).toLocaleString(formatter, { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  const hasContinuityPrompt = !user && (userData.savedOpportunities.length > 0 || userData.savedSearches.length > 0);

  const EmptyState = () => (
    <CardBase className="col-span-full p-6 text-center text-slate-700" role="status" aria-live="polite">
      <p className="font-semibold">Aucune opportunité trouvée</p>
      <p className="mt-2 text-sm">Essayez les ajustements suivants pour relancer votre recherche :</p>
      <div className="mt-4 space-y-2">
        <button
          className="block w-full rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
          onClick={() => handleFilterChange({ target: { name: 'country', value: 'all' } })}
        >
          Élargir le pays
        </button>
        <button
          className="block w-full rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
          onClick={() => handleFilterChange({ target: { name: 'type', value: 'all' } })}
        >
          Réinitialiser le type
        </button>
      </div>
      <button
        className="mt-4 inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        onClick={handleResetEssentialFilters}
      >
        Réinitialiser les filtres essentiels
      </button>
    </CardBase>
  );

  const OpportunitySkeleton = () => (
    <CardBase className="p-6 animate-pulse" aria-hidden>
      <div className="h-4 w-24 bg-slate-200 rounded" />
      <div className="mt-4 h-6 w-3/4 bg-slate-200 rounded" />
      <div className="mt-2 h-4 w-1/2 bg-slate-200 rounded" />
      <div className="mt-4 h-4 w-32 bg-slate-200 rounded" />
    </CardBase>
  );

  const types = { 'Tournoi': T.type_tournament, 'Camp': T.type_camp, 'Académie': T.type_academy, 'Coach personnel': T.type_coach, 'Lieu / Infrastructure': T.type_venue, 'Travel Team': T.type_travel_team };
  const sports = [...new Set(allData.map(t => t.sport))];
  const levels = ['Loisir', 'Competition', 'Elite'];
  const countriesByContinent = allData.reduce((acc, curr) => {
    if (curr.continent) {
      if (!acc[curr.continent]) acc[curr.continent] = [];
      if (!acc[curr.continent].includes(curr.country)) acc[curr.continent].push(curr.country);
    }
    return acc;
  }, {});
  const genders = { 'Masculin': T.gender_male, 'Féminin': T.gender_female, 'Mixte': T.gender_mixed };
  const categoriesByAgeGroup = allData.reduce((acc, curr) => {
    if (curr.ageGroup && curr.ageGroup !== 'all') {
      if (!acc[curr.ageGroup]) acc[curr.ageGroup] = [];
      if (!acc[curr.ageGroup].includes(curr.category)) acc[curr.ageGroup].push(curr.category);
    }
    return acc;
  }, {});

  const ViewToggle = () => (
    <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Mode d'affichage">
      <button
        onClick={() => setView('list')}
        role="tab"
        aria-selected={view === 'list'}
        disabled={loading}
        className={`px-4 py-2 text-sm font-semibold rounded-md ${view === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-slate-600'} ${loading ? 'opacity-60' : ''}`}
      >
        {T.view_list}
      </button>
      <button
        onClick={() => setView('map')}
        role="tab"
        aria-selected={view === 'map'}
        disabled={loading}
        className={`px-4 py-2 text-sm font-semibold rounded-md ${view === 'map' ? 'bg-orange-600 text-white' : 'bg-white text-slate-600'} ${loading ? 'opacity-60' : ''}`}
      >
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
          {lastVisitLabel && <p className="mt-2 text-xs text-slate-500">Dernière visite : {lastVisitLabel}</p>}
        </div>
        <div className="sr-only" aria-live="polite">{statusMessage || error}</div>
        <CardBase className="mt-12 p-6" aria-busy={loading}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600">{T.save_search_action}</p>
            <PrimaryBtn onClick={handleSaveSearch} className="w-full md:w-auto" type="button">{T.save_search_action}</PrimaryBtn>
          </div>
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
                {['Loisir', 'Competition', 'Elite'].map(l => <option key={l} value={l}>{l}</option>)}
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
        {userData.savedSearches.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-800">{T.saved_searches_title}</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.savedSearches.map((search) => (
                <CardBase key={search.id} className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{search.label}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {Object.entries(search.filters).filter(([key, value]) => value && value !== 'all').map(([key, value]) => `${key}: ${value}`).join(' • ') || T.filter_all}
                      </p>
                    </div>
                    <button className="text-xs text-red-600 hover:underline" onClick={() => handleRemoveSearch(search.id)}>
                      Supprimer
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <PrimaryBtn onClick={() => handleApplySavedSearch(search)} className="text-sm">
                      Relancer
                    </PrimaryBtn>
                  </div>
                </CardBase>
              ))}
            </div>
          </div>
        )}
        {hasContinuityPrompt && (
          <CardBase className="mt-4 p-4 bg-orange-50 border border-orange-200 flex flex-col gap-2">
            <p className="font-semibold text-orange-800">{T.continuity_cta_title}</p>
            <p className="text-sm text-orange-700">{T.continuity_cta_desc}</p>
            <PrimaryBtn
              onClick={() => navigate('/auth', { state: { redirectTo: location.pathname, intent: 'continuity' } })}
              className="w-full md:w-auto"
            >
              {T.cta_keep_everywhere}
            </PrimaryBtn>
          </CardBase>
        )}
        <div className="mt-8 flex justify-center">
          <ViewToggle />
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite" role="status">
            {[...Array(3)].map((_, idx) => <OpportunitySkeleton key={idx} />)}
          </div>
        ) : error ? (
          <div className="mt-8 text-center text-slate-700" role="alert">
            <p className="text-red-600">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-3 inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Réessayer
            </button>
          </div>
        ) : view === 'list' ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.length > 0 ? opportunities.map(t => (
              <button
                key={t.id}
                onClick={() => handleOpportunityClick(t)}
                className="text-left"
              >
                <CardBase className="p-6 transition hover:shadow-lg hover:-translate-y-1">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-xs font-semibold text-orange-600">{t.type}</p>
                      <h3 className="mt-1 font-semibold text-slate-800">{t.name}</h3>
                      <p className="text-xs text-slate-500">{t.country} • {t.sport} {t.category !== 'all' ? `• ${t.category}` : ''}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {t.level !== 'all' && <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.level === 'Elite' ? 'bg-red-100 text-red-800' :
                        t.level === 'Competition' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>{t.level}</span>}
                      <button
                        type="button"
                        className={`text-xs font-semibold ${isOpportunitySaved(t.id) ? 'text-green-700' : 'text-orange-600'} underline-offset-2 hover:underline`}
                        onClick={(event) => handleToggleSaveOpportunity(t, event)}
                      >
                        {isOpportunitySaved(t.id) ? 'Enregistré' : 'Sauvegarder'}
                      </button>
                    </div>
                  </div>
                  {t.date !== '2025-01-01' && (
                    <p className="mt-4 text-sm text-slate-600">
                      {new Date(t.date).toLocaleDateString(formatter, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </CardBase>
              </button>
            )) : (
              <EmptyState />
            )}
          </div>
        ) : (
          <div className="mt-8">
            <CardBase className="h-96 w-full flex items-center justify-center">
              <img src="https://placehold.co/1200x400/e2e8f0/64748b?text=Vue+Carte+Bientôt+Disponible" alt={T.alt_map_placeholder} className="w-full h-full object-cover rounded-xl"/>
            </CardBase>
          </div>
        )}
        {userData.savedOpportunities.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-800">{T.saved_opportunities_title}</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.savedOpportunities.map((item) => (
                <CardBase key={item.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.type} • {item.country}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/opportunity/${item.id}`)} className="text-sm text-orange-600 hover:underline">{T.view_list}</button>
                    <button onClick={() => handleToggleSaveOpportunity(item)} className="text-xs text-red-600 hover:underline">Supprimer</button>
                  </div>
                </CardBase>
              ))}
            </div>
          </div>
        )}
        {userData.recentlyViewed.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-800">{T.recently_viewed_title}</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {userData.recentlyViewed.map((item) => (
                <CardBase key={item.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.type} • {item.country} • {item.sport}</p>
                  </div>
                  <button onClick={() => navigate(`/opportunity/${item.id}`)} className="text-sm text-orange-600 hover:underline">
                    {T.view_list}
                  </button>
                </CardBase>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Search;
