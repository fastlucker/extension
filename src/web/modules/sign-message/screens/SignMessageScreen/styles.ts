import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  buttonsContainer: ViewStyle
  rejectButton: ViewStyle
  rejectButtonText: TextStyle
  signButton: ViewStyle
}

const styles = StyleSheet.create<Style>({
  buttonsContainer: {
    ...flexbox.flex1,
    ...flexbox.alignCenter,
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween
  },
  rejectButton: { width: 130, height: 56, ...spacings.mb0 },
  rejectButtonText: spacings.mrSm,
  signButton: { width: 162, height: 56, ...spacings.mb0 }
})

export default styles
