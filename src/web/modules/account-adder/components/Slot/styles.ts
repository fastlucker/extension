import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'

interface Style {
  container: ViewStyle
  slotLabelWrapper: ViewStyle
  slotLabel: TextStyle
  itemsContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...spacings.mbTy,
      alignItems: 'center',
      width: '100%',
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      borderColor: theme.secondaryDecorative,
      overflow: 'hidden',
      backgroundColor: theme.secondaryBackground
    },
    slotLabelWrapper: {
      height: '100%',
      width: 40,
      maxWidth: 40,
      flex: 1,
      ...flexbox.alignCenter,
      ...flexbox.justifyCenter
    },
    slotLabel: {
      ...text.center,
      transform: [{ rotate: '-90deg' }],
      width: 200,
      color: theme.secondaryDecorative
    },
    itemsContainer: {
      ...flexbox.flex1,
      ...common.borderRadiusPrimary,
      backgroundColor: theme.primaryBackground,
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      ...spacings.phSm
    }
  })

export default getStyles
