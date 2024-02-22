import React, { useContext, useEffect } from 'react'
import { View } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'

import BackupPassword from './BackupPassword'
import ChangePassword from './ChangePassword'
import styles from './styles'

const DevicePasswordSettingsScreen = () => {
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)

  useEffect(() => {
    setCurrentSettingsPage('device-password')
  }, [setCurrentSettingsPage])
  return (
    <View style={flexbox.directionRow}>
      <ChangePassword />
      <View style={styles.separator} />
      <BackupPassword />
    </View>
  )
}

export default React.memo(DevicePasswordSettingsScreen)
