import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardBase from "../ui/CardBase";
import { locales } from "../../i18n/i18n";
import { fetchOpportunities } from "../../services/mockApi";
import { useUserData } from "../../hooks/useUserData";
import { PrimaryBtn } from "../ui/Buttons";

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

const AdvancedFilters = ({
  T,
  advancedFilters,
  onChange,
  genders,
  levels,
  categoriesByAgeGroup,
  continents,
  disabled,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4" aria-label="Filtres avancés">
    <div>
      <label className="block text-sm font-medium text-slate-700">{T.filter_level}</label>
      <select
        name="level"
        value={advancedFilters.level}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        disabled={disabled}
      >
        <option value="all">{T.filter_all}</option>
        {levels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700">{T.filter_gender}</label>
      <select
        name="gender"
        value={advancedFilters.gender}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        disabled={disabled}
      >
        <option value="all">{T.filter_all}</option>
        {Object.entries(genders).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700">{T.filter_category}</label>
      <select
        name="category"
        value={advancedFilters.category}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        disabled={disabled}
      >
        <option value="all">{T.filter_all}</option>
        {Object.entries(categoriesByAgeGroup).map(([ageGroup, categories]) => (
          <optgroup label={ageGroup} key={ageGroup}>
            {categories
              .sort()
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700">{T.filter_age_group}</label>
      <select
        name="ageGroup"
        value={advancedFilters.ageGroup}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        disabled={disabled}
      >
        <option value="all">{T.filter_all}</option>
        {Object.keys(categoriesByAgeGroup).map((ageGroup) => (
          <option key={ageGroup} value={ageGroup}>
            {ageGroup}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700">{T.filter_continent}</label>
      <select
        name="continent"
        value={advancedFilters.continent}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        disabled={disabled}
      >
        <option value="all">{T.filter_all}</option>
        {continents.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700">{T.filter_date_end}</label>
      <input
        type="date"
        name="dateEnd"
        value={advancedFilters.dateEnd}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        disabled={disabled}
      />
    </div>
  </div>
);

const SaveSearchCTA = ({ visible, onSave }) => {
  if (!visible) return null;
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-slate-50 border border-slate-200 rounded-lg p-4" role="region" aria-label="Sauvegarder la recherche">
      <div>
        <p className="text-sm font-semibold text-slate-800">Sauvegardez cette recherche</p>
        <p className="text-xs text-slate-500">Retrouvez vos filtres la prochaine fois sur cet appareil.</p>
      </div>
      <PrimaryBtn type="button" onClick={onSave}>
        Enregistrer
      </PrimaryBtn>
    </div>
  );
};

const GetAlertsCTA = ({ visible, onOpen }) => {
  if (!visible) return null;
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-slate-50 border border-slate-200 rounded-lg p-4" role="region" aria-label="Activer les alertes">
      <div>
        <p className="text-sm font-semibold text-slate-800">Activer les alertes</p>
        <p className="text-xs text-slate-500">Recevez un rappel par email dès qu'une opportunité correspond.</p>
      </div>
      <PrimaryBtn type="button" onClick={onOpen}>
        Activer
      </PrimaryBtn>
    </div>
  );
};

const EmptyStatePanel = ({
  T,
  activeFilters,
  onResetAll,
  onRemoveLast,
  onExpandDates,
  onRelaxSportType,
}) => (
  <CardBase className="col-span-full p-6" role="status" aria-live="polite">
    <p className="text-lg font-semibold text-slate-800">{T.empty_state_title || "Aucune opportunité trouvée"}</p>
    <p className="mt-2 text-sm text-slate-600">{T.empty_state_hint || "Essayez un ajustement rapide pour relancer la recherche."}</p>
    {activeFilters.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {activeFilters.map(({ key, label, onRemove }) => (
          <button
            key={key}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
            onClick={onRemove}
            type="button"
          >
            {label} <span aria-hidden>✕</span>
          </button>
        ))}
      </div>
    )}
    <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      <button
        className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
        type="button"
        onClick={onResetAll}
      >
        {T.empty_state_reset_all || "Réinitialiser tous les filtres"}
      </button>
      <button
        className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
        type="button"
        onClick={onRemoveLast}
      >
        {T.empty_state_remove_last || "Retirer le dernier filtre"}
      </button>
      <button
        className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
        type="button"
        onClick={onExpandDates}
      >
        {T.empty_state_expand_dates || "Élargir la plage de dates"}
      </button>
      <button
        className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
        type="button"
        onClick={onRelaxSportType}
      >
        {T.empty_state_change_sport || "Changer de sport ou de type"}
      </button>
    </div>
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

const Search = ({ T, initialFilter, clearInitialFilter, lang }) => {
  const [essentialFilters, setEssentialFilters] = useState(defaultEssentialFilters);
  const [advancedFilters, setAdvancedFilters] = useState(defaultAdvancedFilters);
  const [allData, setAllData] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("list");
  const [statusMessage, setStatusMessage] = useState("");
  const [lastRequestOptions, setLastRequestOptions] = useState({});
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [lastChangedKey, setLastChangedKey] = useState(null);
  const [alertsSubscriptions, setAlertsSubscriptions] = useState([]);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [alertsForm, setAlertsForm] = useState({ email: "", frequency: "weekly" });
  const [alertsConfirmation, setAlertsConfirmation] = useState("");
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

  const mergedFilters = useMemo(
    () => ({ ...essentialFilters, ...advancedFilters }),
    [essentialFilters, advancedFilters]
  );

  const resetFilters = useCallback(() => {
    setEssentialFilters(defaultEssentialFilters);
    setAdvancedFilters(defaultAdvancedFilters);
    setIsDirty(false);
    setHasInteracted(true);
    setLastChangedKey(null);
  }, []);

  useEffect(() => {
    const savedAlerts = localStorage.getItem("alertsSubscriptions");
    if (savedAlerts) {
      try {
        setAlertsSubscriptions(JSON.parse(savedAlerts));
      } catch (e) {
        setAlertsSubscriptions([]);
      }
    }
  }, []);

  useEffect(() => {
    if (initialFilter) {
      setEssentialFilters((prev) => ({ ...prev, type: initialFilter }));
      clearInitialFilter();
      setHasInteracted(true);
      setLastChangedKey("type");
    }
  }, [initialFilter, clearInitialFilter]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const restored = {};
    params.forEach((value, key) => {
      if (key in mergedFilters) restored[key] = value;
    });
    if (Object.keys(restored).length) {
      setEssentialFilters((prev) => ({ ...prev, ...restored }));
      setAdvancedFilters((prev) => ({ ...prev, ...restored }));
      setHasInteracted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;
    const requestOptions = { delay: 250 };
    setLastRequestOptions(requestOptions);
    setLoading(true);
    setError(null);
    setStatusMessage("Mise à jour des opportunités");
    fetchOpportunities(requestOptions)
      .then((data) => {
        if (!active) return;
        setAllData(data);
        setOpportunities(data);
        setStatusMessage(`${data.length} opportunités chargées`);
      })
      .catch(() => {
        if (!active) return;
        setError("Impossible de charger les opportunités pour le moment.");
        setStatusMessage("Erreur lors du chargement");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [location.key]);

  const recomputeDirtyState = useCallback(
    (nextEssential, nextAdvanced) => {
      const diffEssential = Object.entries(defaultEssentialFilters).some(
        ([key, value]) => nextEssential[key] !== value
      );
      const diffAdvanced = Object.entries(defaultAdvancedFilters).some(
        ([key, value]) => nextAdvanced[key] !== value
      );
      setIsDirty(diffEssential || diffAdvanced);
    },
    []
  );

  const handleFilterChange = (event, scope = "essential") => {
    const { name, value } = event.target;
    setHasInteracted(true);
    setLastChangedKey(name);
    if (scope === "essential") {
      setEssentialFilters((prev) => {
        const next = { ...prev, [name]: value };
        recomputeDirtyState(next, advancedFilters);
        return next;
      });
    } else {
      setAdvancedFilters((prev) => {
        const next = { ...prev, [name]: value };
        recomputeDirtyState(essentialFilters, next);
        return next;
      });
    }
  };

  useEffect(() => {
    let filtered = allData;
    if (mergedFilters.keyword) {
      const lowerKeyword = mergedFilters.keyword.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(lowerKeyword) ||
          t.country.toLowerCase().includes(lowerKeyword) ||
          t.sport.toLowerCase().includes(lowerKeyword)
      );
    }
    if (mergedFilters.type !== "all") filtered = filtered.filter((t) => t.type === mergedFilters.type);
    if (mergedFilters.sport !== "all") filtered = filtered.filter((t) => t.sport === mergedFilters.sport);
    if (mergedFilters.country !== "all") filtered = filtered.filter((t) => t.country === mergedFilters.country);
    if (mergedFilters.level !== "all") filtered = filtered.filter((t) => t.level === mergedFilters.level);
    if (mergedFilters.gender !== "all") filtered = filtered.filter((t) => t.gender === mergedFilters.gender);
    if (mergedFilters.category !== "all") filtered = filtered.filter((t) => t.category === mergedFilters.category);
    if (mergedFilters.ageGroup !== "all") filtered = filtered.filter((t) => t.ageGroup === mergedFilters.ageGroup);
    if (mergedFilters.continent !== "all") filtered = filtered.filter((t) => t.continent === mergedFilters.continent);
    if (mergedFilters.date) filtered = filtered.filter((t) => new Date(t.date) >= new Date(mergedFilters.date));
    if (mergedFilters.dateEnd) filtered = filtered.filter((t) => new Date(t.date) <= new Date(mergedFilters.dateEnd));
    setOpportunities(filtered);
    const params = new URLSearchParams();
    Object.entries(mergedFilters).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value);
    });
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true, state: location.state });
  }, [mergedFilters, allData, navigate, location.pathname, location.state]);

  useEffect(() => {
    if (!loading && location.state?.scrollPosition >= 0) {
      window.scrollTo(0, location.state.scrollPosition);
    }
    if (location.state?.view) setView(location.state.view);
    if (location.state?.filters) {
      setEssentialFilters((prev) => ({ ...prev, ...location.state.filters }));
      setAdvancedFilters((prev) => ({ ...prev, ...location.state.filters }));
      setHasInteracted(true);
    }
  }, [loading, location.state]);

  const handleRetry = () => {
    setStatusMessage("Nouvelle tentative de chargement");
    setError(null);
    setLoading(true);
    fetchOpportunities(lastRequestOptions)
      .then((data) => {
        setAllData(data);
        setOpportunities(data);
        setStatusMessage("Opportunités rechargées");
      })
      .catch(() => {
        setError("Impossible de charger les opportunités pour le moment.");
        setStatusMessage("Erreur lors du chargement");
      })
      .finally(() => setLoading(false));
  };

  const handleOpportunityClick = (opportunity) => {
    setStatusMessage(`Ouverture de ${opportunity.name}`);
    navigate(`/opportunity/${opportunity.id}`, {
      state: {
        from: `${location.pathname}${location.search}`,
        scrollPosition: window.scrollY,
        filters: mergedFilters,
        view,
      },
    });
  };

  const handleSaveSearch = () => {
    const labelParts = [];
    if (mergedFilters.keyword) labelParts.push(mergedFilters.keyword);
    if (mergedFilters.sport !== "all") labelParts.push(mergedFilters.sport);
    if (mergedFilters.country !== "all") labelParts.push(mergedFilters.country);
    if (mergedFilters.type !== "all") labelParts.push(mergedFilters.type);
    const label = labelParts.join(" · ") || T.save_search_action;
    saveSearch(mergedFilters, { label });
    setStatusMessage("Recherche sauvegardée localement");
  };

  const handleApplySavedSearch = (search) => {
    setEssentialFilters((prev) => ({ ...prev, ...search.filters }));
    setAdvancedFilters((prev) => ({ ...prev, ...search.filters }));
    setStatusMessage("Filtres restaurés depuis vos favoris");
    setHasInteracted(true);
    setIsDirty(true);
    navigate({ pathname: location.pathname, search: "" }, { replace: true });
  };

  const handleRemoveSearch = (id) => {
    removeSavedSearch(id);
    setStatusMessage("Recherche supprimée de cet appareil");
  };

  const handleToggleSaveOpportunity = (opportunity, event) => {
    event?.stopPropagation();
    const saved = toggleSavedOpportunity(opportunity);
    setStatusMessage(
      saved ? "Opportunité sauvegardée localement" : "Opportunité retirée de vos favoris"
    );
  };

  const handleRemoveLastFilter = () => {
    if (!lastChangedKey) return;
    if (lastChangedKey in essentialFilters) {
      setEssentialFilters((prev) => {
        const next = { ...prev, [lastChangedKey]: defaultEssentialFilters[lastChangedKey] };
        recomputeDirtyState(next, advancedFilters);
        return next;
      });
    } else if (lastChangedKey in advancedFilters) {
      setAdvancedFilters((prev) => {
        const next = { ...prev, [lastChangedKey]: defaultAdvancedFilters[lastChangedKey] };
        recomputeDirtyState(essentialFilters, next);
        return next;
      });
    }
    setHasInteracted(true);
    setLastChangedKey(null);
  };

  const handleExpandDates = () => {
    setEssentialFilters((prev) => ({ ...prev, date: "" }));
    setAdvancedFilters((prev) => ({ ...prev, dateEnd: "" }));
    recomputeDirtyState({ ...essentialFilters, date: "" }, { ...advancedFilters, dateEnd: "" });
  };

  const handleRelaxSportType = () => {
    setEssentialFilters((prev) => ({ ...prev, sport: "all", type: "all" }));
    recomputeDirtyState({ ...essentialFilters, sport: "all", type: "all" }, advancedFilters);
  };

  const lastVisitLabel = userData.lastVisitTimestamp
    ? new Date(userData.lastVisitTimestamp).toLocaleString(formatter, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const hasContinuityPrompt = !user &&
    (userData.savedOpportunities.length > 0 || userData.savedSearches.length > 0);

  const types = {
    Tournoi: T.type_tournament,
    Camp: T.type_camp,
    Académie: T.type_academy,
    "Coach personnel": T.type_coach,
    "Lieu / Infrastructure": T.type_venue,
    "Travel Team": T.type_travel_team,
  };
  const sports = [...new Set(allData.map((t) => t.sport))];
  const levels = ["Loisir", "Competition", "Elite"];
  const countriesByContinent = allData.reduce((acc, curr) => {
    if (curr.continent) {
      if (!acc[curr.continent]) acc[curr.continent] = [];
      if (!acc[curr.continent].includes(curr.country)) acc[curr.continent].push(curr.country);
    }
    return acc;
  }, {});
  const genders = { Masculin: T.gender_male, Féminin: T.gender_female, Mixte: T.gender_mixed };
  const categoriesByAgeGroup = allData.reduce((acc, curr) => {
    if (curr.ageGroup && curr.ageGroup !== "all") {
      if (!acc[curr.ageGroup]) acc[curr.ageGroup] = [];
      if (!acc[curr.ageGroup].includes(curr.category)) acc[curr.ageGroup].push(curr.category);
    }
    return acc;
  }, {});
  const continents = Object.keys(countriesByContinent);

  const activeFilters = Object.entries(mergedFilters)
    .filter(([key, value]) => value && value !== "all")
    .map(([key, value]) => ({
      key,
      label: `${key}: ${value}`,
      onRemove: () =>
        handleFilterChange({ target: { name: key, value: key in defaultEssentialFilters ? defaultEssentialFilters[key] : defaultAdvancedFilters[key] } },
          key in essentialFilters ? "essential" : "advanced"),
    }));

  const shouldShowPostSearchCtas = hasInteracted && (isDirty || opportunities.length > 0);

  const handleOpenAlerts = () => {
    setShowAlertsModal(true);
    setAlertsConfirmation("");
  };

  const handleSaveAlerts = () => {
    if (!alertsForm.email) {
      setAlertsConfirmation("Ajoutez un email pour recevoir les alertes.");
      return;
    }
    const newSubscription = {
      id: crypto.randomUUID(),
      filters: mergedFilters,
      email: alertsForm.email,
      frequency: alertsForm.frequency,
      label:
        activeFilters.map((f) => f.label).join(" • ") ||
        mergedFilters.keyword ||
        T.save_search_action,
    };
    const nextSubscriptions = [...alertsSubscriptions, newSubscription];
    setAlertsSubscriptions(nextSubscriptions);
    localStorage.setItem("alertsSubscriptions", JSON.stringify(nextSubscriptions));
    setAlertsConfirmation("Alertes activées pour cette recherche.");
    setShowAlertsModal(false);
  };

  const OpportunityCard = ({ opportunity }) => (
    <button
      key={opportunity.id}
      onClick={() => handleOpportunityClick(opportunity)}
      className="text-left"
    >
      <CardBase className="p-6 transition hover:shadow-lg hover:-translate-y-1">
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="text-xs font-semibold text-orange-600">{opportunity.type}</p>
            <h3 className="mt-1 font-semibold text-slate-800">{opportunity.name}</h3>
            <p className="text-xs text-slate-500">
              {opportunity.country} • {opportunity.sport}
              {opportunity.category !== "all" ? ` • ${opportunity.category}` : ""}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {opportunity.level !== "all" && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  opportunity.level === "Elite"
                    ? "bg-red-100 text-red-800"
                    : opportunity.level === "Competition"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {opportunity.level}
              </span>
            )}
            <button
              type="button"
              className={`text-xs font-semibold ${
                isOpportunitySaved(opportunity.id) ? "text-green-700" : "text-orange-600"
              } underline-offset-2 hover:underline`}
              onClick={(event) => handleToggleSaveOpportunity(opportunity, event)}
            >
              {isOpportunitySaved(opportunity.id) ? "Enregistré" : "Sauvegarder"}
            </button>
          </div>
        </div>
        {opportunity.date !== "2025-01-01" && (
          <p className="mt-4 text-sm text-slate-600">
            {new Date(opportunity.date).toLocaleDateString(formatter, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </CardBase>
    </button>
  );

  const ViewToggle = () => (
    <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Mode d'affichage">
      <button
        onClick={() => setView("list")}
        role="tab"
        aria-selected={view === "list"}
        disabled={loading}
        className={`px-4 py-2 text-sm font-semibold rounded-md ${
          view === "list" ? "bg-orange-600 text-white" : "bg-white text-slate-600"
        } ${loading ? "opacity-60" : ""}`}
      >
        {T.view_list}
      </button>
      <button
        onClick={() => setView("map")}
        role="tab"
        aria-selected={view === "map"}
        disabled={loading}
        className={`px-4 py-2 text-sm font-semibold rounded-md ${
          view === "map" ? "bg-orange-600 text-white" : "bg-white text-slate-600"
        } ${loading ? "opacity-60" : ""}`}
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
          <p className="mt-2 text-slate-600">Trouver une opportunité est la prochaine étape.</p>
          {lastVisitLabel && <p className="mt-2 text-xs text-slate-500">Dernière visite : {lastVisitLabel}</p>}
        </div>
        <div className="sr-only" aria-live="polite">
          {statusMessage || error}
        </div>

        <CardBase className="mt-10 p-6" aria-busy={loading}>
          <div className="flex flex-col gap-6" role="form" aria-label="Filtres de recherche">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700">{T.search_keyword}</label>
                <input
                  type="text"
                  name="keyword"
                  value={essentialFilters.keyword}
                  onChange={(e) => handleFilterChange(e, "essential")}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder={T.search_keyword_placeholder}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{T.filter_type}</label>
                <select
                  name="type"
                  value={essentialFilters.type}
                  onChange={(e) => handleFilterChange(e, "essential")}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="all">{T.type_all}</option>
                  {Object.entries(types).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{T.filter_sport}</label>
                <select
                  name="sport"
                  value={essentialFilters.sport}
                  onChange={(e) => handleFilterChange(e, "essential")}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="all">{T.filter_all}</option>
                  {sports.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{T.filter_country}</label>
                <select
                  name="country"
                  value={essentialFilters.country}
                  onChange={(e) => handleFilterChange(e, "essential")}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="all">{T.filter_all}</option>
                  {Object.entries(countriesByContinent).map(([continent, countries]) => (
                    <optgroup label={continent} key={continent}>
                      {countries
                        .sort()
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{T.filter_date_start}</label>
                <input
                  type="date"
                  name="date"
                  value={essentialFilters.date}
                  onChange={(e) => handleFilterChange(e, "essential")}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Affiner uniquement si nécessaire</p>
              <button
                type="button"
                className="text-sm text-orange-600 hover:underline"
                onClick={() => setIsAdvancedOpen((prev) => !prev)}
                aria-expanded={isAdvancedOpen}
              >
                {isAdvancedOpen ? "Masquer les filtres avancés" : "Afficher les filtres avancés"}
              </button>
            </div>

            {isAdvancedOpen && (
              <AdvancedFilters
                T={T}
                advancedFilters={advancedFilters}
                onChange={(e) => handleFilterChange(e, "advanced")}
                genders={genders}
                levels={levels}
                categoriesByAgeGroup={categoriesByAgeGroup}
                continents={continents}
                disabled={loading}
              />
            )}
          </div>
        </CardBase>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">{opportunities.length} opportunités</p>
            <p className="text-xs text-slate-500">La liste est votre point d'action principal.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-sm text-orange-600 hover:underline"
              onClick={resetFilters}
            >
              Réinitialiser
            </button>
            <ViewToggle />
          </div>
        </div>

        {shouldShowPostSearchCtas && (
          <div className="mt-6 space-y-3">
            <SaveSearchCTA visible onSave={handleSaveSearch} />
            <GetAlertsCTA visible onOpen={handleOpenAlerts} />
            {alertsConfirmation && <p className="text-sm text-green-700">{alertsConfirmation}</p>}
          </div>
        )}

        {loading ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite" role="status">
            {[...Array(3)].map((_, idx) => (
              <OpportunitySkeleton key={idx} />
            ))}
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
        ) : view === "list" ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.length > 0 ? (
              opportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))
            ) : (
              <EmptyStatePanel
                T={T}
                activeFilters={activeFilters}
                onResetAll={resetFilters}
                onRemoveLast={handleRemoveLastFilter}
                onExpandDates={handleExpandDates}
                onRelaxSportType={handleRelaxSportType}
              />
            )}
          </div>
        ) : (
          <div className="mt-8">
            <CardBase className="h-96 w-full flex items-center justify-center">
              <img
                src="https://placehold.co/1200x400/e2e8f0/64748b?text=Vue+Carte+Bientôt+Disponible"
                alt={T.alt_map_placeholder}
                className="w-full h-full object-cover rounded-xl"
              />
            </CardBase>
          </div>
        )}

        {userData.savedSearches.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-800">{T.saved_searches_title}</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.savedSearches.map((search) => (
                <CardBase key={search.id} className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{search.label}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {Object.entries(search.filters)
                          .filter(([key, value]) => value && value !== "all")
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(" • ") || T.filter_all}
                      </p>
                    </div>
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => handleRemoveSearch(search.id)}
                    >
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

        {userData.savedOpportunities.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-800">{T.saved_opportunities_title}</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.savedOpportunities.map((item) => (
                <CardBase key={item.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.type} • {item.country}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/opportunity/${item.id}`)}
                      className="text-sm text-orange-600 hover:underline"
                    >
                      {T.view_list}
                    </button>
                    <button
                      onClick={() => handleToggleSaveOpportunity(item)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
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
                    <p className="text-xs text-slate-500">
                      {item.type} • {item.country} • {item.sport}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/opportunity/${item.id}`)}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    {T.view_list}
                  </button>
                </CardBase>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAlertsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Activer les alertes email</h3>
            <p className="text-sm text-slate-600 mb-4">
              Choisissez une fréquence et indiquez un email pour recevoir les nouveautés de cette recherche.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={alertsForm.email}
                  onChange={(e) => setAlertsForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="vous@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Fréquence</label>
                <select
                  value={alertsForm.frequency}
                  onChange={(e) => setAlertsForm((prev) => ({ ...prev, frequency: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>
            </div>
            {alertsConfirmation && (
              <p className="mt-2 text-sm text-green-700" aria-live="polite">
                {alertsConfirmation}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="text-sm text-slate-600 hover:underline"
                onClick={() => setShowAlertsModal(false)}
              >
                Annuler
              </button>
              <PrimaryBtn type="button" onClick={handleSaveAlerts}>
                Valider
              </PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Search;
