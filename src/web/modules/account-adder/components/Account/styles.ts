import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  greenLabel: ViewStyle
  greyLabel: ViewStyle
  networkIcon: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter,
    ...spacings.phSm,
    ...spacings.pvSm,
    ...common.borderRadiusPrimary,
    backgroundColor: colors.melrose_15,
    borderColor: colors.scampi_20,
    width: 504,
    height: 76,
    flex: 1
  },
  greenLabel: {
    height: 24,
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
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.martinique_80,
    borderRadius: 50,
    backgroundColor: colors.martinique_20
  },
  networkIcon: {
    borderRadius: 50,
    backgroundColor: colors.white,
    borderColor: colors.quartz,
    borderWidth: 2
  }
})

export default styles
