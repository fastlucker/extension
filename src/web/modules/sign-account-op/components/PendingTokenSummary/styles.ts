import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: colors.melrose_15,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.chetwode_50,
    ...flexbox.directionRow,
    ...spacings.phTy,
    ...spacings.pvMi,
    ...spacings.mbTy
  }
})

export default styles
