import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  accountInfo: ViewStyle
  accountInfoIcon: ImageStyle
  accountInfoText: TextStyle
  accountAddressAndLabel: ViewStyle
}

const styles = StyleSheet.create<Style>({
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
