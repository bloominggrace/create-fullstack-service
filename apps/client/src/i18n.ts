import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { en, ko } from '@/locales';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: typeof en };
  }
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
    } as const,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ko'],
    interpolation: { escapeValue: false },
  });
