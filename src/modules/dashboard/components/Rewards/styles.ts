import { StyleSheet, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings, { SPACING_TY } from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  tableContainer: ViewStyle
  tableRow: ViewStyle
  tableRowBorder: ViewStyle
  tableRowValue: ViewStyle
}

const styles = StyleSheet.create<Style>({
  tableContainer: {
    marginHorizontal: -1 * SPACING_TY,
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
