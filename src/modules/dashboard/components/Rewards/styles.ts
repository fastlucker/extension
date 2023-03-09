import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings, { SPACING_TY } from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'
import { isWeb } from '@config/env'

interface Style {
  rewardFlag: ViewStyle
  tableContainer: ViewStyle
  tableRow: ViewStyle
  tableRowBorder: ViewStyle
  tableRowValue: ViewStyle
}

const styles = StyleSheet.create<Style>({
  rewardFlag: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1
  },
  tableContainer: {
    marginHorizontal: isWeb ? 0 : -1 * SPACING_TY,
    backgroundColor: colors.valhalla,
    ...commonStyles.borderRadiusPrimary,
    ...spacings.ph,
    ...spacings.pvTy
  },
  tableRow: {
    ...spacings.pvSm
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderColor: colors.waikawaGray
  },
  tableRowValue: {
    width: 160
  }
})

export default styles
