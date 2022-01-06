import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Styles {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    color: colors.primaryAccentColor,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 15,
    backgroundColor: colors.panelBackgroundColor
  }
})

export default styles
