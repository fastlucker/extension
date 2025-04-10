import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/BenzinScreen/styles'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { isExtension } from '@web/constants/browserapi'

interface Style {
  buttons: ViewStyle
  openExplorer: ViewStyle
  openExplorerText: TextStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    buttons: {
      ...(IS_MOBILE_UP_BENZIN_BREAKPOINT
        ? flexbox.directionRow
        : { flexDirection: 'column-reverse' }),
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      ...(IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mbXl : spacings.mbMd)
    },
    openExplorer: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...(!IS_MOBILE_UP_BENZIN_BREAKPOINT && !isExtension ? spacings.mbXl : {})
    },
    openExplorerText: {
      ...spacings.mlSm,
      textDecorationLine: 'underline'
    }
  })

export default getStyles
