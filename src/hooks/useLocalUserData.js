import { useCallback, useEffect, useState } from "react";

export const defaultUserData = {
  savedOpportunities: [],
  savedSearches: [],
  recentlyViewed: [],
  lastVisitTimestamp: null,
};

export const LOCAL_STORAGE_KEY = "tsk-local-user-data";

export const generateStableId = (prefix = "item") => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeData = (payload) => ({
  ...defaultUserData,
  ...payload,
  savedOpportunities: Array.isArray(payload?.savedOpportunities) ? payload.savedOpportunities : [],
  savedSearches: Array.isArray(payload?.savedSearches) ? payload.savedSearches : [],
  recentlyViewed: Array.isArray(payload?.recentlyViewed) ? payload.recentlyViewed : [],
});

export default function useLocalUserData() {
  const [data, setData] = useState(defaultUserData);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData((prev) => ({ ...normalizeData(prev), ...normalizeData(parsed), lastVisitTimestamp: parsed.lastVisitTimestamp || Date.now() }));
        return;
      } catch (e) {
        console.warn("Unable to parse local user data", e);
      }
    }
    setData((prev) => ({ ...prev, lastVisitTimestamp: Date.now() }));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = useCallback((updater) => {
    setData((prev) => normalizeData(typeof updater === "function" ? updater(prev) : updater));
  }, []);

  const clearData = useCallback(() => setData(defaultUserData), []);

  return { data, updateData, clearData };
}
