const STORAGE_KEY = 'tsk_saved_searches_v1';
const VERSION = 1;

const getInitialState = () => ({ version: VERSION, items: [] });

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw);
    if (!parsed.version || parsed.version !== VERSION) return getInitialState();
    return parsed;
  } catch (e) {
    console.warn('saved searches parse error', e);
    return getInitialState();
  }
};

const writeStore = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, items: data.items || [] }));
};

export const listSavedSearches = () => readStore().items;

export const createSavedSearch = ({ name, filters }) => {
  const store = readStore();
  const item = {
    id: crypto.randomUUID(),
    name,
    filters,
    createdAt: Date.now(),
    lastUsedAt: Date.now(),
    useCount: 0,
  };
  store.items = [item, ...store.items];
  writeStore(store);
  return item;
};

export const updateSavedSearch = (id, payload = {}) => {
  const store = readStore();
  store.items = store.items.map((item) => (item.id === id ? { ...item, ...payload } : item));
  writeStore(store);
};

export const deleteSavedSearch = (id) => {
  const store = readStore();
  store.items = store.items.filter((item) => item.id !== id);
  writeStore(store);
};

export const duplicateSavedSearch = (id) => {
  const store = readStore();
  const target = store.items.find((item) => item.id === id);
  if (!target) return null;
  const copy = {
    ...target,
    id: crypto.randomUUID(),
    name: `${target.name} (copie)`,
    createdAt: Date.now(),
    lastUsedAt: Date.now(),
    useCount: 0,
  };
  store.items = [copy, ...store.items];
  writeStore(store);
  return copy;
};

export const markSavedSearchUsed = (id) => {
  const store = readStore();
  store.items = store.items.map((item) =>
    item.id === id
      ? { ...item, lastUsedAt: Date.now(), useCount: (item.useCount || 0) + 1 }
      : item
  );
  writeStore(store);
};

export const clearSavedSearches = () => writeStore(getInitialState());
