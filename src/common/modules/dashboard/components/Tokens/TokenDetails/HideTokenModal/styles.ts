import { StyleSheet, ViewStyle } from 'react-native'

import { SPACING, SPACING_XL } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import { BORDER_RADIUS_PRIMARY, BORDER_RADIUS_SECONDARY } from '@common/styles/utils/common'

interface Style {
  modal: ViewStyle
  button: ViewStyle
  cancelButton: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    modal: {
      backgroundColor: theme.secondaryBackground,
      borderRadius: BORDER_RADIUS_SECONDARY,
      paddingTop: SPACING_XL,
      paddingHorizontal: SPACING,
      paddingBottom: SPACING
    },
    button: {
      borderRadius: BORDER_RADIUS_PRIMARY,
      paddingVertical: SPACING,
      paddingHorizontal: SPACING_XL
    },
    cancelButton: {
      borderWidth: 1,
      borderColor: theme.primary
    }
  })

export default getStyles
