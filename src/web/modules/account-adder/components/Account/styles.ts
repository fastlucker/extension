import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  primaryLabel: ViewStyle
  defaultLabel: ViewStyle
  successLabel: ViewStyle
  warningLabel: ViewStyle
  networkIcon: ViewStyle
}

const label: ViewStyle = {
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 8,
  borderWidth: 1,
  borderRadius: 50
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...spacings.ph,
      ...spacings.pvTy,
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      backgroundColor: colors.melrose_15,
      borderColor: theme.secondaryBorder,
      width: '100%',
      flex: 1,
      maxHeight: 78
    },
    primaryLabel: {
      ...label,
      borderColor: theme.primary,
      backgroundColor: '#F6F0FF',
      marginLeft: 4
    },
    defaultLabel: {
      ...label,
      borderColor: colors.martinique_80,
      backgroundColor: '#F2F3FA'
    },
    warningLabel: {
      ...label,
      borderColor: '#B89C4B',
      backgroundColor: '#F5F4EF'
    },
    successLabel: {
      ...label,
      borderColor: theme.successDecorative,
      backgroundColor: '#EBF5F0'
    },
    networkIcon: {
      borderRadius: 50,
      backgroundColor: colors.white,
      borderColor: colors.quartz,
      borderWidth: 2
    }
  })

export default getStyles
