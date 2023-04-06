import { StyleSheet, ViewStyle } from 'react-native'

import { isiOS } from '@common/config/env'
import colors from '@common/styles/colors'
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@common/styles/spacings'

interface Style {
  container: ViewStyle
  blur: ViewStyle
}

const containerBackground = !isiOS ? { backgroundColor: colors.valhalla_95 } : {}

const styles = StyleSheet.create<Style>({
  container: {
    ...containerBackground,
    position: 'absolute',
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    zIndex: 990,
    elevation: 15
  },
  blur: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    backgroundColor: colors.valhalla_66,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default styles
