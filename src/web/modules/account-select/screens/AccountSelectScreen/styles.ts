import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  greenLabel: ViewStyle
  greyLabel: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween,
    ...spacings.phMi,
    ...spacings.pvMi,
    ...spacings.mbTy,
    ...spacings.pr,
    borderWidth: 1,
    borderRadius: 12
  },
  greenLabel: {
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.greenHaze,
    borderRadius: 50,
    backgroundColor: colors.turquoise_20,
    marginLeft: 4
  },
  greyLabel: {
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E9AD03',
    borderRadius: 50,
    backgroundColor: '#FFBC0038'
  }
})

export default styles
