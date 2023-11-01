import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

interface Style {
  selectedFee: ViewStyle
  feeUsd: TextStyle
  gasTankContainer: ViewStyle
  gasTankText: TextStyle
  finalFeeValueContainer: ViewStyle
  finalFeeValueWrapper: ViewStyle
}

const isTab = getUiType().isTab

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    selectedFee: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.violet
    },
    feeUsd: {
      color: colors.violet,
      fontSize: isTab ? 16 : 14
    },
    gasTankContainer: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween
    },
    gasTankText: {
      color: colors.greenHaze,
      fontSize: isTab ? 14 : 12
    },
    finalFeeValueContainer: {
      borderWidth: 3,
      borderColor: '#6000FF4D',
      borderRadius: 9,
      ...spacings.mhTy
    },
    finalFeeValueWrapper: {
      ...spacings.pvMi,
      ...spacings.phMi,
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      borderColor: theme.primary
    }
  })

export default getStyles
