import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

interface Style {
  tokenItemContainer: ViewStyle
  tokenValue: ViewStyle
  sendContainer: ViewStyle
  emptyStateContainer: TextStyle
  emptyStateText: TextStyle
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
    width: 34,
    height: 34,
    ...flexboxStyles.center,
    ...commonStyles.borderRadiusPrimary
  },
  emptyStateContainer: {
    ...spacings.ptSm,
    ...spacings.phSm
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
    ...textStyles.bold,
    ...spacings.mbSm
  }
})

export default styles
