import { StyleSheet, ViewStyle } from 'react-native'

import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/BenzinScreen/styles'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  logoWrapper: ViewStyle
  estimate: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    logoWrapper: {
      ...flexbox.alignCenter,
      ...(IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mbXl : {})
    },
    estimate: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      ...spacings.mbXl
    }
  })

export default getStyles
