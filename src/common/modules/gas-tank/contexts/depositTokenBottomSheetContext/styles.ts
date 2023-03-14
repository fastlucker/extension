import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

interface Style {
  tokenContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.howl,
    ...spacings.pvTy,
    ...spacings.phTy,
    ...spacings.mb,
    ...commonStyles.borderRadiusPrimary,
    maxHeight: 50
  }
})

export default styles
