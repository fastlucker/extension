import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

interface Style {
  itemContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.howl,
    ...commonStyles.borderRadiusPrimary,
    ...spacings.phTy,
    ...spacings.pvTy,
    ...spacings.mbMi
  }
})

export default styles
