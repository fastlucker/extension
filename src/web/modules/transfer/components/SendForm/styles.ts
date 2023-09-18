import { StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_LG } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  tokenSelect: ViewStyle
  recipientWrapper: ViewStyle
  sWAddressWarningCheckbox: ViewStyle
  button: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.flex1,
    ...spacings.pbLg,
    maxWidth: 500
  },
  tokenSelect: spacings.mbXl,
  recipientWrapper: spacings.mbXl,
  sWAddressWarningCheckbox: {
    ...spacings.mlTy,
    ...spacings.mbLg
  },
  button: {
    ...flexbox.alignSelfStart,
    width: 300,
    paddingHorizontal: SPACING_LG * 4
  }
})

export default styles
