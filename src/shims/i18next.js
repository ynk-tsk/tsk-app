const listeners = new Set()
let resourcesStore = {}
let currentLanguage = 'fr'
let fallbackLanguage = 'fr'
let plugin = null

const i18n = {
  type: 'i18n',
  use(thirdParty) {
    plugin = thirdParty
    return this
  },
  init(config = {}) {
    resourcesStore = config.resources || {}
    currentLanguage = config.lng || config.fallbackLng || Object.keys(resourcesStore)[0] || 'fr'
    fallbackLanguage = config.fallbackLng || currentLanguage
    if (plugin && typeof plugin.init === 'function') plugin.init(this)
    return this
  },
  changeLanguage(lng) {
    const target = resourcesStore[lng] ? lng : fallbackLanguage
    currentLanguage = target
    listeners.forEach((cb) => cb(currentLanguage))
    return Promise.resolve(currentLanguage)
  },
  get language() {
    return currentLanguage
  },
  on(event, cb) {
    if (event === 'languageChanged') listeners.add(cb)
  },
  off(event, cb) {
    if (event === 'languageChanged') listeners.delete(cb)
  },
  getResourceBundle(lng, namespace) {
    const langKey = resourcesStore[lng] ? lng : fallbackLanguage
    if (!langKey) return {}
    if (namespace && resourcesStore[langKey]?.[namespace]) return resourcesStore[langKey][namespace]
    return resourcesStore[langKey] || {}
  },
}

export default i18n
