import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Style {
  wrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  wrapper: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: 10,
    paddingVertical: 15
  }
})

export default styles
