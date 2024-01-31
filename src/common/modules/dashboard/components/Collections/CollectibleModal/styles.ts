import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import { getUiType } from '@web/utils/uiType'

interface Style {
  modal: ViewStyle
  image: ImageStyle
}

const { isTab } = getUiType()

const getStyles = () =>
  StyleSheet.create<Style>({
    modal: {
      ...spacings.phSm,
      ...spacings.pvSm,
      minWidth: isTab ? 420 : 324,
      height: 'auto',
      borderRadius: BORDER_RADIUS_PRIMARY
    },
    image: {
      ...spacings.mbSm,
      width: '100%',
      height: isTab ? 400 : 300,
      borderRadius: BORDER_RADIUS_PRIMARY
    }
  })

export default getStyles
