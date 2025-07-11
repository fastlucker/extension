import React, { useContext, useEffect } from 'react'
import { View } from 'react-native'

import { isProd } from '@common/config/env'
import spacings from '@common/styles/spacings'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'

import AutoLockDeviceControlOption from './components/AutoLockDeviceControlOption'
import CrashAnalyticsControlOption from './components/CrashAnalyticsControlOption'
import LockAmbireControlOption from './components/LockAmbireControlOption'
import LogLevelControlOption from './components/LogLevelControlOption'
import ThemeControlOption from './components/ThemeControlOption'

const GeneralSettingsScreen = () => {
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)

  useEffect(() => {
    setCurrentSettingsPage('general')
  }, [setCurrentSettingsPage])

  return (
    <>
      <SettingsPageHeader title="General settings" />
      <View style={spacings.mb2Xl}>
        <LockAmbireControlOption />
        <AutoLockDeviceControlOption />
        <ThemeControlOption />
      </View>
      <SettingsPageHeader title="Support tools" />
      <LogLevelControlOption />
      {/* 
        Crash analytics is only available in production builds.
        Even tho we tag errors with the environment, we don't want to
        spam Sentry with errors that occur during development.
      */}
      {isProd && <CrashAnalyticsControlOption />}
    </>
  )
}

export default GeneralSettingsScreen
