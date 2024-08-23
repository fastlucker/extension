import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  selectWrapper: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      position: 'absolute',
      width: 252,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderWidth: 1,
      borderBottomWidth: 0,
      ...flexbox.alignSelfCenter,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter,
      ...spacings.phSm,
      shadowOffset: { width: 0, height: -4 },
      shadowRadius: 10,
      // @ts-ignore
      cursor: 'default'
    },
    selectWrapper: {
      borderTopWidth: 1,
      borderTopColor: theme.secondaryBorder,
      ...spacings.pvTy,
      ...common.fullWidth,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter
    }
  })

export default getStyles
