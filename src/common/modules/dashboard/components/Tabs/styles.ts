import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  tabItemText: TextStyle
  toggleItem: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: flexbox.directionRow,
  tabItemText: spacings.mbTy,
  toggleItem: {
    borderBottomWidth: 2,
    width: 130,
    ...flexbox.alignCenter
  }
})

export default styles
