import { useCallback, useEffect, useMemo, useState } from 'react'
import i18n from './i18next'

export const initReactI18next = {
  type: '3rdParty',
  init(instance) {
    instance.isInitialized = true
  },
}

export function useTranslation() {
  const [language, setLanguage] = useState(i18n.language)

  useEffect(() => {
    const handler = (lng) => setLanguage(lng)
    i18n.on('languageChanged', handler)
    return () => i18n.off('languageChanged', handler)
  }, [])

  const t = useCallback((key, defaultValue) => i18n.t(key, defaultValue), [language])

  return useMemo(() => ({ t, i18n }), [t])
}
