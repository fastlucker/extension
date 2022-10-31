import { StyleSheet, ViewStyle } from 'react-native'

import { isWeb } from '@config/env'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Style {
  btnContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  btnContainer: {
    ...flexboxStyles.center,
    ...spacings.phTy,
    ...spacings.pvLg,
    ...commonStyles.borderRadiusPrimary,
    borderWidth: 1,
    borderColor: colors.waikawaGray,
    ...(isWeb ? { maxHeight: 68 } : {})
  }
})

export default styles
