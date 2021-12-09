import * as Localization from 'expo-localization'
import i18n from 'i18n-js'

import en from '@config/localization/languages/en.json'
import bg from '@config/localization/languages/bg.json'

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en,
  bg,
}

export const setLocale = () => (i18n.locale = Localization.locale)

export default i18n
