import * as Localization from 'expo-localization'
import i18n from 'i18n-js'

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: { welcome: 'Hello' },
  bg: { welcome: 'Добре дошли' },
}

export const setLocale = () => (i18n.locale = Localization.locale)

export default i18n
