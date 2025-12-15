import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useLocalUserData, { generateStableId } from "./useLocalUserData";
import useAuthUserData from "./useAuthUserData";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const local = useLocalUserData();
  const auth = useAuthUserData();
  const [activeData, setActiveData] = useState(local.data);
  const [continuityPrompt, setContinuityPrompt] = useState("");

  useEffect(() => {
    if (auth.user) {
      setActiveData(auth.data);
    }
  }, [auth.user, auth.data]);

  useEffect(() => {
    if (!auth.user) {
      setActiveData(local.data);
    }
  }, [auth.user, local.data]);

  useEffect(() => {
    if (!activeData.lastVisitTimestamp) {
      local.updateData((prev) => ({ ...prev, lastVisitTimestamp: Date.now() }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runUpdate = useCallback((updater) => {
    if (auth.user) auth.updateData(updater);
    else local.updateData(updater);
  }, [auth.user, auth.updateData, local.updateData]);

  const toggleSavedOpportunity = useCallback((opportunity) => {
    let saved = false;
    runUpdate((prev) => {
      const exists = prev.savedOpportunities.some((item) => item.id === opportunity.id);
      saved = !exists;
      const savedOpportunities = exists
        ? prev.savedOpportunities.filter((item) => item.id !== opportunity.id)
        : [{ ...opportunity, savedAt: Date.now() }, ...prev.savedOpportunities];
      return { ...prev, savedOpportunities };
    });
    if (!auth.user) setContinuityPrompt("saved");
    return saved;
  }, [auth.user, runUpdate]);

  const saveSearch = useCallback((filters, metadata = {}) => {
    const searchId = metadata.id || generateStableId("search");
    runUpdate((prev) => ({
      ...prev,
      savedSearches: [
        {
          id: searchId,
          filters,
          label: metadata.label || metadata.title || "Recherche personnalisée",
          savedAt: Date.now(),
        },
        ...prev.savedSearches.filter((item) => item.id !== searchId),
      ],
    }));
    if (!auth.user) setContinuityPrompt("search");
    return searchId;
  }, [auth.user, runUpdate]);

  const removeSavedSearch = useCallback((id) => runUpdate((prev) => ({
    ...prev,
    savedSearches: prev.savedSearches.filter((item) => item.id !== id),
  })), [runUpdate]);

  const recordRecentlyViewed = useCallback((opportunity) => {
    runUpdate((prev) => {
      const withoutCurrent = prev.recentlyViewed.filter((item) => item.id !== opportunity.id);
      const entry = {
        id: opportunity.id,
        name: opportunity.name,
        type: opportunity.type,
        sport: opportunity.sport,
        country: opportunity.country,
        viewedAt: Date.now(),
      };
      return { ...prev, recentlyViewed: [entry, ...withoutCurrent].slice(0, 10) };
    });
  }, [runUpdate]);

  const markLastVisit = useCallback(() => runUpdate((prev) => ({ ...prev, lastVisitTimestamp: Date.now() })), [runUpdate]);

  const login = useCallback((email, incomingData = local.data) => {
    const result = auth.authenticate(email, incomingData);
    if ((incomingData.savedOpportunities?.length || incomingData.savedSearches?.length || incomingData.recentlyViewed?.length)) {
      local.clearData();
    }
    setContinuityPrompt("");
    return result;
  }, [auth, local]);

  const logout = useCallback(() => {
    auth.logout();
    setContinuityPrompt("");
  }, [auth]);

  const value = useMemo(() => ({
    user: auth.user,
    data: activeData,
    isOpportunitySaved: (id) => activeData.savedOpportunities?.some((item) => item.id === id),
    toggleSavedOpportunity,
    saveSearch,
    removeSavedSearch,
    recordRecentlyViewed,
    markLastVisit,
    login,
    logout,
    migrationSummary: auth.migrationSummary,
    clearMigrationSummary: auth.clearMigrationSummary,
    continuityPrompt,
    setContinuityPrompt,
  }), [activeData, auth.user, auth.migrationSummary, auth.clearMigrationSummary, toggleSavedOpportunity, saveSearch, removeSavedSearch, recordRecentlyViewed, markLastVisit, login, logout, continuityPrompt]);

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export const useUserData = () => useContext(UserDataContext);
