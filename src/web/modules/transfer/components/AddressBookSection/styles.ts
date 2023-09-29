import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

interface Style {
  title: TextStyle
  button: ViewStyle
  buttonText: TextStyle
}

const styles = StyleSheet.create<Style>({
  title: spacings.mbSm,
  button: {
    borderColor: colors.violet,
    width: 300
  },
  buttonText: {
    color: colors.violet
  }
})

export default styles
