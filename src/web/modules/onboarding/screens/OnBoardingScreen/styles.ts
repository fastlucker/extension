import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings, { SPACING_LG, SPACING_MD, SPACING_XL } from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  title: TextStyle
  wrapper: ViewStyle
  pinExtension: ViewStyle
  videoBackground: ViewStyle
  link: ViewStyle
}

const styles = StyleSheet.create<Style>({
  wrapper: {
    maxWidth: 480,
    height: '100%',
    justifyContent: 'space-between',
    ...spacings.ph
  },
  title: {
    textAlign: 'center',
    position: 'relative',
    marginBottom: SPACING_XL * 2
  },
  pinExtension: {
    // @ts-ignore-next-line web only property
    position: 'fixed',
    right: 110,
    top: -20,
    zIndex: 10
  },
  videoBackground: {
    backgroundColor: colors.melrose_15,
    width: 440,
    height: 300,
    marginBottom: SPACING_MD * 2,
    ...flexbox.alignCenter,
    ...flexbox.justifyCenter,
    ...commonStyles.borderRadiusPrimary
  },
  link: {
    marginBottom: SPACING_LG
  }
})

export default styles
