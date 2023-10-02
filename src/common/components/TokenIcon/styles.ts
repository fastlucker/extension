import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: colors.titan_05,
    overflow: 'hidden',
    ...common.borderRadiusPrimary,
    ...flexbox.center
  }
})

export default styles
