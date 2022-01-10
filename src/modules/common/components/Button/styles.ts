import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

interface Style {
  button: ViewStyle
  disabled: ViewStyle
  buttonText: TextStyle
}

const styles = StyleSheet.create<Style>({
  button: {
    width: '100%',
    height: 52,
    borderRadius: 2,
    backgroundColor: colors.primaryAccentColor,
    justifyContent: 'center',
    alignItems: 'center',
    ...spacings.phSm,
    ...spacings.mbSm
  },
  disabled: {
    opacity: 0.2
  },
  buttonText: {
    color: colors.primaryButtonColor,
    textTransform: 'uppercase',
    ...textStyles.bold,
    fontSize: 17
  }
})

export default styles
