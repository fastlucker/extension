import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  panel: ViewStyle
  topUpPanel: ViewStyle
  container: ViewStyle
  separator: ViewStyle
  spinnerContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  panel: {
    alignItems: 'center',
    maxHeight: '100%',
    paddingVertical: 0
  },
  topUpPanel: {
    alignItems: 'flex-start'
  },
  container: {
    ...flexbox.directionRow,
    ...flexbox.flex1,
    width: '100%'
  },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: colors.scampi_20
  },
  spinnerContainer: {
    ...flexbox.center,
    ...flexbox.flex1
  }
})

export default styles
