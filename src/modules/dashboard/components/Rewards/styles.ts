import { StyleSheet, ViewStyle } from 'react-native'

import { isWeb } from '@config/env'
import colors from '@modules/common/styles/colors'
import spacings, { SPACING_TY } from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

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
