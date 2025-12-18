import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import CardBase from "../ui/CardBase";
import { fetchOpportunities } from "../../services/mockApi";
import OpportunityCard from "../search/OpportunityCard";
import OpportunityDetailModal from "../search/OpportunityDetailModal";
import EmptyState from "../search/EmptyState";
import ResultsSummaryBar from "../search/ResultsSummaryBar";
import Toast from "../library/Toast";
import {
  createSavedSearch,
  deleteSavedSearch,
  duplicateSavedSearch,
  listSavedSearches,
  markSavedSearchUsed,
  updateSavedSearch,
} from "../../services/savedSearchesService";
import { createAlert, deleteAlert, listAlerts, updateAlert } from "../../services/alertsService";
import {
  listSavedOpportunities,
  toggleSavedOpportunity,
  removeSavedOpportunity,
} from "../../services/savedOpportunitiesService";
import { addRecentlyViewed, listRecentlyViewed } from "../../services/recentlyViewedService";
import { getTelemetrySnapshot, incrementCounter, resetTelemetry } from "../../services/telemetryService";

const defaultEssentialFilters = {
  type: "all",
  sport: "all",
  country: "all",
  date: "",
  keyword: "",
};

const defaultAdvancedFilters = {
  level: "all",
  gender: "all",
  category: "all",
  ageGroup: "all",
  continent: "all",
  dateEnd: "",
};

const suggestions = [
  {
    label: "Basket • France",
    description: "Tournois populaires à proximité",
    filters: { ...defaultEssentialFilters, sport: "Basketball", country: "France" },
  },
  {
    label: "Football camps été",
    description: "Camps d'été ouverts",
    filters: { ...defaultEssentialFilters, sport: "Football", type: "Camp" },
  },
  {
    label: "Tennis élite Europe",
    description: "Pour joueurs confirmés",
    filters: { ...defaultEssentialFilters, sport: "Tennis", continent: "Europe", level: "Elite" },
  },
];

const buildLabelFromFilters = (filters) => {
  const parts = [];
  if (filters.sport && filters.sport !== "all") parts.push(filters.sport);
  if (filters.country && filters.country !== "all") parts.push(filters.country);
  if (filters.type && filters.type !== "all") parts.push(filters.type);
  if (parts.length === 0 && filters.keyword) parts.push(filters.keyword);
  return parts.join(" • ") || "Recherche sauvegardée";
};

