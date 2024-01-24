import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  derivationButton: ViewStyle
  derivationButtonRightIcon: ViewStyle
  derivationButtonInfo: ViewStyle
  derivationButtonInfoIcon: ImageStyle
  derivationButtonInfoText: TextStyle
}

const styles = StyleSheet.create<Styles>({
  derivationButton: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter,
    ...flexbox.alignSelfEnd,
    ...flexbox.justifySpaceBetween,
    height: 40,
    ...spacings.phTy,
    backgroundColor: colors.melrose_15,
    borderWidth: 1,
    borderColor: colors.scampi_20,
    ...common.borderRadiusPrimary,
    minWidth: 200
  },
  derivationButtonRightIcon: {
    borderColor: 'transparent',
    borderRadius: 8
  },
  derivationButtonInfo: {
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween,
    ...spacings.mrMi
  },
  derivationButtonInfoIcon: {
    width: 25,
    height: 25,
    borderRadius: 10
  },
  derivationButtonInfoText: {
    ...spacings.mlMi
  }
})

export default styles
