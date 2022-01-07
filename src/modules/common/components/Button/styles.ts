import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  button: ViewStyle
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
  buttonText: {
    color: colors.primaryButtonColor,
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 17
  }
})

export default styles
