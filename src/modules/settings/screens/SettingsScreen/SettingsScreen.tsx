import React from 'react'

import AppVersion from '@modules/common/components/AppVersion'
import Button from '@modules/common/components/Button'
import Wrapper from '@modules/common/components/Wrapper'
import useTheme from '@modules/common/hooks/useTheme'
import { THEME_TYPES } from '@modules/common/styles/themeConfig'
import AppLocking from '@modules/settings/components/AppLocking'
import BiometricsSign from '@modules/settings/components/BiometricsSign'
import ConnectedDapps from '@modules/settings/components/ConnectedDapps'
import LocalAuth from '@modules/settings/components/LocalAuth'
import Passcode from '@modules/settings/components/Passcode'

const SettingsScreen = () => {
  // TODO: Option to change the app language, when a second one gets introduced.
  // const { t, i18n } = useTranslation()
  // const handleChangeLanguage = () => {
  //   changeLanguage(i18n.language === Locale.BG ? Locale.EN : Locale.BG)
  // }

  const { setThemeType, themeType } = useTheme()

  return (
    <Wrapper>
      <ConnectedDapps />
      <Passcode />
      <LocalAuth />
      <BiometricsSign />
      <AppLocking />
      <Button
        onPress={() => {
          if (themeType === THEME_TYPES.LIGHT) {
            setThemeType(THEME_TYPES.DARK)
          } else {
            setThemeType(THEME_TYPES.LIGHT)
          }
        }}
        text={`Enable ${themeType === THEME_TYPES.LIGHT ? 'Dark' : 'Light'} Mode`}
      />
      <AppVersion />
    </Wrapper>
  )
}

export default SettingsScreen
