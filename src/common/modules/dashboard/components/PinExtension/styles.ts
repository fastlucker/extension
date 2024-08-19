import { StyleSheet, ViewStyle } from 'react-native'

import { BOTTOM_SHEET_Z_INDEX } from '@common/components/BottomSheet/styles'
import { SPACING_4XL, SPACING_MI, SPACING_TY, SPACING_XL } from '@common/styles/spacings'
import { getUiType } from '@web/utils/uiType'

interface Style {
  pinExtensionIcon: ViewStyle
  closeIcon: ViewStyle
}

const { isPopup } = getUiType()

const getStyles = () =>
  StyleSheet.create<Style>({
    pinExtensionIcon: {
      position: 'absolute',
      right: isPopup ? -SPACING_XL - SPACING_MI : SPACING_4XL + SPACING_XL,
      top: SPACING_TY,
      zIndex: BOTTOM_SHEET_Z_INDEX
    },
    closeIcon: {
      position: 'absolute',
      zIndex: 2,
      right: 68,
      top: 24
    }
  })

export default getStyles
