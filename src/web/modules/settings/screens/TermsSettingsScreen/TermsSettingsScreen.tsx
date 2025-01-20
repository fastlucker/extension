import React from 'react'

import useNavigation from '@common/hooks/useNavigation'
import HeaderBackButton from '@common/modules/header/components/HeaderBackButton'
import { ROUTES } from '@common/modules/router/constants/common'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'
import TermsComponent from '@web/modules/terms/components'

const TermsSettingsScreen = () => {
  const { navigate } = useNavigation()

  const goBack = () => {
    navigate(ROUTES.settingsAbout)
  }

  return (
    <>
      <SettingsPageHeader title="Terms of Service">
        <HeaderBackButton hideInPopup forceBack onGoBackPress={goBack} />
      </SettingsPageHeader>
      <TermsComponent />
    </>
  )
}

export default React.memo(TermsSettingsScreen)
