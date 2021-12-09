import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@config/localization/translations/en.json'
import bg from '@config/localization/translations/bg.json'
import { Locale } from '@config/localization/constants'

// Set the key-value pairs for the different languages you want to support.
i18n.use(initReactI18next).init({
  // In future, when a second language gets activated, uncomment this
  // in order to set the initial language to device language.
  // lng: Localization.locale
  lng: Locale.EN,
  fallbackLng: Locale.BG,
  defaultNS: 'app',
  resources: { [Locale.EN]: { app: en }, [Locale.BG]: { app: bg } },
  interpolation: {
    escapeValue: false,
  },
})

export const changeLanguage = (locale: Locale) => i18n.changeLanguage(locale)

export default i18n
export * from 'react-i18next'
