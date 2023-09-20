import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  textarea: ViewStyle
  searchSection: ViewStyle
}

const styles = StyleSheet.create<Style>({
  textarea: {
    flex: 1,
    color: colors.martinique,
    ...spacings.plMi,
    width: '100%' // Fixes the icon being invisible on Linux
  },
  searchSection: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 12,
    backgroundColor: colors.melrose_15,
    borderColor: colors.scampi_20,
    color: colors.martinique,
    width: 200,
    alignSelf: 'flex-start',
    ...flexbox.directionRow,
    ...flexbox.justifyCenter,
    ...flexbox.alignCenter
  }
})

export default styles
