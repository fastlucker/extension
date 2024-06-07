import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

// import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import { getUiType } from '@web/utils/uiType'

interface Style {
  container: ViewStyle
  image: ImageStyle
}

const isTab = getUiType().isTab
export const COLLECTIBLE_SIZE = isTab ? 96 : 64

const styles = StyleSheet.create<Style>({
  container: {
    position: 'relative',
    borderRadius: BORDER_RADIUS_PRIMARY,
    overflow: 'hidden'
    // ...(isTab ? spacings.mrLg : spacings.mrSm),
    // ...(isTab ? spacings.mbSm : spacings.mbTy)
  },
  image: {
    borderRadius: BORDER_RADIUS_PRIMARY,
    backgroundColor: 'transparent'
  }
})

export default styles