const Search = () => {
  const location = useLocation();
  const [essentialFilters, setEssentialFilters] = useState(defaultEssentialFilters);
  const [advancedFilters, setAdvancedFilters] = useState(defaultAdvancedFilters);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [savedSearches, setSavedSearches] = useState(() => listSavedSearches());
  const [alerts, setAlerts] = useState(() => listAlerts());
  const [savedOpps, setSavedOpps] = useState(() => listSavedOpportunities());
  const [recentlyViewed, setRecentlyViewed] = useState(() => listRecentlyViewed());
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [alertsForm, setAlertsForm] = useState({ frequency: "weekly", email: "", localOnly: true });
  const [debugSnapshot, setDebugSnapshot] = useState(getTelemetrySnapshot());

  const mergedFilters = useMemo(
    () => ({ ...essentialFilters, ...advancedFilters }),
    [essentialFilters, advancedFilters]
  );

  const activeFilters = useMemo(() => {
    const entries = [];
    Object.entries(mergedFilters).forEach(([key, value]) => {
      const defaultValue = { ...defaultEssentialFilters, ...defaultAdvancedFilters }[key];
      if (value && value !== "" && value !== defaultValue) {
        entries.push({ key, label: `${key}: ${value}` });
      }
    });
    return entries;
  }, [mergedFilters]);

  const isDebug = useMemo(() => location.search.includes("debug=1"), [location.search]);

  useEffect(() => {
    setLoading(true);
    fetchOpportunities()
      .then((data) => setOpportunities(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const dirty =
      essentialFilters.keyword !== defaultEssentialFilters.keyword ||
      essentialFilters.type !== defaultEssentialFilters.type ||
      essentialFilters.sport !== defaultEssentialFilters.sport ||
      essentialFilters.country !== defaultEssentialFilters.country ||
      essentialFilters.date !== defaultEssentialFilters.date ||
      Object.entries(advancedFilters).some(([key, value]) => value !== defaultAdvancedFilters[key]);
    setIsDirty(dirty);
  }, [essentialFilters, advancedFilters]);

  const results = useMemo(() => {
    return opportunities.filter((opportunity) => {
      if (essentialFilters.type !== "all" && opportunity.type !== essentialFilters.type) return false;
      if (essentialFilters.sport !== "all" && opportunity.sport !== essentialFilters.sport) return false;
      if (essentialFilters.country !== "all" && opportunity.country !== essentialFilters.country) return false;
      if (essentialFilters.keyword) {
        const query = essentialFilters.keyword.toLowerCase();
        if (!opportunity.name.toLowerCase().includes(query)) return false;
      }
      if (essentialFilters.date) {
        if (new Date(opportunity.date) < new Date(essentialFilters.date)) return false;
      }
      if (advancedFilters.dateEnd) {
        if (new Date(opportunity.date) > new Date(advancedFilters.dateEnd)) return false;
      }
      if (advancedFilters.level !== "all" && opportunity.level !== advancedFilters.level) return false;
      if (advancedFilters.gender !== "all" && opportunity.gender !== advancedFilters.gender) return false;
      if (advancedFilters.category !== "all" && opportunity.category !== advancedFilters.category) return false;
      if (advancedFilters.ageGroup !== "all" && opportunity.ageGroup !== advancedFilters.ageGroup) return false;
      if (advancedFilters.continent !== "all" && opportunity.continent !== advancedFilters.continent) return false;
      return true;
    });
  }, [opportunities, essentialFilters, advancedFilters]);

  useEffect(() => {
    if (hasInteracted && results.length === 0) {
      incrementCounter("zero_results_seen");
      setDebugSnapshot(getTelemetrySnapshot());
    }
  }, [hasInteracted, results]);

  const handleFilterChange = (event, scope = "essential") => {
    const { name, value } = event.target;
    if (!hasInteracted) {
      setHasInteracted(true);
      incrementCounter("search_sessions_started");
    }
    if (scope === "essential") {
      setEssentialFilters((prev) => ({ ...prev, [name]: value }));
    } else {
      setAdvancedFilters((prev) => ({ ...prev, [name]: value }));
    }
    incrementCounter("filters_changed");
    setDebugSnapshot(getTelemetrySnapshot());
  };

  const resetFilters = useCallback(() => {
    setEssentialFilters(defaultEssentialFilters);
    setAdvancedFilters(defaultAdvancedFilters);
    setIsAdvancedOpen(false);
    setHasInteracted(false);
    setIsDirty(false);
  }, []);

  const handleRemoveFilter = (key) => {
    if (defaultEssentialFilters[key] !== undefined) {
      setEssentialFilters((prev) => ({ ...prev, [key]: defaultEssentialFilters[key] }));
    }
    if (defaultAdvancedFilters[key] !== undefined) {
      setAdvancedFilters((prev) => ({ ...prev, [key]: defaultAdvancedFilters[key] }));
    }
  };

  const handleSaveSearch = () => {
    incrementCounter("save_search_clicked");
    const label = buildLabelFromFilters(mergedFilters);
    const saved = createSavedSearch({ name: label, filters: mergedFilters });
    setSavedSearches(listSavedSearches());
    setToast("Recherche enregistrée");
    incrementCounter("saved_search_created");
    setDebugSnapshot(getTelemetrySnapshot());
    return saved;
  };

  const handleToggleSaveOpportunity = (opportunity) => {
    const next = toggleSavedOpportunity(opportunity);
    setSavedOpps(next);
    setToast(next.find((item) => item.id === opportunity.id) ? "Ajouté aux favoris" : "Retiré des favoris");
    incrementCounter("opportunity_saved");
    setDebugSnapshot(getTelemetrySnapshot());
  };

  const handleOpenOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setRecentlyViewed(addRecentlyViewed(opportunity));
    incrementCounter("opportunity_viewed");
    setDebugSnapshot(getTelemetrySnapshot());
  };

  const handleSaveAlert = () => {
    const label = buildLabelFromFilters(mergedFilters);
    createAlert({
      label,
      filters: mergedFilters,
      frequency: alertsForm.frequency,
      email: alertsForm.email,
      localOnly: !alertsForm.email,
    });
    setAlerts(listAlerts());
    setShowAlertsModal(false);
    setToast("Alerte activée");
    incrementCounter("alert_created");
    setDebugSnapshot(getTelemetrySnapshot());
  };

  const handleApplySavedSearch = (item) => {
    setEssentialFilters({ ...defaultEssentialFilters, ...item.filters });
    setAdvancedFilters({ ...defaultAdvancedFilters, ...item.filters });
    setHasInteracted(true);
    setIsDirty(true);
    markSavedSearchUsed(item.id);
    setSavedSearches(listSavedSearches());
  };

  const handleRenameSearch = (item) => {
    const name = prompt("Renommer la recherche", item.name);
    if (name) {
      updateSavedSearch(item.id, { name });
      setSavedSearches(listSavedSearches());
    }
  };

  const handleDuplicateSearch = (item) => {
    duplicateSavedSearch(item.id);
    setSavedSearches(listSavedSearches());
  };

  const handleDeleteSearch = (item) => {
    deleteSavedSearch(item.id);
    setSavedSearches(listSavedSearches());
  };

  const showCtas = hasInteracted && !loading && results.length > 0;

  const emptyStateActiveFilters = activeFilters.map((filter) => ({
    ...filter,
    onRemove: () => handleRemoveFilter(filter.key),
  }));

  const showEmptyState = hasInteracted && !loading && results.length === 0;

  return (
    <section id="search" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Trouver une opportunité</h2>
          <p className="mt-2 text-slate-600">Une action claire : cherchez, sauvegardez, revenez.</p>
        </div>

        <Toast message={toast} onClose={() => setToast("")} />

        <CardBase className="p-6" aria-busy={loading}>
          <div className="flex flex-col gap-6" role="form" aria-label="Filtres de recherche">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Mot-clé</label>
                <input
                  type="text"
                  name="keyword"
                  value={essentialFilters.keyword}
                  onChange={(e) => handleFilterChange(e, "essential")}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Rechercher par nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Type</label>
                <select
                  name="type"
                  value={essentialFilters.type}
                  onChange={(e) => handleFilterChange(e, "essential")}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="all">Tous</option>
                  {Array.from(new Set(opportunities.map((o) => o.type))).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Sport</label>
                <select
                  name="sport"
                  value={essentialFilters.sport}
                  onChange={(e) => handleFilterChange(e, "essential")}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="all">Tous</option>
                  {Array.from(new Set(opportunities.map((o) => o.sport))).map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Pays</label>
                <select
                  name="country"
                  value={essentialFilters.country}
                  onChange={(e) => handleFilterChange(e, "essential")}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="all">Tous</option>
                  {Array.from(new Set(opportunities.map((o) => o.country))).map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Date de début</label>
                <input
                  type="date"
                  name="date"
                  value={essentialFilters.date}
                  onChange={(e) => handleFilterChange(e, "essential")}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                className="text-sm font-semibold text-orange-600 hover:underline"
                onClick={() => setIsAdvancedOpen((prev) => !prev)}
                aria-expanded={isAdvancedOpen}
              >
                {isAdvancedOpen ? "Masquer les filtres avancés" : "Filtres avancés"}
              </button>
              {isAdvancedOpen && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Niveau</label>
                    <select
                      name="level"
                      value={advancedFilters.level}
                      onChange={(e) => handleFilterChange(e, "advanced")}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                      <option value="all">Tous</option>
                      {Array.from(new Set(opportunities.map((o) => o.level))).map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Genre</label>
                    <select
                      name="gender"
                      value={advancedFilters.gender}
                      onChange={(e) => handleFilterChange(e, "advanced")}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                      <option value="all">Tous</option>
                      {Array.from(new Set(opportunities.map((o) => o.gender))).map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Catégorie</label>
                    <select
                      name="category"
                      value={advancedFilters.category}
                      onChange={(e) => handleFilterChange(e, "advanced")}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                      <option value="all">Toutes</option>
                      {Array.from(new Set(opportunities.map((o) => o.category))).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Âge</label>
                    <select
                      name="ageGroup"
                      value={advancedFilters.ageGroup}
                      onChange={(e) => handleFilterChange(e, "advanced")}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                      <option value="all">Tous</option>
                      {Array.from(new Set(opportunities.map((o) => o.ageGroup))).map((ageGroup) => (
                        <option key={ageGroup} value={ageGroup}>
                          {ageGroup}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Continent</label>
                    <select
                      name="continent"
                      value={advancedFilters.continent}
                      onChange={(e) => handleFilterChange(e, "advanced")}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                      <option value="all">Tous</option>
                      {Array.from(new Set(opportunities.map((o) => o.continent))).map((continent) => (
                        <option key={continent} value={continent}>
                          {continent}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Date de fin</label>
                    <input
                      type="date"
                      name="dateEnd"
                      value={advancedFilters.dateEnd}
                      onChange={(e) => handleFilterChange(e, "advanced")}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-semibold text-orange-600 hover:underline"
              >
                Réinitialiser
              </button>
              {isDirty && <span className="text-xs text-slate-500">Filtres modifiés</span>}
            </div>
          </div>
        </CardBase>

        {hasInteracted && (
          <ResultsSummaryBar
            count={results.length}
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onReset={resetFilters}
          />
        )}

        <div className="space-y-4">
          {showCtas && (
            <div className="flex flex-col sm:flex-row gap-3" aria-label="Sauvegarde et alertes">
              <CardBase className="flex-1 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Sauvegarder</p>
                  <p className="text-xs text-slate-500">Retrouver en 1 clic</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-orange-600 text-white text-sm font-semibold"
                  onClick={handleSaveSearch}
                >
                  Enregistrer
                </button>
              </CardBase>
              <CardBase className="flex-1 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Alertes</p>
                  <p className="text-xs text-slate-500">Nouveautés envoyées</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-orange-200 text-orange-700 text-sm font-semibold"
                  onClick={() => setShowAlertsModal(true)}
                >
                  Activer
                </button>
              </CardBase>
            </div>
          )}

          <p className="text-xs text-slate-500">Les données sont fournies à titre indicatif.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showEmptyState ? (
              <EmptyState
                activeFilters={emptyStateActiveFilters}
                onResetAll={resetFilters}
                onRemoveLast={() => {
                  if (activeFilters.length > 0) handleRemoveFilter(activeFilters[activeFilters.length - 1].key);
                }}
                onBroadenDates={() => {
                  setEssentialFilters((prev) => ({ ...prev, date: "" }));
                  setAdvancedFilters((prev) => ({ ...prev, dateEnd: "" }));
                }}
                onRelaxSport={() => setEssentialFilters((prev) => ({ ...prev, sport: "all" }))}
                suggestions={suggestions}
                onApplySuggestion={(filters) => {
                  setEssentialFilters((prev) => ({ ...prev, ...filters }));
                  setAdvancedFilters((prev) => ({ ...prev, ...filters }));
                  setHasInteracted(true);
                }}
              />
            ) : (
              results.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onOpen={handleOpenOpportunity}
                  onToggleSave={handleToggleSaveOpportunity}
                  isSaved={!!savedOpps.find((item) => item.id === opportunity.id)}
                />
              ))
            )}
          </div>
        </div>

        <section id="my-stuff" className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900">Mes éléments</h3>

          <CardBase className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-800">Recherches sauvegardées</h4>
              <span className="text-xs text-slate-500">Trié par usage</span>
            </div>
            {savedSearches.length === 0 ? (
              <p className="text-sm text-slate-600">Aucune recherche pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {savedSearches
                  .slice()
                  .sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0))
                  .map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          Dernier usage : {new Date(item.lastUsedAt || item.createdAt).toLocaleDateString()} • {item.useCount || 0} utilisation(s)
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-sm text-orange-600" onClick={() => handleApplySavedSearch(item)}>Appliquer</button>
                        <button className="text-sm text-slate-600" onClick={() => handleRenameSearch(item)}>Renommer</button>
                        <button className="text-sm text-slate-600" onClick={() => handleDuplicateSearch(item)}>Dupliquer</button>
                        <button className="text-sm text-slate-600" onClick={() => handleDeleteSearch(item)}>Supprimer</button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardBase>

          <CardBase className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-800">Alertes</h4>
            </div>
            {alerts.length === 0 ? (
              <p className="text-sm text-slate-600">Activez une alerte après une recherche.</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{alert.label}</p>
                      <p className="text-xs text-slate-500">
                        {alert.frequency} • {alert.email || "Appareil uniquement"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-slate-600"
                        onClick={() => {
                          const nextFrequency = alert.frequency === "weekly" ? "daily" : "weekly";
                          updateAlert(alert.id, { frequency: nextFrequency });
                          setAlerts(listAlerts());
                        }}
                      >
                        Fréquence
                      </button>
                      <button className="text-sm text-slate-600" onClick={() => deleteAlert(alert.id) || setAlerts(listAlerts())}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBase>

          <CardBase id="saved-opportunities" className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-800">Opportunités sauvegardées</h4>
            </div>
            {savedOpps.length === 0 ? (
              <p className="text-sm text-slate-600">Aucune opportunité sauvegardée.</p>
            ) : (
              <div className="space-y-2">
                {savedOpps.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.type} • {item.sport} • {item.country}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-sm text-orange-600" onClick={() => handleOpenOpportunity(item)}>Ouvrir</button>
                      <button className="text-sm text-slate-600" onClick={() => removeSavedOpportunity(item.id) || setSavedOpps(listSavedOpportunities())}>
                        Retirer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBase>

          <CardBase className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-800">Récemment consultées</h4>
            </div>
            {recentlyViewed.length === 0 ? (
              <p className="text-sm text-slate-600">Rien pour le moment.</p>
            ) : (
              <div className="space-y-2">
                {recentlyViewed.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.type} • {item.sport} • {item.country}</p>
                    </div>
                    <button className="text-sm text-orange-600" onClick={() => handleOpenOpportunity(item)}>
                      Revoir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardBase>
        </section>

        {showAlertsModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h4 className="text-lg font-semibold text-slate-900">Activer les alertes</h4>
              <p className="text-sm text-slate-600 mt-1">Nouveautés envoyées.</p>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Fréquence</label>
                  <select
                    value={alertsForm.frequency}
                    onChange={(e) => setAlertsForm((prev) => ({ ...prev, frequency: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="daily">Quotidien</option>
                    <option value="weekly">Hebdomadaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email (optionnel)</label>
                  <input
                    type="email"
                    value={alertsForm.email}
                    onChange={(e) => setAlertsForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    placeholder="votre@email.com"
                  />
                  <p className="text-xs text-slate-500 mt-1">Sans email, l'alerte reste locale.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  onClick={() => setShowAlertsModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-orange-600 text-white text-sm font-semibold"
                  onClick={handleSaveAlert}
                >
                  Activer
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedOpportunity && (
          <OpportunityDetailModal
            opportunity={selectedOpportunity}
            onClose={() => setSelectedOpportunity(null)}
            onSaveToggle={handleToggleSaveOpportunity}
            isSaved={!!savedOpps.find((item) => item.id === selectedOpportunity.id)}
          />
        )}

        {isDebug && (
          <CardBase className="p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-800">Debug télémétrie</h4>
              <button
                className="text-sm text-orange-600"
                onClick={() => {
                  resetTelemetry();
                  setDebugSnapshot(getTelemetrySnapshot());
                }}
              >
                Reset
              </button>
            </div>
            <div className="mt-2 text-sm text-slate-700">
              <p>Session: {new Date(debugSnapshot.session?.startedAt || Date.now()).toLocaleString()}</p>
              <pre className="mt-2 text-xs bg-slate-50 p-2 rounded-md overflow-x-auto">
                {JSON.stringify(debugSnapshot, null, 2)}
              </pre>
            </div>
          </CardBase>
        )}
      </div>
    </section>
  );
};

export default Search;
