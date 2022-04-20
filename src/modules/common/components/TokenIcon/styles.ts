import { StyleSheet, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import commonStyles from '@modules/common/styles/utils/common'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: colors.titan_05,
    overflow: 'hidden',
    ...commonStyles.borderRadiusPrimary,
    ...flexboxStyles.center
  }
})

export default styles
