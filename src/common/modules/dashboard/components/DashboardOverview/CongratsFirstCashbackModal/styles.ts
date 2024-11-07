import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  contentContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    container: {
      position: 'absolute',
      width: 324,
      height: 444,
      backgroundColor: theme.primaryBackground,
      ...flexbox.alignCenter,
      ...common.borderRadiusPrimary,
      shadowColor: '#14183333',
      shadowOpacity: 1,
      shadowOffset: {
        width: 0,
        height: 8
      },
      shadowRadius: 16,
      marginHorizontal: 'auto',
      overflow: 'hidden',
      zIndex: 100,
      ...spacings.phMd,
      ...spacings.pvMd
    },
    contentContainer: {
      backgroundColor: theme.primaryBackground,
      ...flexbox.flex1
    }
  })

export default getStyles
