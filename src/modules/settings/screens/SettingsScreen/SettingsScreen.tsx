import React from 'react'
import { Button, View } from 'react-native'

import { isProd } from '@config/env'
import { changeLanguage, useTranslation } from '@config/localization'
import { Locale } from '@config/localization/constants'
import Placeholder from '@modules/common/components/Placeholder'

import styles from './styles'

const SettingsScreen = () => {
  const { t, i18n } = useTranslation()

  const handleChangeLanguage = () => {
    changeLanguage(i18n.language === Locale.BG ? Locale.EN : Locale.BG)
  }

  return (
    <View style={styles.container}>
      <Placeholder text={t('Settings screen')} />

      {!isProd && (
        <Button
          title={t('Change language to {{nextLang}}', {
            nextLang: i18n.language === Locale.BG ? t('English') : t('Bulgarian'),
          })}
          onPress={handleChangeLanguage}
        />
      )}
    </View>
  )
}

export default SettingsScreen
