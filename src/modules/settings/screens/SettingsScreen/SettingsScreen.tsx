import React from 'react'

import AppVersion from '@modules/common/components/AppVersion'
import Wrapper from '@modules/common/components/Wrapper'
import AppLocking from '@modules/settings/components/AppLocking'
import BiometricsSign from '@modules/settings/components/BiometricsSign'
import ConnectedDapps from '@modules/settings/components/ConnectedDapps'
import LocalAuth from '@modules/settings/components/LocalAuth'
import Passcode from '@modules/settings/components/Passcode'
import Signers from '@modules/settings/components/Signers'
import Theme from '@modules/settings/components/Theme'

const SettingsScreen = () => {
  // TODO: Option to change the app language, when a second one gets introduced.
  // const { t, i18n } = useTranslation()
  // const handleChangeLanguage = () => {
  //   changeLanguage(i18n.language === Locale.BG ? Locale.EN : Locale.BG)
  // }

  return (
    <Wrapper>
      <ConnectedDapps />
      <Passcode />
      <LocalAuth />
      <BiometricsSign />
      <AppLocking />
      <Theme />
      <Signers />
      <AppVersion />
    </Wrapper>
  )
}

export default SettingsScreen
