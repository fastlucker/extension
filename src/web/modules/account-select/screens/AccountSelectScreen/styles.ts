import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'

interface Style {
  container: ViewStyle
  accountContainer: ViewStyle
  greenLabel: ViewStyle
  searchBar: ViewStyle
  greyLabel: ViewStyle
  blueLabel: ViewStyle
}

const label: ViewStyle = {
  height: 18,
  alignItems: 'center',
  justifyContent: 'center',
  ...spacings.phTy,
  borderWidth: 1,
  borderRadius: 50
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...commonWebStyles.contentContainer,
      ...spacings.pv0,
      ...spacings.ph0
    },
    accountContainer: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...spacings.phTy,
      ...spacings.pvMi,
      ...spacings.mbTy,
      ...spacings.pr,
      borderWidth: 1,
      ...common.borderRadiusPrimary
    },
    searchBar: {
      ...spacings.pvSm,
      width: '100%'
    },
    greenLabel: {
      ...label,
      borderColor: theme.successDecorative,
      backgroundColor: theme.successBackground,
      marginLeft: 4
    },
    greyLabel: {
      ...label,
      borderColor: '#E9AD03',
      backgroundColor: '#FFBC0038'
    },
    blueLabel: {
      ...label,
      borderColor: colors.dodgerBlue,
      backgroundColor: 'transparent'
    }
  })

export default getStyles
