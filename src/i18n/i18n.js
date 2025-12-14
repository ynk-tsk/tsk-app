import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './resources';

export const languageOptions = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
};

export const locales = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
};

const formattedResources = Object.entries(resources).reduce((acc, [lang, translation]) => {
  acc[lang] = { translation };
  return acc;
}, {});

i18n
  .use(initReactI18next)
  .init({
    resources: formattedResources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
  });

export default i18n;
