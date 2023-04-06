import { ImageProps, StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

interface Styles {
  itemContainer: ViewStyle
  itemIcon: ImageProps
}

const styles = StyleSheet.create<Styles>({
  itemContainer: {
    backgroundColor: colors.howl,
    ...commonStyles.borderRadiusPrimary,
    ...spacings.phTy,
    ...spacings.pvTy,
    ...spacings.mbTy
  },
  itemIcon: {
    width: 34,
    height: 34,
    ...commonStyles.borderRadiusPrimary,
    ...spacings.mrTy
  }
})

export default styles
