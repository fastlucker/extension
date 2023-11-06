import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  title: TextStyle
  wrapper: ViewStyle
  pinExtension: ViewStyle
  videoBackground: ViewStyle
}

const styles = StyleSheet.create<Style>({
  wrapper: {
    maxWidth: 480,
    height: '100%',
    ...spacings.pl4Xl
  },
  title: {
    textAlign: 'center',
    position: 'relative',
    ...spacings.mt,
    ...spacings.mb4Xl
  },
  pinExtension: {
    // @ts-ignore-next-line web only property
    position: 'fixed',
    right: 50,
    top: -10,
    zIndex: 10
  },
  videoBackground: {
    backgroundColor: colors.melrose_15,
    width: 440,
    height: 300,
    ...spacings.mb4Xl,
    ...flexbox.alignCenter,
    ...flexbox.justifyCenter,
    ...commonStyles.borderRadiusPrimary
  }
})

export default styles
