import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'

interface Style {
  separator: ViewStyle
}

const styles = StyleSheet.create<Style>({
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: colors.scampi_20,
    marginHorizontal: 40
  }
})

export default styles
