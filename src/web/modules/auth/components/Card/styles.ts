import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: 296,
    backgroundColor: colors.melrose_15,
    borderWidth: 1,
    ...flexbox.alignCenter,
    borderColor: colors.scampi_20,
    borderRadius: 12,
    ...spacings.phSm,
    ...spacings.pvSm
  },
  text: {
    textAlign: 'center'
  }
})

export default styles
