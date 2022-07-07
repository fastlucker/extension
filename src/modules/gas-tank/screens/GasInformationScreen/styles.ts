import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  gasSpeedContainer: ViewStyle
  speedItem: ViewStyle
  tableHeadingContainer: ViewStyle
  tableRowContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  gasSpeedContainer: {
    flexDirection: 'row',
    ...spacings.mbMd,
    marginHorizontal: -2.5
  },
  speedItem: {
    ...spacings.phMi,
    minHeight: 80,
    flex: 1,
    marginHorizontal: 2.5,
    overflow: 'hidden',
    backgroundColor: colors.martinique,
    borderWidth: 2,
    borderColor: colors.martinique,
    alignItems: 'center',
    justifyContent: 'center',
    ...commonStyles.borderRadiusPrimary
  },
  tableHeadingContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.waikawaGray,
    ...spacings.pvMi
  },
  tableRowContainer: {
    flexDirection: 'row',
    ...spacings.pvMi
  }
})

export default styles
