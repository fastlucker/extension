import { StyleSheet, ViewProps } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Style {
  appLockingItemContainer: ViewProps
}

const styles = StyleSheet.create<Style>({
  appLockingItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.valhalla
  }
})

export default styles
