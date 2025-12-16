const STORAGE_KEY = 'tsk_alerts_v1';
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
    console.warn('alerts parse error', e);
    return getInitialState();
  }
};

const writeStore = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, items: data.items || [] }));
};

export const listAlerts = () => readStore().items;

export const createAlert = ({ label, filters, frequency, email, localOnly }) => {
  const store = readStore();
  const item = {
    id: crypto.randomUUID(),
    label,
    filters,
    frequency,
    email: email || '',
    localOnly: !!localOnly,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  store.items = [item, ...store.items];
  writeStore(store);
  return item;
};

export const updateAlert = (id, payload = {}) => {
  const store = readStore();
  store.items = store.items.map((item) =>
    item.id === id ? { ...item, ...payload, updatedAt: Date.now() } : item
  );
  writeStore(store);
};

export const deleteAlert = (id) => {
  const store = readStore();
  store.items = store.items.filter((item) => item.id !== id);
  writeStore(store);
};

export const clearAlerts = () => writeStore(getInitialState());
