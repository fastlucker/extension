import React from 'react'

import Wrapper from '@modules/common/components/Wrapper'
import LocalAuth from '@modules/settings/components/LocalAuth'
import Passcode from '@modules/settings/components/Passcode'
import PasscodeSign from '@modules/settings/components/PasscodeSign'

const SettingsScreen = () => {
  // const { t, i18n } = useTranslation()

  // const handleChangeLanguage = () => {
  //   changeLanguage(i18n.language === Locale.BG ? Locale.EN : Locale.BG)
  // }

  return (
    <Wrapper>
      <Passcode />
      <LocalAuth />
      <PasscodeSign />

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
