import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  container: ViewStyle
  img: ImageStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    width: 34,
    height: 34,
    backgroundColor: colors.titan_05,
    overflow: 'hidden',
    ...commonStyles.borderRadiusPrimary
  },
  img: {
    width: 34,
    height: 34
  }
})

export default styles
