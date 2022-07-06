import { StyleSheet, ViewProps } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  toggleWrapper: ViewProps
}

const styles = StyleSheet.create<Style>({
  toggleWrapper: {
    flexDirection: 'row',
    ...commonStyles.borderRadiusPrimary,
    backgroundColor: colors.valhalla
  }
})

export default styles
