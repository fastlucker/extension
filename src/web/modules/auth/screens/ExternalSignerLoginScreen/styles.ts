import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  textarea: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: { minWidth: 500, ...flexbox.alignSelfCenter },
  textarea: {
    padding: 10,
    backgroundColor: colors.melrose_15,
    borderColor: colors.scampi_20,
    color: colors.martinique,
    borderWidth: 1,
    borderRadius: 12,
    ...spacings.mbLg
  }
})

export default styles
