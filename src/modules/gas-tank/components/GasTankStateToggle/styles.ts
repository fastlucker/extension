import { StyleSheet, ViewProps } from 'react-native'

import colors from '@common/styles/colors'
import commonStyles from '@common/styles/utils/common'

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
