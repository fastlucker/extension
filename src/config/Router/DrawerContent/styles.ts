import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings, { DEVICE_WIDTH } from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

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
    height: 36,
    maxHeight: 36
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
