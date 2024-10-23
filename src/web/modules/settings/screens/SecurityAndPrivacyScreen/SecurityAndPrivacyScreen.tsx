import React, { useContext, useEffect } from 'react'
import { View } from 'react-native'

import SettingsPageHeader from '../../components/SettingsPageHeader'
import { SettingsRoutesContext } from '../../contexts/SettingsRoutesContext'
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
