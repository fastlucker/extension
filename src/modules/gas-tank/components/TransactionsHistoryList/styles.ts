import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

interface Style {
  tokenItemContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  tokenItemContainer: {
    backgroundColor: colors.howl,
    ...spacings.pvTy,
    ...spacings.phTy,
    ...spacings.mbTy,
    ...commonStyles.borderRadiusPrimary
  }
})

export default styles
