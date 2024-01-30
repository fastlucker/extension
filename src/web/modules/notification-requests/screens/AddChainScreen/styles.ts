import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  accountInfo: ViewStyle
  accountInfoText: TextStyle
  accountAddressAndLabel: ViewStyle
}

const styles = StyleSheet.create<Style>({
  accountInfo: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter
  },
  accountInfoText: {
    ...spacings.mlMi
  },
  accountAddressAndLabel: {
    ...flexbox.directionRow,
    ...flexbox.alignEnd
  }
})

export default styles
