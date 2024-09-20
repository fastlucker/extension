import React, { useContext, useEffect } from 'react'
import { View } from 'react-native'

import SettingsPageHeader from '../../components/SettingsPageHeader'
import { SettingsRoutesContext } from '../../contexts/SettingsRoutesContext'
import AutoLockDeviceControlOption from './components/AutoLockDeviceControlOption'
import DefaultWalletControlOption from './components/DefaultWalletControlOption'
import LockAmbireControlOption from './components/LockAmbireControlOption'

const GeneralSettingsScreen = () => {
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)

  useEffect(() => {
    setCurrentSettingsPage('general')
  }, [setCurrentSettingsPage])

  return (
    <>
      <SettingsPageHeader title="General Settings" />
      <View>
        <LockAmbireControlOption />
        <AutoLockDeviceControlOption />
        <DefaultWalletControlOption />
      </View>
    </>
  )
}

export default GeneralSettingsScreen
