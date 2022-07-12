import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

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
    ...spacings.mbLg
  }
})

export default styles
