import { StyleSheet, ViewStyle } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'

interface Style {
  buttonsContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  buttonsContainer: {
    ...flexbox.flex1,
    ...flexbox.alignCenter,
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween
  }
})

export default styles
