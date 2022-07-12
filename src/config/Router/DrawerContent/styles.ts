import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import { DEVICE_WIDTH } from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Style {
  menuItem: ViewStyle
  activeMenuItem: ViewStyle
}

const styles = StyleSheet.create<Style>({
  menuItem: {
    ...flexboxStyles.directionRow,
    ...flexboxStyles.alignCenter,
    height: 36,
    maxHeight: 36
  },
  activeMenuItem: {
    backgroundColor: colors.valhalla,
    position: 'absolute',
    height: 36,
    width: DEVICE_WIDTH,
    left: -40,
    zIndex: 0
  }
})

export default styles
