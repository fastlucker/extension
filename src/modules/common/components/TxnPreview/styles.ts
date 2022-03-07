import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  container: ViewStyle
  listItem: ViewStyle
  expandedContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: colors.inputBackgroundColor,
    ...spacings.mbTy
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.listEvenColor,
    ...spacings.phSm,
    ...spacings.pvSm
  },
  expandedContainer: {
    opacity: 0.7,
    ...spacings.phSm,
    ...spacings.pvSm,
    backgroundColor: 'transparent'
  }
})

export default styles
