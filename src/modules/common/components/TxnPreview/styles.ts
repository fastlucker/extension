import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  container: ViewStyle
  listItem: ViewStyle
  expandedContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...spacings.mbTy,
    backgroundColor: colors.howl,
    ...commonStyles.borderRadiusPrimary
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.howl,
    ...commonStyles.borderRadiusPrimary,
    ...spacings.phTy,
    ...spacings.pvTy
  },
  expandedContainer: {
    opacity: 0.5,
    ...spacings.phTy,
    ...spacings.pbTy,
    backgroundColor: 'transparent'
  }
})

export default styles
