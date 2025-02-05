import React, { useContext, useEffect } from 'react'
import { View } from 'react-native'

import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'

import AddToken from './AddToken'
import HideToken from './HideToken'
import getStyles from './styles'

const ManageTokensSettingsScreen = () => {
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)
  const { styles } = useTheme(getStyles)

  useEffect(() => {
    setCurrentSettingsPage('manage-tokens')
  }, [setCurrentSettingsPage])

  return (
    <View style={[flexbox.directionRow, flexbox.flex1]}>
      <AddToken />
      <View style={styles.separator} />
      <HideToken />
    </View>
  )
}

export default ManageTokensSettingsScreen
