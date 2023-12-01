import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings, { DEVICE_WIDTH } from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'
import flexboxStyles from '@common/styles/utils/flexbox'

interface Style {
  menuItem: ViewStyle
  activeMenuItem: ViewStyle
  quickActionsContainer: ViewStyle
  lockBtn: ViewStyle
}

const styles = StyleSheet.create<Style>({
  menuItem: {
    ...flexboxStyles.directionRow,
    ...flexboxStyles.alignCenter,
    ...spacings.pv,
    ...spacings.ph
  },
  activeMenuItem: {
    backgroundColor: colors.valhalla,
    position: 'absolute',
    height: 36,
    width: DEVICE_WIDTH,
    left: -40,
    zIndex: -1
  },
  quickActionsContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.martinique,
    ...spacings.pvTy,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  lockBtn: {
    ...commonStyles.borderRadiusPrimary,
    borderWidth: 2,
    borderColor: colors.chetwode,
    alignItems: 'center',
    justifyContent: 'center',
    ...spacings.prTy,
    ...spacings.plMi,
    paddingVertical: 1
  }
})

export default styles
