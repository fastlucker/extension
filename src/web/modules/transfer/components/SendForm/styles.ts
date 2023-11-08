import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  tokenSelect: ViewStyle
  recipientWrapper: ViewStyle
  sWAddressWarningCheckbox: ViewStyle
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
  }
})

export default styles
