import { StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_MI } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  network: ViewStyle
  highlightedNetwork: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    network: {
      ...flexbox.alignCenter,
      ...flexbox.justifySpaceBetween,
      ...flexbox.directionRow,
      ...spacings.phTy,
      ...spacings.pvTy,
      marginBottom: SPACING_MI / 2,
      borderRadius: BORDER_RADIUS_PRIMARY,
      borderWidth: 1,
      borderColor: 'transparent'
    },
    highlightedNetwork: {
      backgroundColor: theme.secondaryBackground,
      borderColor: theme.secondaryBorder
    }
  })

export default getStyles
