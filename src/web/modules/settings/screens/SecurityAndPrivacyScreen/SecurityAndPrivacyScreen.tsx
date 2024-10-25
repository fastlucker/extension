import React, { useContext, useEffect } from 'react'
import { View } from 'react-native'

import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'

import SavedSeedControlOption from './components/SavedSeedControlOption'

const SecurityAndPrivacyScreen = () => {
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)

  useEffect(() => {
    setCurrentSettingsPage('security')
  }, [setCurrentSettingsPage])

  return (
    <>
      <SettingsPageHeader title="Security & Privacy" />
      <View>
        <SavedSeedControlOption />
      </View>
    </>
  )
}

export default SecurityAndPrivacyScreen
