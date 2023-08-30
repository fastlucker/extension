import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'

interface Style {
  textarea: ViewStyle
}

const styles = StyleSheet.create<Style>({
  textarea: {
    padding: 10,
    backgroundColor: colors.melrose_15,
    borderColor: colors.scampi_20,
    color: colors.martinique,
    borderWidth: 1,
    borderRadius: 12
  }
})

export default styles
