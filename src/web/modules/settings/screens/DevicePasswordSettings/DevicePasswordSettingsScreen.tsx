import React from 'react'

import SettingsPage from '@web/modules/settings/components/SettingsPage'
import flexbox from '@common/styles/utils/flexbox'
import { View } from 'react-native'
import ChangePassword from './ChangePassword'
import BackupPassword from './BackupPassword'

import styles from './styles'

const DevicePasswordSettingsScreen = () => {
  return (
    <SettingsPage currentPage="device-password">
      <View style={flexbox.directionRow}>
        <ChangePassword />
        <View style={styles.separator} />
        <BackupPassword />
      </View>
    </SettingsPage>
  )
}

export default DevicePasswordSettingsScreen

