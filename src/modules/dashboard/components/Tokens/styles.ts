import { StyleSheet, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Style {
  tokenItemContainer: ViewStyle
  tokenValue: ViewStyle
  sendContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  tokenItemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.howl,
    ...spacings.pv,
    ...spacings.phSm,
    ...spacings.mbTy,
    ...commonStyles.borderRadiusPrimary
  },
  tokenValue: {
    flex: 1,
    alignItems: 'flex-end'
  },
  sendContainer: {
    backgroundColor: colors.titan_05,
    width: 36,
    height: 36,
    ...flexboxStyles.center,
    ...commonStyles.borderRadiusPrimary
  }
})

export default styles
