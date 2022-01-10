import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Style {
  container: ViewStyle
  toast: ViewStyle
  text1: TextStyle
  trailingIcon: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    paddingHorizontal: 10
  },
  toast: {
    backgroundColor: colors.primaryAccentColor,
    borderLeftWidth: 0,
    alignItems: 'center',
    paddingVertical: 10,
    height: 'auto',
    width: Dimensions.get('window').width
  },
  text1: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryButtonColor,
    paddingLeft: 0
  },
  trailingIcon: {
    paddingRight: 10
  }
})

export default styles
