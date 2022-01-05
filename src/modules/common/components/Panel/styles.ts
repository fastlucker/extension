import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Styles {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    color: colors.primaryAccentColor,
    paddingHorizontal: 30,
    paddingVertical: 25,
    backgroundColor: colors.panelBackgroundColor
  }
})

export default styles
