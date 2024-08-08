import { StyleSheet, ViewStyle } from 'react-native'

import { BOTTOM_SHEET_Z_INDEX } from '@common/components/BottomSheet/styles'
import { SPACING_4XL, SPACING_MI, SPACING_TY, SPACING_XL } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

interface Style {
  container: ViewStyle
  pinExtensionIcon: ViewStyle
}

export const NEUTRAL_BACKGROUND = '#1418333D'
export const NEUTRAL_BACKGROUND_HOVERED = '#14183352'
export const DASHBOARD_OVERVIEW_BACKGROUND = '#353d6e'

const { isPopup } = getUiType()

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      backgroundColor: theme.primaryBackground
    },
    pinExtensionIcon: {
      // @ts-ignore
      position: 'absolute',
      right: isPopup ? -SPACING_XL - SPACING_MI : SPACING_4XL + SPACING_XL,
      top: SPACING_TY,
      zIndex: BOTTOM_SHEET_Z_INDEX
    }
  })

export default getStyles
