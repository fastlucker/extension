import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings, { SPACING_MI, SPACING_SM } from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  showQueueButton: ViewStyle
  textarea: ViewStyle
  buttonsContainer: ViewStyle
  buttonWrapper: ViewStyle
  accountInfo: ViewStyle
  accountInfoIcon: ImageStyle
  accountInfoText: TextStyle
  accountAddressAndLabel: ViewStyle
}

const styles = StyleSheet.create<Style>({
  showQueueButton: {
    position: 'absolute',
    right: SPACING_SM,
    top: SPACING_SM,
    borderRadius: 50,
    padding: 3,
    backgroundColor: colors.wooed
  },
  textarea: {
    minHeight: 120,
    flex: 1,
    backgroundColor: colors.mirage,
    ...common.borderRadiusPrimary,
    ...spacings.ph,
    ...spacings.pv,
    ...spacings.mbLg
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: -SPACING_MI,
    ...spacings.mbTy
  },
  buttonWrapper: {
    marginHorizontal: SPACING_MI,
    flex: 1
  },
  accountInfo: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter
  },
  accountInfoIcon: {
    width: 32,
    height: 32,
    ...common.borderRadiusPrimary
  },
  accountInfoText: {
    ...spacings.mlMi
  },
  accountAddressAndLabel: {
    ...flexbox.directionRow,
    ...flexbox.alignEnd,
    ...spacings.mlTy
  }
})

export default styles
