import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Style {
  btnContainer: ViewStyle
  img: ImageStyle
}

const styles = StyleSheet.create<Style>({
  btnContainer: {
    ...flexboxStyles.center,
    ...spacings.phTy,
    ...spacings.ptMd,
    ...spacings.pbLg,
    ...commonStyles.borderRadiusPrimary,
    borderWidth: 1,
    borderColor: colors.waikawaGray
  },
  img: {
    width: 40,
    height: 40,
    ...spacings.mbSm
  }
})

export default styles
