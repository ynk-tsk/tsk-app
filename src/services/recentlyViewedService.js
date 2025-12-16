const STORAGE_KEY = 'tsk_recently_viewed_v1';
const VERSION = 1;
const MAX_ITEMS = 20;

const getInitialState = () => ({ version: VERSION, items: [] });

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw);
    if (parsed.version !== VERSION) return getInitialState();
    return parsed;
  } catch (e) {
    console.warn('recently viewed parse error', e);
    return getInitialState();
  }
};

const writeStore = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, items: data.items || [] }));
};

export const listRecentlyViewed = () => readStore().items;

export const addRecentlyViewed = (opportunity) => {
  const store = readStore();
  const filtered = store.items.filter((item) => item.id !== opportunity.id);
  const entry = {
    id: opportunity.id,
    name: opportunity.name,
    type: opportunity.type,
    sport: opportunity.sport,
    country: opportunity.country,
    date: opportunity.date,
    level: opportunity.level,
    lastViewedAt: Date.now(),
  };
  store.items = [entry, ...filtered].slice(0, MAX_ITEMS);
  writeStore(store);
  return store.items;
};

export const clearRecentlyViewed = () => writeStore(getInitialState());
