import React, { useEffect, useState } from 'react'
import i18n from './i18next'

export const initReactI18next = {
  type: '3rdParty',
  init() {
    return true
  },
}

export function useTranslation() {
  const [language, setLanguage] = useState(i18n.language)

  useEffect(() => {
    const handler = (lng) => setLanguage(lng)
    i18n.on('languageChanged', handler)
    return () => i18n.off('languageChanged', handler)
  }, [])

  return {
    i18n: {
      language,
      changeLanguage: (lng) => i18n.changeLanguage(lng),
      getResourceBundle: (lng, namespace) => i18n.getResourceBundle(lng, namespace),
    },
  }
}

export default { initReactI18next, useTranslation }
