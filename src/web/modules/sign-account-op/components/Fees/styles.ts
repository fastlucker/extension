import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'
import spacings, { SPACING_MD, SPACING_SM, SPACING_XL } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

interface Style {
  tokenSelect: ViewStyle
  tokenSelectLabel: ViewStyle
  transactionSpeedContainer: ViewStyle
  transactionSpeedLabel: TextStyle
  feesContainer: ViewStyle
  feeContainer: ViewStyle
  fee: TextStyle
  feeUsd: TextStyle
  gasTankContainer: ViewStyle
  gasTankText: TextStyle
  // @TODO - once we update react-native to 0.71, then we will have `gap` support and can remove this helper class
  mr10: {}
}

const isTab = getUiType().isTab

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    tokenSelect: {
      marginBottom: isTab ? SPACING_MD : SPACING_SM
    },
    tokenSelectLabel: {
      fontSize: 16,
      fontFamily: FONT_FAMILIES.MEDIUM,
      ...spacings.mlSm
    },
    transactionSpeedContainer: {
      marginBottom: isTab ? SPACING_XL : SPACING_SM
    },
    transactionSpeedLabel: {
      fontSize: 16,
      fontFamily: FONT_FAMILIES.MEDIUM,
      ...spacings.mlSm,
      ...spacings.mbTy
    },
    feesContainer: {
      ...flexbox.directionRow
    },
    feeContainer: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween
    },
    fee: {
      fontFamily: FONT_FAMILIES.MEDIUM,
      fontSize: 16
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
      color: theme.successText,
      fontSize: isTab ? 14 : 12
    },
    mr10: spacings.mrTy
  })

export default getStyles
