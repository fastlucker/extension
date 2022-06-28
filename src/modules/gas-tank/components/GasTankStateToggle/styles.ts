import { StyleSheet, ViewProps } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  toggleWrapper: ViewProps
}

const styles = StyleSheet.create<Style>({
  toggleWrapper: {
    flexDirection: 'row',
    ...commonStyles.borderRadiusPrimary,
    backgroundColor: colors.valhalla,
    ...spacings.mbTy
  }
})

export default styles
