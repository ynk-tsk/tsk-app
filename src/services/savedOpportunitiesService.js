const STORAGE_KEY = 'tsk_saved_opportunities_v1';
const VERSION = 1;

const getInitialState = () => ({ version: VERSION, items: [] });

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw);
    if (parsed.version !== VERSION) return getInitialState();
    return parsed;
  } catch (e) {
    console.warn('saved opp parse error', e);
    return getInitialState();
  }
};

const writeStore = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, items: data.items || [] }));
};

export const listSavedOpportunities = () => readStore().items;

export const toggleSavedOpportunity = (opportunity) => {
  const store = readStore();
  const exists = store.items.find((item) => item.id === opportunity.id);
  if (exists) {
    store.items = store.items.filter((item) => item.id !== opportunity.id);
  } else {
    const minimal = {
      id: opportunity.id,
      name: opportunity.name,
      type: opportunity.type,
      sport: opportunity.sport,
      country: opportunity.country,
      date: opportunity.date,
      level: opportunity.level,
      savedAt: Date.now(),
    };
    store.items = [minimal, ...store.items];
  }
  writeStore(store);
  return readStore().items;
};

export const removeSavedOpportunity = (id) => {
  const store = readStore();
  store.items = store.items.filter((item) => item.id !== id);
  writeStore(store);
};

export const clearSavedOpportunities = () => writeStore(getInitialState());
