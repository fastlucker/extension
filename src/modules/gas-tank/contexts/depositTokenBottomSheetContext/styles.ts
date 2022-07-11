import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

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
