import React from 'react'
import { Button, StyleSheet, View } from 'react-native'

import Placeholder from '@modules/common/components/Placeholder'
import { changeLanguage, useTranslation } from '@config/localization'
import { Locale } from '@config/localization/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const SettingsScreen = () => {
  const { t, i18n } = useTranslation()

  const handleChangeLanguage = () => {
    changeLanguage(i18n.language === Locale.BG ? Locale.EN : Locale.BG)
  }

  return (
    <View style={styles.container}>
      <Placeholder text={t('Settings screen')} />

      <Button
        title={t('Change language to {{nextLang}}', {
          nextLang: i18n.language === Locale.BG ? t('English') : t('Bulgarian'),
        })}
        onPress={handleChangeLanguage}
      />
    </View>
  )
}

export default SettingsScreen
