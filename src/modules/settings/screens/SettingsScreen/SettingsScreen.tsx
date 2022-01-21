import React from 'react'

import Wrapper from '@modules/common/components/Wrapper'
import Passcode from '@modules/settings/components/Passcode'

const SettingsScreen = () => {
  // const { t, i18n } = useTranslation()

  // const handleChangeLanguage = () => {
  //   changeLanguage(i18n.language === Locale.BG ? Locale.EN : Locale.BG)
  // }

  return (
    <Wrapper>
      <Passcode />

      {/* {!isProd && (
        <Button
          title={t('Change language to {{nextLang}}', {
            nextLang: i18n.language === Locale.BG ? t('English') : t('Bulgarian')
          })}
          onPress={handleChangeLanguage}
        />
      )} */}
    </Wrapper>
  )
}

export default SettingsScreen
