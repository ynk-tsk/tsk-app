import { useCallback, useMemo, useState } from "react";
import { defaultUserData } from "./useLocalUserData";

const AUTH_PREFIX = "tsk-account:";

const mergeLists = (primary = [], incoming = []) => {
  const map = new Map();
  [...primary, ...incoming].forEach((item) => {
    if (!item?.id) return;
    map.set(item.id, item);
  });
  return Array.from(map.values());
};

const mergeUserData = (base = defaultUserData, incoming = defaultUserData) => ({
  ...defaultUserData,
  ...base,
  ...incoming,
  savedOpportunities: mergeLists(base.savedOpportunities, incoming.savedOpportunities),
  savedSearches: mergeLists(base.savedSearches, incoming.savedSearches),
  recentlyViewed: mergeLists(base.recentlyViewed, incoming.recentlyViewed),
  lastVisitTimestamp: Math.max(base.lastVisitTimestamp || 0, incoming.lastVisitTimestamp || 0) || Date.now(),
});

const loadAccountData = (email) => {
  const stored = localStorage.getItem(`${AUTH_PREFIX}${email}`);
  if (!stored) return defaultUserData;
  try {
    const parsed = JSON.parse(stored);
    return mergeUserData(defaultUserData, parsed);
  } catch (e) {
    console.warn("Unable to parse account data", e);
    return defaultUserData;
  }
};

export default function useAuthUserData() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(defaultUserData);
  const [migrationSummary, setMigrationSummary] = useState(null);

  const persistData = (email, payload) => {
    localStorage.setItem(`${AUTH_PREFIX}${email}`, JSON.stringify(payload));
  };

  const authenticate = useCallback((email, incomingData = defaultUserData) => {
    const existing = loadAccountData(email);
    const merged = mergeUserData(existing, incomingData);
    persistData(email, merged);
    setUser({ email });
    setData(merged);
    const opportunitiesTransferred = incomingData.savedOpportunities?.length || 0;
    const searchesTransferred = incomingData.savedSearches?.length || 0;
    if (opportunitiesTransferred || searchesTransferred) {
      setMigrationSummary({ opportunitiesTransferred, searchesTransferred });
    } else {
      setMigrationSummary(null);
    }
    return { user: { email }, data: merged };
  }, []);

  const updateData = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (user?.email) persistData(user.email, next);
      return next;
    });
  }, [user?.email]);

  const logout = useCallback(() => {
    setUser(null);
    setData(defaultUserData);
    setMigrationSummary(null);
  }, []);

  const clearMigrationSummary = useCallback(() => setMigrationSummary(null), []);

  return useMemo(() => ({ user, data, updateData, authenticate, logout, migrationSummary, clearMigrationSummary }), [user, data, migrationSummary, authenticate, updateData, logout, clearMigrationSummary]);
}
