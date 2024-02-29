import React, { useContext, useEffect } from 'react'
import { View } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'

import AddToken from './AddToken'
import HideToken from './HideToken'
import styles from './styles'

const CustomTokensSettingsScreen = () => {
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)

  useEffect(() => {
    setCurrentSettingsPage('custom-tokens')
  }, [setCurrentSettingsPage])
  return (
    <View style={flexbox.directionRow}>
      <AddToken />
      <View style={styles.separator} />
      <HideToken />
    </View>
  )
}

export default CustomTokensSettingsScreen
