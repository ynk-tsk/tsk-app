const STORAGE_KEY = 'ux_analytics_v1';

const defaultCounters = {
  searches: 0,
  saves: 0,
  alertsClicks: 0,
  zeroResultEvents: 0,
  opportunityClicks: 0,
};

const isStorageAvailable = () => typeof window !== 'undefined' && !!window.localStorage;

const persistState = (state) => {
  if (!isStorageAvailable()) return state;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
};

const loadState = () => {
  if (!isStorageAvailable()) {
    return { sessions: [], currentSessionId: null };
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return { sessions: [], currentSessionId: null };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.sessions)) {
      return parsed;
    }
  } catch (e) {
    // ignore parse errors and reset state
  }
  return { sessions: [], currentSessionId: null };
};

const pruneOldSessions = (state) => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  state.sessions = state.sessions.filter((session) => session.start >= thirtyDaysAgo);
};

const ensureSession = () => {
  const state = loadState();
  let session = state.sessions.find((s) => s.id === state.currentSessionId);
  if (!session) {
    session = {
      id: `session-${Date.now()}`,
      start: Date.now(),
      counters: { ...defaultCounters },
    };
    state.currentSessionId = session.id;
    state.sessions.push(session);
  }
  pruneOldSessions(state);
  persistState(state);
  return { state, session };
};

const recordEvent = (key) => {
  const { state, session } = ensureSession();
  session.counters[key] = (session.counters[key] || 0) + 1;
  persistState(state);
};

export const startSession = () => ensureSession().session;
export const trackSearchInteraction = () => recordEvent('searches');
export const trackSaveSearch = () => recordEvent('saves');
export const trackAlertsClick = () => recordEvent('alertsClicks');
export const trackZeroResultEvent = () => recordEvent('zeroResultEvents');
export const trackOpportunityClick = () => recordEvent('opportunityClicks');

export const resetAnalytics = () => {
  if (!isStorageAvailable()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  ensureSession();
};

export const getAnalyticsSnapshot = () => {
  const { state, session } = ensureSession();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const aggregate = { ...defaultCounters };

  state.sessions
    .filter((s) => s.start >= sevenDaysAgo)
    .forEach((s) => {
      Object.entries(defaultCounters).forEach(([key]) => {
        aggregate[key] += s.counters?.[key] || 0;
      });
    });

  return {
    currentSession: {
      start: session.start,
      ...defaultCounters,
      ...session.counters,
    },
    last7Days: {
      since: sevenDaysAgo,
      sessionsCount: state.sessions.filter((s) => s.start >= sevenDaysAgo).length,
      ...aggregate,
    },
  };
};
