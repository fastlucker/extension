import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import { getUiType } from '@web/utils/uiType'

interface Style {
  modalInner: ViewStyle
  image: ImageStyle
}

const { isTab } = getUiType()

export const COLLECTIBLE_IMAGE_SIZE = isTab ? 400 : 300

const getStyles = () =>
  StyleSheet.create<Style>({
    modalInner: {
      width: '100%',
      height: 'auto',
      borderRadius: BORDER_RADIUS_PRIMARY
    },
    image: {
      ...spacings.mbSm,
      width: COLLECTIBLE_IMAGE_SIZE,
      height: COLLECTIBLE_IMAGE_SIZE,
      borderRadius: BORDER_RADIUS_PRIMARY
    }
  })

export default getStyles
