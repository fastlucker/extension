import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

interface Style {
  selectedFee: ViewStyle
  feeUsd: TextStyle
  gasTankContainer: ViewStyle
  gasTankText: TextStyle
}

const isTab = getUiType().isTab

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    selectedFee: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.primary
    },
    feeUsd: {
      color: theme.primary,
      fontSize: isTab ? 16 : 14
    },
    gasTankContainer: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween
    },
    gasTankText: {
      color: colors.greenHaze,
      fontSize: isTab ? 14 : 12
    }
  })

export default getStyles
