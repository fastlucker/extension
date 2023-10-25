import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  greenLabel: ViewStyle
  greyLabel: ViewStyle
  blueLabel: ViewStyle
}

const label: ViewStyle = {
  height: 18,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 8,
  borderWidth: 1,
  borderRadius: 50
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
    ...label,
    borderColor: colors.greenHaze,
    backgroundColor: colors.turquoise_20,
    marginLeft: 4
  },
  greyLabel: {
    ...label,
    borderColor: '#E9AD03',
    backgroundColor: '#FFBC0038'
  },
  blueLabel: {
    ...label,
    borderColor: colors.dodgerBlue,
    backgroundColor: 'transparent'
  }
})

export default styles
