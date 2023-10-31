import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  separator: ViewStyle
  spinnerContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: { ...flexbox.directionRow, ...spacings.pv },
  separator: { width: 1, height: '100%', backgroundColor: colors.scampi_20, marginHorizontal: 30 },
  spinnerContainer: {
    ...flexbox.center,
    ...flexbox.flex1
  }
})

export default styles
