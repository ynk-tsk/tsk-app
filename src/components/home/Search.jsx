import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardBase from "../ui/CardBase";
import { PrimaryBtn, SecondaryBtn } from "../ui/Buttons";
import { locales } from "../../i18n/i18n";
import { fetchOpportunities } from "../../services/mockApi";

const ESSENTIAL_DEFAULTS = { type: "all", sport: "all", country: "all", category: "all" };
const ADVANCED_DEFAULTS = { level: "all", gender: "all", date: "", dateEnd: "", keyword: "", ageGroup: "all" };
const LEVEL_ORDER = ["Elite", "Competition", "Loisir", "all", "N/A"];

const parseEssentialFromQuery = (search) => {
  const params = new URLSearchParams(search);
  return {
    type: params.get("type") || "all",
    sport: params.get("sport") || "all",
    country: params.get("country") || "all",
    category: params.get("category") || "all",
  };
};

const parseSortFromQuery = (search) => {
  const params = new URLSearchParams(search);
  return params.get("sort") || "relevance";
};

const Search = ({ T, initialFilter, clearInitialFilter, lang }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState(() => ({ ...ESSENTIAL_DEFAULTS, ...ADVANCED_DEFAULTS, ...parseEssentialFromQuery(location.search) }));
  const [sortBy, setSortBy] = useState(() => parseSortFromQuery(location.search));
  const [allData, setAllData] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const syncQuery = useCallback((nextFilters, nextSort) => {
    const params = new URLSearchParams();
    ["type", "sport", "country", "category"].forEach((key) => {
      const value = nextFilters[key] ?? "all";
      if (value && value !== "all") params.set(key, value);
    });
    const sortValue = nextSort || sortBy;
    if (sortValue && sortValue !== "relevance") params.set("sort", sortValue);
    const searchString = params.toString();
    navigate(`${location.pathname}${searchString ? `?${searchString}` : ""}`, { replace: true });
  }, [navigate, location.pathname, sortBy]);

  const loadOpportunities = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchOpportunities()
      .then((data) => {
        setAllData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les opportunités pour le moment.");
        setLoading(false);
      });
  }, []);

  useEffect(() => { loadOpportunities(); }, [loadOpportunities]);

  useEffect(() => {
    if (!initialFilter) return;
    const nextFilters = { ...filters, type: initialFilter };
    setFilters(nextFilters);
    syncQuery(nextFilters, sortBy);
    clearInitialFilter();
  }, [initialFilter, filters, syncQuery, sortBy, clearInitialFilter]);

  useEffect(() => {
    const essentials = parseEssentialFromQuery(location.search);
    const sortParam = parseSortFromQuery(location.search);
    setFilters((prev) => ({ ...prev, ...essentials }));
    setSortBy(sortParam);
  }, [location.search]);

  const types = useMemo(() => ({
    Tournoi: T.type_tournament,
    Camp: T.type_camp,
    Académie: T.type_academy,
    "Coach personnel": T.type_coach,
    "Lieu / Infrastructure": T.type_venue,
    "Travel Team": T.type_travel_team,
  }), [T]);

  const sports = useMemo(() => [...new Set(allData.map((t) => t.sport))], [allData]);
  const countriesByContinent = useMemo(() => allData.reduce((acc, curr) => {
    if (curr.continent) {
      if (!acc[curr.continent]) acc[curr.continent] = [];
      if (!acc[curr.continent].includes(curr.country)) acc[curr.continent].push(curr.country);
    }
    return acc;
  }, {}), [allData]);

  const genders = { Masculin: T.gender_male, Féminin: T.gender_female, Mixte: T.gender_mixed };
  const categoriesByAgeGroup = useMemo(() => allData.reduce((acc, curr) => {
    if (curr.ageGroup && curr.ageGroup !== "all" && curr.category && curr.category !== "all") {
      if (!acc[curr.ageGroup]) acc[curr.ageGroup] = [];
      if (!acc[curr.ageGroup].includes(curr.category)) acc[curr.ageGroup].push(curr.category);
    }
    return acc;
  }, {}), [allData]);

  const handleEssentialChange = (name, value) => {
    let nextFilters = { ...filters };
    if (name === "category") {
      const [ageGroup, category] = value.split("||");
      nextFilters = { ...nextFilters, category: category || "all", ageGroup: ageGroup || "all" };
    } else {
      nextFilters = { ...nextFilters, [name]: value };
    }
    setFilters(nextFilters);
    syncQuery(nextFilters, sortBy);
  };

  const handleAdvancedChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    syncQuery(filters, value);
  };

  const resetFilters = () => {
    const base = { ...ESSENTIAL_DEFAULTS, ...ADVANCED_DEFAULTS };
    setFilters(base);
    setSortBy("relevance");
    syncQuery(base, "relevance");
  };

  useEffect(() => {
    let filtered = allData;
    if (filters.keyword) {
      const lowerKeyword = filters.keyword.toLowerCase();
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(lowerKeyword)
        || t.country.toLowerCase().includes(lowerKeyword)
        || t.sport.toLowerCase().includes(lowerKeyword)
      );
    }
    if (filters.type !== "all") filtered = filtered.filter((t) => t.type === filters.type);
    if (filters.sport !== "all") filtered = filtered.filter((t) => t.sport === filters.sport);
    if (filters.country !== "all") filtered = filtered.filter((t) => t.country === filters.country);
    if (filters.category !== "all") filtered = filtered.filter((t) => t.category === filters.category);
    if (filters.ageGroup !== "all") filtered = filtered.filter((t) => t.ageGroup === filters.ageGroup);
    if (filters.level !== "all") filtered = filtered.filter((t) => t.level === filters.level);
    if (filters.gender !== "all") filtered = filtered.filter((t) => t.gender === filters.gender);
    if (filters.date) filtered = filtered.filter((t) => new Date(t.date) >= new Date(filters.date));
    if (filters.dateEnd) filtered = filtered.filter((t) => new Date(t.date) <= new Date(filters.dateEnd));

    const sorted = [...filtered];
    if (sortBy === "date") {
      sorted.sort((a, b) => {
        const aDate = Number.isNaN(Date.parse(a.date)) ? Number.MAX_SAFE_INTEGER : Date.parse(a.date);
        const bDate = Number.isNaN(Date.parse(b.date)) ? Number.MAX_SAFE_INTEGER : Date.parse(b.date);
        return aDate - bDate;
      });
    } else if (sortBy === "level") {
      sorted.sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
    }
    setOpportunities(sorted);
  }, [filters, allData, sortBy]);

  const renderSkeletons = () => (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((key) => (
        <CardBase key={key} className="p-6 animate-pulse bg-slate-100 h-40" />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <CardBase className="mt-8 p-6 text-center text-slate-700">
      <p className="font-semibold">{T.no_results || "Aucun résultat"}</p>
      <p className="mt-2 text-sm text-slate-500">Essayez d'élargir votre recherche :</p>
      <ul className="mt-3 text-sm text-slate-600 space-y-1">
        <li>• {T.filter_type} = {T.type_all}</li>
        <li>• {T.filter_country} = {T.filter_all}</li>
      </ul>
    </CardBase>
  );

  const renderError = () => (
    <CardBase className="mt-8 p-6 text-center text-red-700 bg-red-50 border border-red-200">
      <p>{error}</p>
      <div className="mt-4 flex justify-center">
        <PrimaryBtn onClick={loadOpportunities}>Réessayer</PrimaryBtn>
      </div>
    </CardBase>
  );

  return (
    <section id="search" className="py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">{T.search_title}</h2>
          <p className="mt-2 text-slate-600">{T.search_subtitle}</p>
        </div>

        <CardBase className="mt-10 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_sport}</label>
                  <select name="sport" value={filters.sport} onChange={(e) => handleEssentialChange("sport", e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option value="all">{T.filter_all}</option>
                    {sports.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_country}</label>
                  <select name="country" value={filters.country} onChange={(e) => handleEssentialChange("country", e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option value="all">{T.filter_all}</option>
                    {Object.entries(countriesByContinent).map(([continent, countries]) => (
                      <optgroup label={continent} key={continent}>
                        {countries.sort().map((c) => <option key={c} value={c}>{c}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_type}</label>
                  <select name="type" value={filters.type} onChange={(e) => handleEssentialChange("type", e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option value="all">{T.type_all}</option>
                    {Object.entries(types).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_category}</label>
                  <select name="category" value={`${filters.ageGroup}||${filters.category}`} onChange={(e) => handleEssentialChange("category", e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option value={`all||all`}>{T.filter_all}</option>
                    {Object.entries(categoriesByAgeGroup).map(([ageGroup, categories]) => (
                      <optgroup label={ageGroup} key={ageGroup}>
                        {categories.sort().map((c) => <option key={`${ageGroup}-${c}`} value={`${ageGroup}||${c}`}>{`${ageGroup} - ${c}`}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="sort">Trier</label>
                  <select id="sort" value={sortBy} onChange={handleSortChange} className="rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm">
                    <option value="relevance">Pertinence</option>
                    <option value="date">Date la plus proche</option>
                    <option value="level">Niveau</option>
                  </select>
                </div>
                <SecondaryBtn onClick={resetFilters} className="text-sm">Réinitialiser</SecondaryBtn>
              </div>
            </div>

            <button type="button" className="flex items-center gap-2 text-sm font-semibold text-orange-700" onClick={() => setAdvancedOpen((prev) => !prev)}>
              {advancedOpen ? "Masquer" : "Afficher"} les filtres avancés
            </button>

            {advancedOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.search_keyword}</label>
                  <input type="text" name="keyword" value={filters.keyword} onChange={handleAdvancedChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_level}</label>
                  <select name="level" value={filters.level} onChange={handleAdvancedChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option value="all">{T.filter_all}</option>
                    {LEVEL_ORDER.filter((l) => l !== "all" && l !== "N/A").map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_gender}</label>
                  <select name="gender" value={filters.gender} onChange={handleAdvancedChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                    <option value="all">{T.filter_all}</option>
                    {Object.entries(genders).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_date_start}</label>
                  <input type="date" name="date" value={filters.date} onChange={handleAdvancedChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{T.filter_date_end}</label>
                  <input type="date" name="dateEnd" value={filters.dateEnd} onChange={handleAdvancedChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
              </div>
            )}
          </div>
        </CardBase>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <p className="font-semibold text-slate-800">{opportunities.length} résultats</p>
          {filters.type === "Travel Team" && (
            <span className="text-xs text-slate-500">ⓘ {T.contextual_help_travel_team}</span>
          )}
          {filters.type === "Lieu / Infrastructure" && (
            <span className="text-xs text-slate-500">ⓘ {T.contextual_help_venue}</span>
          )}
        </div>

        {loading && renderSkeletons()}
        {!loading && error && renderError()}
        {!loading && !error && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.length > 0 ? opportunities.map((t) => (
              <CardBase key={t.id} className="p-6 transition hover:shadow-lg hover:-translate-y-1 cursor-pointer" onClick={() => navigate(`/opportunity/${t.id}`)}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-orange-600">{t.type}</p>
                    <h3 className="mt-1 font-semibold text-slate-800">{t.name}</h3>
                    <p className="text-xs text-slate-500">{t.country} • {t.sport} {t.category !== 'all' ? `• ${t.category}` : ''}</p>
                  </div>
                  {t.level && t.level !== 'all' && t.level !== 'N/A' && (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      t.level === 'Elite' ? 'bg-red-100 text-red-800' :
                      t.level === 'Competition' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>{t.level}</span>
                  )}
                </div>
                {t.date && t.date !== '2025-01-01' && (
                  <p className="mt-4 text-sm text-slate-600">
                    {new Date(t.date).toLocaleDateString(locales[lang] || locales.fr, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
                {t.description && <p className="mt-2 text-sm text-slate-500 line-clamp-2">{t.description}</p>}
              </CardBase>
            )) : renderEmptyState()}
          </div>
        )}
      </div>
    </section>
  );
};

export default Search;
