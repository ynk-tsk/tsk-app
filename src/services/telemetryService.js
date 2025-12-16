const STORAGE_KEY = 'tsk_telemetry_v1';
const VERSION = 1;

const defaultCounters = () => ({
  search_sessions_started: 0,
  filters_changed: 0,
  save_search_clicked: 0,
  saved_search_created: 0,
  alert_created: 0,
  opportunity_saved: 0,
  opportunity_viewed: 0,
  zero_results_seen: 0,
});

const getInitialState = () => ({
  version: VERSION,
  session: {
    id: crypto.randomUUID(),
    startedAt: Date.now(),
    counters: defaultCounters(),
  },
  history: {},
});

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw);
    if (parsed.version !== VERSION) return getInitialState();
    return parsed;
  } catch (e) {
    console.warn('telemetry parse error', e);
    return getInitialState();
  }
};

const writeStore = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const startSession = () => {
  const store = readStore();
  if (!store.session || Date.now() - store.session.startedAt > 1000 * 60 * 60 * 4) {
    store.session = { id: crypto.randomUUID(), startedAt: Date.now(), counters: defaultCounters() };
    store.sessionStartedAt = Date.now();
    store.session_start = Date.now();
  }
  writeStore(store);
  return store.session.startedAt;
};

export const incrementCounter = (key) => {
  const store = readStore();
  if (!store.session) startSession();
  const updated = readStore();
  updated.session.counters[key] = (updated.session.counters[key] || 0) + 1;
  const dayKey = new Date().toISOString().slice(0, 10);
  if (!updated.history[dayKey]) updated.history[dayKey] = defaultCounters();
  updated.history[dayKey][key] = (updated.history[dayKey][key] || 0) + 1;
  writeStore(updated);
};

export const getTelemetrySnapshot = () => {
  const store = readStore();
  const dayKeys = Object.keys(store.history);
  const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const aggregated = defaultCounters();
  dayKeys.forEach((day) => {
    const date = new Date(day);
    if (date.getTime() >= cutoff) {
      const counters = store.history[day];
      Object.keys(counters).forEach((key) => {
        aggregated[key] = (aggregated[key] || 0) + (counters[key] || 0);
      });
    }
  });
  return { session: store.session, last7Days: aggregated };
};

export const resetTelemetry = () => {
  const reset = getInitialState();
  writeStore(reset);
};
