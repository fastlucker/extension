import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  warning: ViewStyle
  warningText: TextStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...spacings.phTy,
    ...spacings.pvTy,
    ...flexbox.directionRow,
    ...common.borderRadiusSecondary
  },
  warning: {
    backgroundColor: colors.pirateGold_08
  },
  warningText: {
    color: colors.brown
  }
})

export default styles
