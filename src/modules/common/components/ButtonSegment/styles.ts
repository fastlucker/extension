import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  buttonContainer: ViewStyle
  active: ViewStyle
  buttonText: TextStyle
}

const styles = StyleSheet.create<Style>({
  buttonContainer: {
    height: 38,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    ...spacings.phTy
  },
  buttonText: {
    fontSize: 14,
    textTransform: 'uppercase'
  },
  active: {
    borderColor: colors.primaryAccentColor
  }
})

export default styles
