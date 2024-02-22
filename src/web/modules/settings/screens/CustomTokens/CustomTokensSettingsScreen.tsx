import React from 'react'
import { View } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'
import SettingsPage from '@web/modules/settings/components/SettingsPage'

import AddToken from './AddToken'
import HideToken from './HideToken'
import styles from './styles'

const DevicePasswordSettingsScreen = () => {
  return (
    <SettingsPage currentPage="custom-tokens">
      <View style={flexbox.directionRow}>
        <AddToken />
        <View style={styles.separator} />
        <HideToken />
      </View>
    </SettingsPage>
  )
}

export default DevicePasswordSettingsScreen
