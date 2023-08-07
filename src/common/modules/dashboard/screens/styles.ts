import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: colors.white,
    ...flexbox.flex1
  }
})

export default styles
