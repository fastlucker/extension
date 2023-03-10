import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

interface Style {
  tokenItemContainer: ViewStyle
  tokenSymbol: TextStyle
  depositButton: ViewStyle
  depositButtonText: TextStyle
}

const styles = StyleSheet.create<Style>({
  tokenItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.howl,
    ...spacings.pvTy,
    ...spacings.phTy,
    ...spacings.mbMi,
    ...commonStyles.borderRadiusPrimary,
    maxHeight: 50
  },
  tokenSymbol: {
    width: '30%'
  },
  depositButton: {
    minHeight: 34,
    borderWidth: 1,
    borderColor: colors.heliotrope,
    borderRadius: 10
  },
  depositButtonText: {
    fontSize: 12,
    color: colors.heliotrope
  }
})

export default styles
