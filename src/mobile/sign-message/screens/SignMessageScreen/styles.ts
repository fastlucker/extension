import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

interface Style {
  image: ImageStyle
  textarea: ViewStyle
}

const styles = StyleSheet.create<Style>({
  image: {
    ...spacings.mrTy,
    width: 22,
    height: 22
  },
  textarea: {
    minHeight: 120,
    flex: 1,
    backgroundColor: colors.mirage,
    ...commonStyles.borderRadiusPrimary,
    ...spacings.ph,
    ...spacings.pv,
    ...spacings.mbMd
  }
})

export default styles
