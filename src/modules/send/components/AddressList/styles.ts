import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  formTitleWrapper: ViewStyle
  addressItem: ViewStyle
}

const styles = StyleSheet.create<Style>({
  formTitleWrapper: {
    alignItems: 'center'
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.howl,
    ...commonStyles.borderRadiusPrimary,
    ...spacings.phTy,
    ...spacings.pvTy
  }
})

export default styles
