const listeners = new Set();

const i18n = {
  language: 'fr',
  resources: {},
  fallbackLng: 'fr',
  use(plugin) {
    this.plugin = plugin;
    return this;
  },
  init(options = {}) {
    this.resources = options.resources || {};
    this.language = options.lng || this.language;
    this.fallbackLng = options.fallbackLng || this.language;
    if (this.plugin && typeof this.plugin.init === 'function') {
      this.plugin.init(this);
    }
    this.isInitialized = true;
    return this;
  },
  changeLanguage(lang) {
    if (lang) {
      this.language = lang;
      listeners.forEach((cb) => cb(lang));
    }
    return Promise.resolve();
  },
  t(key, defaultValue) {
    const translation = this.getResourceBundle(this.language, 'translation') || {};
    return translation[key] ?? defaultValue ?? key;
  },
  getResourceBundle(lang, namespace) {
    if (!lang || !namespace) return undefined;
    const languageResources = this.resources?.[lang];
    return languageResources ? languageResources[namespace] : undefined;
  },
  on(event, callback) {
    if (event === 'languageChanged' && callback) listeners.add(callback);
  },
  off(event, callback) {
    if (event === 'languageChanged' && callback) listeners.delete(callback);
  },
};

export default i18n;
