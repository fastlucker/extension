import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  container: ViewStyle
  checkbox: ViewStyle
  label: TextStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    ...spacings.mb
  },
  checkbox: {
    borderWidth: 3,
    width: 25,
    height: 25,
    borderColor: colors.checkboxBorderColor,
    ...spacings.mrTy
  },
  label: {
    fontSize: 16
  }
})

export default styles
