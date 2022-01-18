import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

interface Style {
  buttonContainer: ViewStyle
  buttonContainerPrimary: ViewStyle
  buttonContainerSecondary: ViewStyle
  buttonContainerDanger: ViewStyle
  buttonText: TextStyle
  buttonTextPrimary: TextStyle
  buttonTextSecondary: TextStyle
  buttonTextDanger: TextStyle
  disabled: ViewStyle
}

const styles = StyleSheet.create<Style>({
  buttonContainer: {
    width: '100%',
    height: 52,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...spacings.phSm,
    ...spacings.mbSm
  },
  buttonContainerPrimary: {
    backgroundColor: colors.primaryButtonContainerColor
  },
  buttonContainerSecondary: {
    backgroundColor: colors.secondaryButtonContainerColor
  },
  buttonContainerDanger: {
    backgroundColor: colors.dangerButtonContainerColor
  },
  buttonText: {
    textTransform: 'uppercase',
    ...textStyles.bold,
    fontSize: 17
  },
  buttonTextPrimary: {
    color: colors.primaryButtonTextColor
  },
  buttonTextSecondary: {
    color: colors.secondaryButtonTextColor
  },
  buttonTextDanger: {
    color: colors.dangerButtonTextColor
  },
  disabled: {
    opacity: 0.2
  }
})

export default styles
