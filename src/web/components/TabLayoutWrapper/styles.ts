import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  contentContainer: ViewStyle
  sideContentContainer: ViewStyle
  informationCircle: ViewStyle
  footerContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    contentContainer: {
      height: '100%',
      ...spacings.pbLg,
      ...spacings.ph0,
      ...flexbox.flex1
    },
    sideContentContainer: {
      ...spacings.ph0,
      ...spacings.ptMd,
      ...spacings.plXl,
      maxWidth: 582,
      minWidth: 392,
      width: '30%',
      overflow: 'hidden'
    },
    informationCircle: {
      alignSelf: 'center',
      ...spacings.pbLg
    },
    footerContainer: {
      maxHeight: 128,
      flex: 1,
      ...spacings.ph3Xl,
      backgroundColor: theme.primaryBackground
    }
  })

export default getStyles
