import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  active: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.flex1,
    ...flexbox.alignCenter,
    backgroundColor: colors.melrose_15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  active: {
    backgroundColor: colors.lightViolet,
    borderStyle: 'solid',
    borderColor: colors.violet
  }
})

export default styles
